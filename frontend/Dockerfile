FROM node:20-alpine

WORKDIR /app

# Install pnpm globally and wget for healthcheck
RUN npm install -g pnpm && apk add --no-cache wget

# Copy package files
COPY package.json ./

# Install dependencies with pnpm
RUN pnpm install 

# Copy source code
COPY . .

EXPOSE 3001

CMD ["pnpm", "run", "dev"]
