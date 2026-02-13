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

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app

# Native deps often needed by Next 16 toolchain (sharp, etc.)
RUN apk add --no-cache libc6-compat ca-certificates python3 make g++ vips-dev \
 && update-ca-certificates

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# ✅ Build-time env (needed because your pages prerender at build time)
ARG NEXT_PUBLIC_BACKEND_URL=https://api.wisdomchurchhq.org/api/v1
ARG NEXT_PUBLIC_API_URL=https://api.wisdomchurchhq.org/api/v1

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

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "start"]
