# Quickstart Guide: FastAPI Secure Multi-User Todo API

## Setup Instructions

### Prerequisites
- Python 3.11+
- pip package manager
- Neon PostgreSQL account and database URL
- Better Auth configured for the frontend

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create environment file:**
   ```bash
   touch .env
   ```

   Add the following to your `.env` file:
   ```env
   DATABASE_URL=your_neon_postgresql_connection_string
   BETTER_AUTH_SECRET=your_better_auth_secret
   ```

### Environment Variables

- `DATABASE_URL`: Neon Serverless PostgreSQL connection string with SSL
- `BETTER_AUTH_SECRET`: Secret key used by Better Auth for JWT signing (must match frontend)

### Running the Application

1. **Start the development server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

2. **Verify the server is running:**
   Visit `http://localhost:8000/docs` to see the API documentation

## API Usage

### Authentication

All API endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token_here>
```

The JWT token should be obtained from the Better Auth frontend authentication system.

### Available Endpoints

- `GET /api/tasks` - List all tasks for the authenticated user
- `POST /api/tasks` - Create a new task for the authenticated user
- `GET /api/tasks/{task_id}` - Get a specific task
- `PUT /api/tasks/{task_id}` - Update a specific task
- `DELETE /api/tasks/{task_id}` - Delete a specific task
- `PATCH /api/tasks/{task_id}/complete` - Toggle task completion status

## Testing

### Using curl

1. **Get tasks (replace YOUR_JWT_TOKEN with a valid token):**
   ```bash
   curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:8000/api/tasks
   ```

2. **Create a task:**
   ```bash
   curl -X POST \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"title":"My first task","description":"A sample task"}' \
     http://localhost:8000/api/tasks
   ```

### Frontend Integration

The backend is designed to work seamlessly with the frontend:
- CORS is configured for `http://localhost:3000`
- API client in frontend should use `http://localhost:8000/api` as the base URL
- JWT tokens from Better Auth will be accepted automatically

## Development

### Project Structure
- `main.py` - Application entry point with CORS and router configuration
- `models.py` - Task model definition using SQLModel
- `database.py` - Database engine and session management
- `dependencies.py` - JWT authentication and database dependencies
- `routes/tasks.py` - All task-related endpoint definitions

### Code Generation

The backend code is generated using Claude Code with the Backend Subagent following the spec-driven approach outlined in the constitution.