# Dockerfile.dev - development build with hot reload
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Expose the same port your Next app uses
EXPOSE 2000

CMD ["npm", "run", "dev"]
