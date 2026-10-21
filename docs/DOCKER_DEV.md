# Docker Development Guide

This repository includes a dedicated Docker development setup configured for instant hot reloading (Fast Refresh), volume-isolated `node_modules`, and seamless local development.

---

## Quick Start

### 1. Start Development Server

Run any of the following commands:

```bash
# Using npm
npm run docker:dev

# Using make
make docker-dev

# Using Docker Compose directly
docker compose -f docker-compose.dev.yml up --build

# Or using standard compose
docker compose up --build
```

The application will start with live-reloading at **[http://localhost:2000](http://localhost:2000)** (or your custom `$PORT`).

---

## How Hot Reloading Works

- **Source Code Sync (`.:/app`)**: Your local files are bind-mounted directly into the container. Any edit you make in `src/`, `public/`, or other project files is immediately detected inside the container.
- **Isolated Node Modules (`frontend_node_modules`)**: Linux container dependencies remain isolated in a persistent named Docker volume so host OS binaries (e.g., macOS ARM/x64) do not conflict with the Alpine Linux container.
- **Isolated Build Cache (`frontend_next`)**: Next.js compilation caches are isolated to avoid collisions with any local `.next` builds.
- **Cross-Platform Watchpack Polling**: Webpack and Watchpack polling (`poll: 800`) is configured across both Server Components and Client Components in `next.config.ts`, ensuring instant updates even across macOS VirtioFS/gRPC filesystem boundaries.

---

## Common Development Commands

### Stop the Container

```bash
docker compose -f docker-compose.dev.yml down
# or
make docker-down
```

### Install a New NPM Dependency

If you add or update dependencies:

```bash
# Run inside the active container
docker compose -f docker-compose.dev.yml exec frontend-dev npm install <package-name>
```

### Run on a Different Port (e.g. 3000)

```bash
PORT=3000 docker compose -f docker-compose.dev.yml up
```

Open **[http://localhost:3000](http://localhost:3000)**.

### View Logs

```bash
docker compose -f docker-compose.dev.yml logs -f
```

### Check Container Health

```bash
curl http://localhost:2000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "wisdom-frontend",
  "timestamp": "..."
}
```
