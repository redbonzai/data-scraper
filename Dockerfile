FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install necessary packages
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm \
    bash

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package.json
COPY package*.json ./

# Install dependencies
RUN npm install -g pnpm @nestjs/cli
RUN pnpm install

# Copy application files
COPY . .

# Build the application
RUN pnpm run build

# Create final runtime image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm \
    bash

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install pnpm and Nest CLI globally
RUN npm install -g pnpm @nestjs/cli

# Copy built files from previous stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy configuration files
COPY tsconfig.json ./
COPY .env ./

# Expose port
EXPOSE 3050

# Start the application
CMD ["node", "dist/main.js"]
