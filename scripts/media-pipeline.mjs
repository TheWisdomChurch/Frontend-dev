#!/usr/bin/env node
/* global process, console */

import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const cwd = process.cwd();
const SOURCE_DIR = path.resolve(cwd, process.env.MEDIA_SOURCE_DIR || 'public');
const OUTPUT_DIR = path.resolve(
  cwd,
  process.env.MEDIA_OUTPUT_DIR || 'public/_optimized'
);
const MANIFEST_PATH = path.resolve(
  cwd,
  process.env.MEDIA_MANIFEST_PATH || 'public/_optimized/manifest.json'
);

const WEBP_QUALITY = Number(process.env.MEDIA_IMAGE_WEBP_QUALITY || '78');
const VIDEO_CRF = Number(process.env.MEDIA_VIDEO_WEBM_CRF || '34');
const FFMPEG_BIN = process.env.FFMPEG_PATH || 'ffmpeg';

const IMAGE_WIDTHS = String(
  process.env.MEDIA_IMAGE_WIDTHS || '480,768,1280,1920'
)
  .split(',')
  .map(value => Number(value.trim()))
  .filter(Number.isFinite)
  .filter(value => value > 0)
  .sort((a, b) => a - b);

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const VIDEO_EXTENSIONS = new Set(['.mp4', '.mov', '.m4v']);

const isDryRun = process.argv.includes('--dry-run');
const shouldClean = process.argv.includes('--clean');

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function hashBuffer(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(directoryPath) {
  if (isDryRun) return;
  await fs.mkdir(directoryPath, { recursive: true });
}

function isUnderOutputDir(filePath) {
  const rel = path.relative(OUTPUT_DIR, filePath);
  return rel === '' || (!rel.startsWith('..') && !path.isAbsolute(rel));
}

async function walkFiles(directoryPath, acc = []) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      if (isUnderOutputDir(fullPath)) continue;
      await walkFiles(fullPath, acc);
      continue;
    }
    acc.push(fullPath);
  }
  return acc;
}

function detectFfmpeg() {
  const result = spawnSync(FFMPEG_BIN, ['-version'], { stdio: 'ignore' });
  return result.status === 0;
}

async function processImage(inputPath, sourceBuffer, manifestFiles) {
  const rel = path.relative(SOURCE_DIR, inputPath);
  const relDir = path.dirname(rel);
  const extension = path.extname(rel).toLowerCase();
  const baseName = path.basename(rel, extension);

  const image = sharp(sourceBuffer).rotate();
  const metadata = await image.metadata();
  const originalWidth = metadata.width || 0;
  const targetWidths = IMAGE_WIDTHS.filter(width => width < originalWidth);

  const outputBaseDir = path.join(OUTPUT_DIR, relDir);
  await ensureDir(outputBaseDir);

  const outputs = [];
  const originalOutput = path.join(outputBaseDir, `${baseName}.webp`);
  outputs.push({
    path: originalOutput,
    width: originalWidth || null,
    publicPath: `/${toPosix(path.relative(path.join(cwd, 'public'), originalOutput))}`,
  });

  for (const width of targetWidths) {
    const resizedOutput = path.join(outputBaseDir, `${baseName}@w${width}.webp`);
    outputs.push({
      path: resizedOutput,
      width,
      publicPath: `/${toPosix(path.relative(path.join(cwd, 'public'), resizedOutput))}`,
    });
  }

  const blurOutput = path.join(outputBaseDir, `${baseName}@blur.webp`);
  outputs.push({
    path: blurOutput,
    width: 24,
    publicPath: `/${toPosix(path.relative(path.join(cwd, 'public'), blurOutput))}`,
  });

  if (!isDryRun) {
    await sharp(sourceBuffer).rotate().webp({ quality: WEBP_QUALITY }).toFile(originalOutput);
    for (const width of targetWidths) {
      await sharp(sourceBuffer)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: WEBP_QUALITY })
        .toFile(path.join(outputBaseDir, `${baseName}@w${width}.webp`));
    }
    await sharp(sourceBuffer)
      .rotate()
      .resize({ width: 24, withoutEnlargement: true })
      .webp({ quality: 50 })
      .toFile(blurOutput);
  }

  manifestFiles[toPosix(rel)] = {
    type: 'image',
    sourceHash: hashBuffer(sourceBuffer),
    updatedAt: new Date().toISOString(),
    variants: outputs.map(item => ({
      path: item.publicPath,
      width: item.width,
    })),
  };
}

async function processVideo(inputPath, sourceBuffer, manifestFiles, ffmpegAvailable) {
  const rel = path.relative(SOURCE_DIR, inputPath);
  const relDir = path.dirname(rel);
  const extension = path.extname(rel).toLowerCase();
  const baseName = path.basename(rel, extension);
  const outputBaseDir = path.join(OUTPUT_DIR, relDir);
  await ensureDir(outputBaseDir);

  const webmOutput = path.join(outputBaseDir, `${baseName}.webm`);
  const manifestKey = toPosix(rel);

  const manifestEntry = {
    type: 'video',
    sourceHash: hashBuffer(sourceBuffer),
    updatedAt: new Date().toISOString(),
    variants: [
      {
        path: `/${toPosix(path.relative(path.join(cwd, 'public'), webmOutput))}`,
        format: 'webm',
      },
      {
        path: `/${toPosix(rel)}`,
        format: extension.slice(1),
      },
    ],
    status: 'optimized',
  };

  if (!ffmpegAvailable) {
    manifestEntry.status = 'skipped_no_ffmpeg';
    manifestFiles[manifestKey] = manifestEntry;
    return;
  }

  if (!isDryRun) {
    const args = [
      '-y',
      '-i',
      inputPath,
      '-c:v',
      'libvpx-vp9',
      '-b:v',
      '0',
      '-crf',
      String(VIDEO_CRF),
      '-deadline',
      'good',
      '-cpu-used',
      '2',
      '-row-mt',
      '1',
      '-c:a',
      'libopus',
      '-b:a',
      '96k',
      webmOutput,
    ];
    const result = spawnSync(FFMPEG_BIN, args, { stdio: 'inherit' });
    if (result.status !== 0) {
      manifestEntry.status = 'failed_ffmpeg';
    }
  }

  manifestFiles[manifestKey] = manifestEntry;
}

async function main() {
  const startedAt = Date.now();

  if (!(await pathExists(SOURCE_DIR))) {
    console.error(`[media] Source directory not found: ${SOURCE_DIR}`);
    process.exit(1);
  }

  if (shouldClean && !isDryRun && (await pathExists(OUTPUT_DIR))) {
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true });
  }
  await ensureDir(OUTPUT_DIR);

  const ffmpegAvailable = detectFfmpeg();
  if (!ffmpegAvailable) {
    console.warn(
      `[media] ffmpeg not found (${FFMPEG_BIN}); video .webm generation will be skipped.`
    );
  }

  const allFiles = await walkFiles(SOURCE_DIR);
  const imageFiles = allFiles.filter(file =>
    IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase())
  );
  const videoFiles = allFiles.filter(file =>
    VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase())
  );

  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceDir: toPosix(path.relative(cwd, SOURCE_DIR)),
    outputDir: toPosix(path.relative(cwd, OUTPUT_DIR)),
    dryRun: isDryRun,
    files: {},
  };

  for (const imageFile of imageFiles) {
    const sourceBuffer = await fs.readFile(imageFile);
    await processImage(imageFile, sourceBuffer, manifest.files);
  }

  for (const videoFile of videoFiles) {
    const sourceBuffer = await fs.readFile(videoFile);
    await processVideo(videoFile, sourceBuffer, manifest.files, ffmpegAvailable);
  }

  if (!isDryRun) {
    await ensureDir(path.dirname(MANIFEST_PATH));
    await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  }

  const elapsedMs = Date.now() - startedAt;
  console.log(
    `[media] done: images=${imageFiles.length}, videos=${videoFiles.length}, dryRun=${isDryRun}, elapsed=${elapsedMs}ms`
  );
  if (!isDryRun) {
    console.log(
      `[media] manifest: /${toPosix(path.relative(path.join(cwd, 'public'), MANIFEST_PATH))}`
    );
  }
}

main().catch(error => {
  console.error('[media] failed:', error);
  process.exit(1);
});
