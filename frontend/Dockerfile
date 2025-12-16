FROM node:20-alpine

WORKDIR /app

# Install a specific trusted version of pnpm globally
RUN npm install -g pnpm \
    && npm cache clean --force

# Copy package files 
COPY package.json pnpm-lock.yaml ./

# Install dependencies with pnpm
RUN pnpm install 

# Copy source code
COPY . .

EXPOSE 3001

CMD ["pnpm", "run", "dev"]
