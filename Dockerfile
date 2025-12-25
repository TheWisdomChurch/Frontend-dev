# Development Dockerfile with hot reload
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 2000

# Start development server with polling enabled
CMD ["npm", "run", "dev"]