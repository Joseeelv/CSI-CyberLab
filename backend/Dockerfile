FROM node:20-alpine

WORKDIR /app

# Install latest stable pnpm
RUN npm install -g pnpm \
    && npm cache clean --force

# Copy package files AND lockfile
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with frozen lockfile
RUN pnpm install

# Copy source code
COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]
