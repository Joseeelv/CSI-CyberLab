# CSI-CyberLab

## Project Overview

CSI-CyberLab is a comprehensive cybersecurity platform designed to provide advanced threat detection, analysis, and response capabilities. The platform consists of a modern web application with a NestJS backend and a Next.js frontend, integrated with PostgreSQL for data persistence.

## Architecture

The platform follows a microservices architecture with the following components:

- **Backend**: Built with NestJS (TypeScript) - RESTful API with authentication and data management
- **Frontend**: Built with Next.js (React) - Modern, responsive user interface
- **Database**: PostgreSQL - Relational database for storing security data and user information
- **Infrastructure**: Dockerized services with docker-compose orchestration

## Features

- User authentication and authorization
- Security threat detection and analysis
- Real-time monitoring dashboard
- Data visualization and reporting
- API endpoints for security operations
- Responsive web interface

## Technology Stack

### Backend

- **NestJS** - Node.js framework for building efficient server-side applications
- **TypeScript** - Typed JavaScript for better code quality
- **PostgreSQL** - Relational database management system
- **TypeORM** - Object-relational mapping for database operations
- **JWT** - JSON Web Token for authentication

### Frontend

- **Next.js** - React framework for production applications
- **React** - JavaScript library for building user interfaces
- **TypeScript** - Typed JavaScript for better code quality
- **Tailwind CSS** - Utility-first CSS framework

### Infrastructure

- **Docker** - Containerization platform
- **Docker Compose** - Multi-container Docker application orchestration
- **Nginx** - Web server and reverse proxy

## Project Structure

```
.
├── backend/           # NestJS backend application
│   ├── src/           # Source code
│   ├── dist/          # Built output
│   ├── Dockerfile     # Backend Docker configuration
│   └── package.json   # Backend dependencies
├── frontend/          # Next.js frontend application
│   ├── app/           # App router pages
│   ├── components/    # Reusable components
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── nginx/             # Nginx configuration
│   └── nginx.conf     # Nginx server configuration
├── docker-compose.yml # Docker orchestration
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Docker and Docker Compose installed
- Node.js (v16 or higher) for local development (optional)
- pnpm package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd CSI-CyberLab
```

2. Build and start the containers:

```bash
docker-compose up --build
```

3. The application will be available at:
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000/api

### Development

For local development, you can run the services separately:

#### Backend Development

```bash
cd backend
pnpm install
pnpm start:dev
```

#### Frontend Development

```bash
cd frontend
pnpm install
pnpm dev
```

## Environment Variables

### Backend

Create a `.env` file in the backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/csi_cyberlab
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### Frontend

Create a `.env` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## API Documentation

The backend provides a RESTful API with endpoints for:

- User authentication and management
- Security threat data operations
- System configuration
- Monitoring and reporting

API documentation is available at `/api` when the backend is running.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the maintainers.

## Acknowledgments

- Built with NestJS and Next.js
- Inspired by modern cybersecurity practices
- Developed with security best practices in mind

```

```
