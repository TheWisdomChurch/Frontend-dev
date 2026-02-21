# Git Hooks

This project uses repository-local Git hooks via:

```bash
git config core.hooksPath .githooks
```

## Hooks

- `pre-commit`
  - Validates staged files only.
  - Blocks merge-conflict markers.
  - Runs `lint-staged` (Prettier + ESLint on staged files).
  - Runs TypeScript check when staged files include `*.ts` or `*.tsx`.

- `pre-push`
  - Runs full repository gates:
    - TypeScript (`tsc --noEmit --skipLibCheck`)
    - ESLint (`eslint . --max-warnings 0`)
    - Production build (`next build`)

## Setup

```bash
npm run hooks:setup
```

## Dry-run

```bash
npm run hooks:dry-run:commit
npm run hooks:dry-run:push
```

## Bypass switches

- Skip all hooks:
  - `SKIP_GIT_HOOKS=1`
- Skip build in pre-push:
  - `SKIP_PREPUSH_BUILD=1`
