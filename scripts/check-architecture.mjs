import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const violations = [];

const forbiddenRootFiles = [
  'ANALYTICS_CONFIGURATION.ts',
  'ANALYTICS_EXAMPLES.tsx',
  'C\uf03aTempeslint-full.txt',
];

for (const file of forbiddenRootFiles) {
  if (existsSync(join(root, file))) {
    violations.push(
      `${file}: generated, diagnostic, or example code must not live at the repository root`
    );
  }
}

function filesBelow(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory).flatMap(entry => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? filesBelow(path) : [path];
  });
}

const legacyAnalytics = filesBelow(join(root, 'src/lib/analytics'));
for (const file of legacyAnalytics) {
  violations.push(
    `${relative(root, file)}: analytics belongs in src/shared/analytics`
  );
}

const sourceFiles = filesBelow(join(root, 'src')).filter(file =>
  /\.(?:ts|tsx)$/.test(file)
);

for (const file of sourceFiles) {
  const source = readFileSync(file, 'utf8');
  const displayPath = relative(root, file);

  if (source.trim().length === 0) {
    violations.push(`${displayPath}: empty source files are not allowed`);
  }

  if (
    /from\s+['"]@\/lib\/types['"]/.test(source) &&
    /\b(Product|CartItem|CustomerInfo|Order|YouTubeVideo|LeadershipMember|LeadershipRole)\b/.test(
      source
    )
  ) {
    violations.push(
      `${displayPath}: domain models must be imported from src/domain, not the legacy catch-all types module`
    );
  }
}

const tsconfig = readFileSync(join(root, 'tsconfig.json'), 'utf8');
if (/ANALYTICS_(CONFIGURATION|EXAMPLES)/.test(tsconfig)) {
  violations.push(
    'tsconfig.json: root-level analytics examples must not be compiled as application code'
  );
}

const layout = readFileSync(join(root, 'src/app/layout.tsx'), 'utf8');
if (/MetaPixel/.test(layout)) {
  violations.push(
    'src/app/layout.tsx: analytics vendors must be initialized only by AnalyticsProvider'
  );
}

if (violations.length > 0) {
  console.error('Architecture checks failed:\n');
  for (const violation of violations) console.error(`  - ${violation}`);
  process.exit(1);
}

console.log('Architecture checks passed.');
