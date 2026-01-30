# ---- deps ----
FROM node:20-alpine AS deps
WORKDIR /app

ARG NPM_REGISTRY=https://registry.npmjs.org/
RUN npm config set registry ${NPM_REGISTRY} \
 && npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000

COPY package*.json ./
RUN npm ci

# ---- builder ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- production runner ----
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=2000
EXPOSE 2000

# If you use Next.js "standalone" output, enable it in next.config.js:
# output: "standalone"
# Then copy standalone server:
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./ .next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

CMD ["npm", "start"]
