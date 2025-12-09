# Backend API Documentation

This is the backend API for the CSI-CyberLab project, built with NestJS and PostgreSQL. It provides a RESTful API for managing labs, users, containers, and other resources.

## Project Structure

The backend follows a modular structure with the following main modules:
- `auth`: Authentication endpoints (register, login, logout, me)
- `users`: User management
- `labs`: Lab management
- `containers`: Container management
- `status`: Status management
- `operating-systems`: Operating system management
- `categories`: Category management
- `images`: Image management
- `difficulty`: Difficulty level management

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout and clear JWT token

### Labs
- `GET /api/labs` - Get all labs
- `GET /api/labs/:id` - Get a specific lab
- `POST /api/labs` - Create a new lab
- `PUT /api/labs/:id` - Update a lab
- `DELETE /api/labs/:id` - Delete a lab

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a specific category
- `POST /api/categories` - Create a new category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Difficulty Levels
- `GET /api/difficulty` - Get all difficulty levels
- `GET /api/difficulty/:id` - Get a specific difficulty level
- `POST /api/difficulty` - Create a new difficulty level
- `PUT /api/difficulty/:id` - Update a difficulty level
- `DELETE /api/difficulty/:id` - Delete a difficulty level

### Operating Systems
- `GET /api/operating-systems` - Get all operating systems
- `GET /api/operating-systems/:id` - Get a specific operating system
- `POST /api/operating-systems` - Create a new operating system
- `PUT /api/operating-systems/:id` - Update an operating system
- `DELETE /api/operating-systems/:id` - Delete an operating system

### Containers
- `GET /api/containers` - Get all containers
- `GET /api/containers/:id` - Get a specific container
- `POST /api/containers` - Create a new container
- `PUT /api/containers/:id` - Update a container
- `DELETE /api/containers/:id` - Delete a container

### Status
- `GET /api/status` - Get all status
- `GET /api/status/:id` - Get a specific status
- `POST /api/status` - Create a new status
- `PUT /api/status/:id` - Update a status
- `DELETE /api/status/:id` - Delete a status

### Images
- `GET /api/images` - Get all images
- `GET /api/images/:id` - Get a specific image
- `POST /api/images` - Create a new image
- `PUT /api/images/:id` - Update an image
- `DELETE /api/images/:id` - Delete an image

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## Design Principles

### Architecture
- **Modular**: Each feature is organized into its own module
- **RESTful**: Follows REST conventions for API endpoints
- **TypeScript**: Strongly typed code for better maintainability
- **NestJS**: Uses NestJS framework for scalable application architecture

### Security
- **JWT Authentication**: Secure token-based authentication
- **Cookie-based Sessions**: Secure cookies for session management
- **Input Validation**: Built-in validation pipes for request data
- **CORS Configuration**: Configurable CORS for frontend integration

### Database
- **PostgreSQL**: Relational database for data persistence
- **TypeORM**: ORM for database operations
- **Entities**: Database entities for each resource type

### Error Handling
- **Global Pipes**: Validation and transformation of input data
- **Custom Exceptions**: Specific error handling for different scenarios
- **HTTP Status Codes**: Proper HTTP status codes for responses

## Environment Variables

The backend requires the following environment variables:
- `DATABASE_HOST`: Database host
- `DATABASE_PORT`: Database port
- `DATABASE_USER`: Database username
- `DATABASE_PASSWORD`: Database password
- `DATABASE_NAME`: Database name
- `JWT_SECRET`: Secret for JWT token generation
- `FRONTEND_URL`: URL of the frontend application for CORS

## Development Setup

1. Install dependencies: `pnpm install`
2. Set up environment variables in `.env` file
3. Run database migrations: `pnpm run migrate`
4. Start development server: `pnpm run start:dev`

## Deployment

The backend can be deployed using Docker with the provided Dockerfile. The application listens on port 3000 by default.