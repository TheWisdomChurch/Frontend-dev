# Development Dockerfile with hot reload - OPTIMIZED
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

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

# Expose port
EXPOSE 2000

# Start development server
CMD ["npm", "run", "dev"]