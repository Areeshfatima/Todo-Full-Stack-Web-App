# API Contract for Todo Web Interface

## Authentication Endpoints

### POST /api/auth/signup
Register a new user account.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "user": {
    "id": "user_12345",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Invalid email format" // or "Email already exists"
}
```

### POST /api/auth/login
Authenticate a user and return JWT token.

**Request**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (Success)**:
```json
{
  "success": true,
  "user": {
    "id": "user_12345",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt_token_here"
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

### POST /api/auth/logout
Logout the current user.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response**:
```json
{
  "success": true
}
```

## Task Management Endpoints

### GET /api/tasks
Retrieve all tasks for the authenticated user.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response (Success)**:
```json
{
  "tasks": [
    {
      "id": "task_12345",
      "userId": "user_12345",
      "title": "Complete project documentation",
      "description": "Write comprehensive docs for the new feature",
      "completed": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### POST /api/tasks
Create a new task for the authenticated user.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request**:
```json
{
  "title": "New task title",
  "description": "Detailed description of the task",
  "completed": false
}
```

**Response (Success)**:
```json
{
  "task": {
    "id": "task_67890",
    "userId": "user_12345",
    "title": "New task title",
    "description": "Detailed description of the task",
    "completed": false,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### PUT /api/tasks/{id}
Update an existing task for the authenticated user.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request**:
```json
{
  "title": "Updated task title",
  "description": "Updated description of the task",
  "completed": true
}
```

**Response (Success)**:
```json
{
  "task": {
    "id": "task_67890",
    "userId": "user_12345",
    "title": "Updated task title",
    "description": "Updated description of the task",
    "completed": true,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T12:00:00Z"
  }
}
```

### DELETE /api/tasks/{id}
Delete a task for the authenticated user.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response (Success)**:
```json
{
  "success": true
}
```

### PATCH /api/tasks/{id}/complete
Toggle the completion status of a task for the authenticated user.

**Headers**:
```
Authorization: Bearer {jwt_token}
```

**Request**:
```json
{
  "completed": true
}
```

**Response (Success)**:
```json
{
  "task": {
    "id": "task_67890",
    "userId": "user_12345",
    "title": "Updated task title",
    "description": "Updated description of the task",
    "completed": true,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T12:30:00Z"
  }
}
```

## Error Responses

For all endpoints, when authentication fails (401):

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

For all endpoints, when access is forbidden (403):

```json
{
  "error": "Forbidden",
  "message": "Access denied: You do not have permission to perform this action"
}
```

For server errors (5xx):

```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```