const { execSync } = require('child_process');

console.log('🚀 Running pre-push checks...');

const checks = [
  { name: 'Type checking', command: 'npm run type-check' },
  { name: 'Linting', command: 'npm run lint' },
  { name: 'Formatting', command: 'npm run prettier' },
  { name: 'Building', command: 'npm run build' },
];

for (const check of checks) {
  console.log(`\n📝 ${check.name}...`);
  try {
    execSync(check.command, { stdio: 'inherit' });
    console.log(`✅ ${check.name} passed`);
  } catch (error) {
    console.error(`❌ ${check.name} failed!`);
    console.error('Fix the errors above before pushing.');
    process.exit(1);
  }
}

console.log('\n🎉 All checks passed! Ready to push.');
