FROM node:20-alpine

# Build arguments for NPM registry
ARG NPM_REGISTRY=https://registry.npmjs.org/

WORKDIR /app

# Set NPM registry from build arg
RUN npm config set registry ${NPM_REGISTRY} && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Install dependencies first (better caching)
COPY package*.json ./

# Clear npm cache and install with retry
RUN npm cache clean --force
RUN npm install --verbose --no-optional

# Copy source code
COPY . .

# Set development environment variables
ENV NODE_ENV=development
ENV DOCKER_ENV=true  
ENV WATCHPACK_POLLING=true
ENV CHOKIDAR_USEPOLLING=true
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_WEBPACK_USEPOLLING=1
ENV HOST=0.0.0.0

ENV PORT=2000
EXPOSE 2000

# Start development server
CMD ["npm", "run", "dev"]