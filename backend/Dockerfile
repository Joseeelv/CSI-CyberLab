FROM node:20-alpine

WORKDIR /app

# Install pnpm globally and curl for healthcheck
RUN npm install -g pnpm && apk add --no-cache curl

# Copy package files
COPY package.json ./

# Install dependencies with pnpm
RUN pnpm install

# Copy source code
COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
