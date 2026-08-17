# syntax=docker/dockerfile:1

# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app

# Needed for registry TLS + some native deps
RUN apk add --no-cache ca-certificates libc6-compat \
 && update-ca-certificates

ARG NPM_REGISTRY=https://registry.npmjs.org/
RUN npm config set registry ${NPM_REGISTRY} \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./

# If you have a prepare script that uses git hooks, it can break in Docker.
# Safe to run even if it doesn't exist.
RUN npm pkg delete scripts.prepare || true

RUN npm ci --no-audit --no-fund

# ---- development ----
FROM node:20-alpine AS development
WORKDIR /app

RUN apk add --no-cache ca-certificates libc6-compat ffmpeg \
 && update-ca-certificates

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=2000
EXPOSE 2000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "2000"]

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Native deps for Next toolchain + media pipeline (sharp + ffmpeg)
RUN apk add --no-cache libc6-compat ca-certificates python3 make g++ vips-dev ffmpeg \
 && update-ca-certificates

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Browser requests stay same-origin and are handled by the audited
# /api/v1 route handler. Do not bake the private upstream into client bundles.
ARG NEXT_PUBLIC_BACKEND_URL=
ARG NEXT_PUBLIC_API_URL=

# ✅ Stable defaults, overridable with --build-arg
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build --loglevel verbose

# ---- production runner ----
FROM node:20-alpine AS production
WORKDIR /app

RUN apk add --no-cache ca-certificates libc6-compat \
 && update-ca-certificates

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=2000
EXPOSE 2000

# Next's standalone output contains only production runtime dependencies.
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
CMD ["node", "server.js"]
