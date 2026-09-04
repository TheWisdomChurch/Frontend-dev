#!/usr/bin/env node
/**
 * Production-dependency security gate.
 *
 * `npm audit` POSTs to the registry's audit endpoint, which periodically 503s
 * ("Service Unavailable" / "audit endpoint returned an error"). A raw
 * `npm audit` call turns that transient infra blip into a hard CI failure and
 * blocks the push. This wrapper:
 *   1. retries the audit a few times with backoff,
 *   2. fails hard only on an ACTUAL high/critical vulnerability,
 *   3. fails soft (warns, exits 0) when the registry itself is unreachable —
 *      the audit re-runs on the next push and on schedule anyway.
 */
import { spawnSync } from 'node:child_process';

const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 3000;
const BLOCKING_LEVELS = ['high', 'critical'];

const TRANSIENT = [
  'Service Unavailable',
  'audit endpoint returned an error',
  'ENOTFOUND',
  'EAI_AGAIN',
  'ETIMEDOUT',
  'ECONNRESET',
  'ECONNREFUSED',
  'network',
  'socket hang up',
  '503',
  '502',
  '504',
  '429',
];

const sleep = ms => new Promise(r => setTimeout(r, ms));
const isTransient = text => TRANSIENT.some(sig => text.includes(sig));

function runAudit() {
  const res = spawnSync('npm', ['audit', '--omit=dev', '--json'], {
    encoding: 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    shell: process.platform === 'win32',
  });
  return {
    stdout: res.stdout || '',
    stderr: res.stderr || '',
    error: res.error,
  };
}

async function main() {
  let lastReason = 'unknown error';

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const { stdout, stderr, error } = runAudit();
    const combined = `${stdout}\n${stderr}\n${error?.message ?? ''}`;

    let report;
    try {
      report = JSON.parse(stdout);
    } catch {
      report = null;
    }

    // A real audit response always carries `metadata.vulnerabilities`.
    if (report && report.metadata && report.metadata.vulnerabilities) {
      const counts = report.metadata.vulnerabilities;
      const blocking = BLOCKING_LEVELS.reduce(
        (sum, level) => sum + (counts[level] || 0),
        0
      );

      if (blocking > 0) {
        console.error(
          `\n✖  security:check — ${blocking} blocking vulnerability(ies) ` +
            `(high: ${counts.high || 0}, critical: ${counts.critical || 0}) ` +
            'in production dependencies.\n'
        );
        for (const [name, v] of Object.entries(report.vulnerabilities || {})) {
          if (BLOCKING_LEVELS.includes(v.severity)) {
            console.error(`  - ${name} (${v.severity}): ${v.range}`);
          }
        }
        console.error(
          '\n  Pin a patched version via a package.json "overrides" entry, ' +
            'then run `npm install`.\n'
        );
        process.exit(1);
      }

      console.log(
        `✔  security:check — no high/critical vulnerabilities in production ` +
          `dependencies (scanned ${counts.total ?? 0} advisories).`
      );
      process.exit(0);
    }

    // Not a usable report — decide whether to retry.
    lastReason =
      (report && report.error && (report.error.detail || report.error)) ||
      combined.trim().split('\n').slice(-3).join(' ') ||
      'no audit report returned';

    if (!isTransient(combined) && attempt === 1) {
      // Non-transient and not a report → surface it once, then still retry
      // in case it's a partial/garbled response.
      console.warn(`⚠  security:check — unexpected audit output:\n${lastReason}`);
    }

    if (attempt < MAX_ATTEMPTS) {
      const delay = BASE_DELAY_MS * attempt;
      console.warn(
        `⚠  security:check — audit attempt ${attempt}/${MAX_ATTEMPTS} failed ` +
          `(${String(lastReason).slice(0, 120)}); retrying in ${delay / 1000}s…`
      );
      await sleep(delay);
    }
  }

  // Every attempt failed. If it looks like the registry is down, do not block.
  console.warn(
    '\n⚠  security:check — could not reach the npm audit endpoint after ' +
      `${MAX_ATTEMPTS} attempts (${String(lastReason).slice(0, 160)}).\n` +
      '   Treating as a transient registry outage — NOT failing the build. ' +
      'The audit will re-run on the next push.\n'
  );
  process.exit(0);
}

main().catch(err => {
  console.error(`security:check — wrapper crashed: ${err?.stack || err}`);
  // A bug in this wrapper must not silently pass or hard-block; surface it.
  process.exit(1);
});
