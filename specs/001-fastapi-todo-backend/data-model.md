# Data Model: FastAPI Secure Multi-User Todo API

## Entity Definitions

### Task Entity
- **id**: Integer, Primary Key, Auto-increment
- **user_id**: String (UUID format), Foreign Key to Better Auth Users
- **title**: String, Required, Not Null
- **description**: String, Optional, Nullable
- **completed**: Boolean, Default False
- **created_at**: DateTime, Auto-populated on creation
- **updated_at**: DateTime, Auto-populated on update

### Relationships
- **One-to-Many**: User (via user_id) to multiple Tasks
- Tasks are logically partitioned by user_id for isolation

## Validation Rules

### Field Validations
- **title**: Required, minimum length 1 character
- **description**: Optional, maximum length 1000 characters (reasonable limit)
- **completed**: Boolean, default false, can be toggled
- **user_id**: Required, must match authenticated user's ID from JWT token
- **timestamps**: Auto-managed by system, not user-modifiable

### Business Logic Constraints
- Users can only access/modify tasks where user_id matches their authenticated ID
- Task ownership cannot be changed after creation
- Completed status can be toggled by owner only

## State Transitions

### Task Lifecycle
1. **Created**: New task with completed=False by authenticated user
2. **Updated**: Task details modified by owner
3. **Completed**: Toggle completed=True by owner
4. **Uncompleted**: Toggle completed=False by owner
5. **Deleted**: Removed by owner (permanent deletion)

### Access Control
- **Read**: Only tasks where user_id matches authenticated user
- **Write**: Only tasks where user_id matches authenticated user
- **Delete**: Only tasks where user_id matches authenticated user

## Indexing Strategy

### Database Indexes
- **user_id**: Essential for filtering queries by authenticated user
- **completed**: Useful for filtering completed vs incomplete tasks
- **created_at**: For chronological sorting and potential time-based queries

## API Contract Implications

### Request/Response Models
- **TaskCreate**: title (required), description (optional)
- **TaskUpdate**: title (optional), description (optional) - partial updates allowed
- **TaskResponse**: All fields except user_id (not exposed to prevent disclosure)
- **TaskListResponse**: Array of TaskResponse objects

### Error Conditions
- **404 Not Found**: Task doesn't exist or doesn't belong to user
- **403 Forbidden**: Attempt to access task not owned by user
- **400 Bad Request**: Invalid input data