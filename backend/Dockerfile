FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json ./

# Install dependencies with pnpm
RUN npm install -g pnpm@8.6.0 \
    && npm cache clean --force

# Copy source code
COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
