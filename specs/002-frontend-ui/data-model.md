# Data Model for Professional Todo Web Interface

## Core Entities

### User Session
**Description**: Represents an authenticated user's session state
- **Fields**:
  - `userId`: Unique identifier for the authenticated user
  - `token`: JWT token from Better Auth session
  - `email`: User's email address
  - `name`: User's display name (optional)
- **Validation**: Token must be valid and not expired
- **Relationships**: Associated with multiple Tasks

### Task
**Description**: Represents a user's individual todo item
- **Fields**:
  - `id`: Unique identifier for the task
  - `userId`: Foreign key linking to the owning user
  - `title`: Brief title/description of the task (required)
  - `description`: Detailed description of the task (optional)
  - `completed`: Boolean indicating completion status
  - `createdAt`: Timestamp when task was created
  - `updatedAt`: Timestamp when task was last updated
- **Validation**:
  - Title must not be empty
  - UserId must correspond to authenticated user
- **State Transitions**:
  - Active → Completed (when checkbox is toggled)
  - Completed → Active (when checkbox is toggled back)

### UI State
**Description**: Manages the frontend application state
- **Fields**:
  - `loading`: Boolean indicating if data is being loaded
  - `error`: Error message if an operation failed
  - `modalOpen`: Boolean indicating if a modal is open
  - `toastMessage`: Message for notification display
  - `optimisticTasks`: Temporary task updates before API confirmation
- **Validation**: None directly, manages application flow

## Relationships

### User Session → Task
- One-to-many relationship
- Tasks are strictly filtered by userId for complete user isolation
- Each task belongs to exactly one user

### Task → UI State
- Tasks influence UI state during operations
- UI State contains optimistic updates for tasks during API calls

## API Endpoints

### Task Management
- `GET /api/tasks`: Retrieve all tasks for authenticated user
- `POST /api/tasks`: Create a new task for authenticated user
- `PUT /api/tasks/{id}`: Update an existing task for authenticated user
- `DELETE /api/tasks/{id}`: Delete a task for authenticated user
- `PATCH /api/tasks/{id}/complete`: Toggle completion status for authenticated user

### Authentication
- `POST /api/auth/signup`: Register new user
- `POST /api/auth/login`: Authenticate user
- `POST /api/auth/logout`: Clear user session

## Validation Rules

### Authentication
- All task operations require valid JWT token
- All operations verify user ownership (userId matches authenticated user)
- Invalid tokens result in 401 Unauthorized

### Data Integrity
- Task titles must be non-empty strings
- Task descriptions have maximum length of 1000 characters
- Only the task owner can modify or delete tasks
- Timestamps are automatically managed by the server

## State Transitions

### Task Completion
- When user toggles completion: `completed` field changes state
- UI updates optimistically before API confirmation
- If API fails, UI reverts to previous state

### Task Creation
- User submits new task data
- UI shows optimistic creation before API confirmation
- If successful, task appears in task list
- If failed, error is shown to user

### Task Deletion
- User initiates deletion with confirmation
- UI shows optimistic deletion (fade-out animation)
- If successful, task is permanently removed
- If failed, task reappears in the list with error message