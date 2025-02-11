# ---- Stage 1: Build the Application ----
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install necessary system dependencies for Chromium & Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm \
    bash \
    font-noto \
    font-noto-cjk \
    font-noto-emoji \
    msttcorefonts-installer \
    fontconfig \
    udev \
    tzdata

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install -g pnpm @nestjs/cli
RUN pnpm install

# Copy application files and build the application
COPY . .
RUN pnpm run build

# ---- Stage 2: Create Final Runtime Image ----
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install runtime dependencies for Chromium & Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm \
    bash \
    font-noto \
    font-noto-cjk \
    font-noto-emoji \
    msttcorefonts-installer \
    fontconfig \
    udev \
    tzdata

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install pnpm and Nest CLI globally
RUN npm install -g pnpm @nestjs/cli

# Copy built application files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Copy configuration files
COPY tsconfig.json ./
COPY .env ./

# Expose application port
EXPOSE 3050

# Set entrypoint for the application
CMD ["node", "dist/main.js"]
