# FastAPI Secure Multi-User Todo API

This is a secure, multi-user todo application backend built with FastAPI and SQLModel, providing persistent storage in Neon Serverless PostgreSQL with complete CRUD functionality and JWT authentication integration.

## Features

- **Secure Authentication**: JWT-based authentication using Better Auth compatible tokens
- **Multi-User Support**: Each user has isolated tasks with strict user isolation
- **Full CRUD Operations**: Create, read, update, delete, and toggle completion status
- **Persistent Storage**: Tasks stored in Neon PostgreSQL with SSL connection
- **Frontend Integration**: Designed for seamless integration with Next.js frontend

## API Endpoints

All endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

### Tasks

- `GET /api/tasks` - List all tasks for the authenticated user
- `POST /api/tasks` - Create a new task (requires `title`)
- `GET /api/tasks/{task_id}` - Get a specific task
- `PUT /api/tasks/{task_id}` - Update a specific task
- `DELETE /api/tasks/{task_id}` - Delete a specific task
- `PATCH /api/tasks/{task_id}/complete` - Toggle task completion status

## Getting Started

### Prerequisites

- Python 3.11+
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file with the following variables:

```env
BETTER_AUTH_SECRET=your_better_auth_secret_here
DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
```

4. Run the application:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

## Environment Variables

- `BETTER_AUTH_SECRET`: Secret key used by Better Auth for JWT signing (must match frontend)
- `DATABASE_URL`: Connection string for the PostgreSQL database

## Security

- All API endpoints require JWT authentication
- Users can only access their own tasks (strict user isolation)
- JWT tokens are verified using HS256 algorithm
- Input validation is performed on all requests

## Database

The application uses SQLModel with the following entity:

### Task Entity
- `id`: Integer, Primary Key, Auto-increment
- `user_id`: String (UUID format), Foreign Key to Better Auth Users
- `title`: String, Required, Not Null
- `description`: String, Optional, Nullable
- `completed`: Boolean, Default False
- `created_at`: DateTime, Auto-populated on creation
- `updated_at`: DateTime, Auto-populated on update

## Development

For development, the application can be run with hot reloading:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API documentation is automatically available at `/docs` and `/redoc`.