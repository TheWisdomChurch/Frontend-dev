const { execSync } = require('child_process');

const checks = [
  { name: 'Type checking', command: 'npm run type-check' },
  { name: 'Linting', command: 'npm run lint' },
  { name: 'Formatting', command: 'npm run prettier' },
  { name: 'Building', command: 'npm run build' },
];

for (const check of checks) {
  try {
    execSync(check.command, { stdio: 'inherit' });
  } catch (error) {
    process.exit(1);
  }
}
