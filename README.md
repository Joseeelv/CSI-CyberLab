# CSI CyberLab Project

## Project Overview

This is a full-stack application built using NestJS for the backend and React with Next.js for the frontend. The project follows a microservices architecture with clear separation of concerns and uses a pnpm workspace for dependency management.

## Architecture

- **Backend**: NestJS (TypeScript, Node.js)
- **Frontend**: React with Next.js (TypeScript)
- **Database**: PostgreSQL and MongoDB
- **Dependency Management**: pnpm workspace
- **Containerization**: Docker with Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development)

### Running with Docker (Recommended)

```bash
# Build and start all services
$ docker-compose up --build
```

The application will be available at:
- Backend API: http://localhost:3000
- Frontend: http://localhost:3001
- PostgreSQL: localhost:5432

### Development Notes

- The project uses a pnpm workspace to manage dependencies across both backend and frontend
- Changes to source code are automatically reflected in running containers
- Environment variables are stored in separate .env files

## Project Structure

```
.
├── backend/           # NestJS backend application
├── frontend/          # Next.js frontend application
├── docker-compose.yml # Docker orchestration
├── pnpm-workspace.yaml # PNPM workspace configuration
├── pnpmfile.js        # PNPM hooks
└── README.md          # This file
```

## Key Features

- Microservices architecture
- TypeScript support
- Docker containerization
- pnpm workspace for dependency management
- PostgreSQL and MongoDB integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
