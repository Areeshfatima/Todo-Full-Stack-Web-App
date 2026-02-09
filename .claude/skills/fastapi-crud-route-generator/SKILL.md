---
name: fastapi-crud-route-generator
description: Generates secure FastAPI CRUD routes with JWT authentication and user ownership
version: 1.0.0
---

# FastAPI CRUD Route Generator

## Description
This skill generates secure FastAPI CRUD routes with JWT authentication and user ownership enforcement. The generated routes implement JWT dependency for current_user_id extraction, filter queries by user_id, use proper Pydantic schemas, include comprehensive error handling, and follow a consistent structure for list/create/get/update/delete operations.

## When to Use This Skill
- Creating CRUD endpoints for user-owned resources
- Implementing secure API routes with JWT authentication
- Enforcing user ownership on data access
- Building standardized API endpoints with consistent structure
- Ensuring proper validation with Pydantic schemas
- Adding comprehensive error handling to API routes

## Process Steps

1. **Define the SQLModel model** with user_id foreign key for ownership tracking:
   - Include user_id as a required field with foreign key relationship
   - Add timestamps (created_at, updated_at) for audit trail
   - Define appropriate indexes for performance optimization
2. **Create Pydantic schemas** for request/response validation:
   - Base schema with shared fields excluding ID and ownership fields
   - Create schema for POST requests (inherits from base)
   - Update schema for PATCH requests (optional fields)
   - Response schema for GET responses (includes ID and timestamps)
3. **Implement JWT dependency function** to extract current_user_id from token:
   - Create dependency that validates JWT token
   - Extract user_id from token payload
   - Handle invalid/expired token scenarios
4. **Create database session dependency** for database operations:
   - Define dependency to provide database session
   - Ensure proper cleanup after requests
   - Handle database connection errors
5. **Build GET /resource endpoint** to list user's resources with pagination:
   - Apply user_id filter to ensure only user's resources are returned
   - Implement pagination parameters (skip, limit)
   - Add ordering for consistent results
6. **Build POST /resource endpoint** to create user-owned resources:
   - Set user_id from JWT token (not from request body)
   - Validate request data with Pydantic schema
   - Return created resource with 201 status
7. **Build GET /resource/{id} endpoint** to retrieve specific user-owned resource:
   - Verify resource exists AND belongs to current user
   - Return 404 if resource doesn't exist or isn't owned by user
8. **Build PUT /resource/{id} endpoint** to update specific user-owned resource:
   - Verify resource exists AND belongs to current user before updating
   - Apply user_id filter in WHERE clause to prevent unauthorized access
   - Update only allowed fields from request
9. **Build DELETE /resource/{id} endpoint** to delete specific user-owned resource:
   - Verify resource exists AND belongs to current user before deletion
   - Apply user_id filter in WHERE clause to prevent unauthorized deletion
   - Return 204 status after successful deletion
10. **Add comprehensive error handling**:
    - Return appropriate HTTP status codes (401, 403, 404, etc.)
    - Provide meaningful error messages
    - Log security-relevant events
11. **Implement proper validation**:
    - Use Pydantic for request/response validation
    - Validate user permissions before data access
    - Sanitize and validate all input data
12. **Document the API endpoints** with proper OpenAPI specifications:
    - Add descriptive docstrings for each endpoint
    - Include examples in schema definitions
    - Define security schemes for JWT authentication

## Output Format
The skill generates:
- A complete FastAPI route module with all CRUD operations
- SQLAlchemy model with user_id foreign key
- Pydantic schemas for request/response validation
- JWT dependency for authentication
- Database session dependency
- Comprehensive error handling
- OpenAPI documentation

## Example

### Input
```
Generate secure CRUD routes for todo items with JWT authentication and user ownership
```

### Output

```python
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, Field
from datetime import datetime
import logging

from backend.database import get_db_session
from backend.models.todo import Todo, TodoCreate, TodoUpdate, TodoResponse
from backend.dependencies.auth import get_current_user_id

router = APIRouter(prefix="/todos", tags=["todos"])

# Configure logger for security events
logger = logging.getLogger(__name__)

@router.get("/", response_model=List[TodoResponse])
def list_todos(
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db_session),
    skip: int = 0,
    limit: int = 100
) -> List[TodoResponse]:
    """
    Retrieve a list of todos owned by the current user.

    Args:
        current_user_id: The ID of the authenticated user (extracted from JWT)
        skip: Number of records to skip for pagination
        limit: Maximum number of records to return

    Returns:
        List of todos owned by the current user
    """
    statement = (
        select(Todo)
        .where(Todo.user_id == current_user_id)
        .offset(skip)
        .limit(limit)
        .order_by(Todo.created_at.desc())
    )
    todos = db.exec(statement).all()

    logger.info(f"User {current_user_id} retrieved {len(todos)} todos")
    return todos


@router.post("/", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo: TodoCreate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db_session)
) -> TodoResponse:
    """
    Create a new todo owned by the current user.

    Args:
        todo: Todo creation data
        current_user_id: The ID of the authenticated user (extracted from JWT)

    Returns:
        The created todo with assigned ID and timestamps
    """
    # Create new todo with current user's ID (enforced ownership)
    db_todo = Todo.model_validate(todo)
    db_todo.user_id = current_user_id
    db_todo.created_at = datetime.utcnow()
    db_todo.updated_at = datetime.utcnow()

    try:
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)

        logger.info(f"User {current_user_id} created todo {db_todo.id}")
        return db_todo
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating todo for user {current_user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the todo"
        )


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db_session)
) -> TodoResponse:
    """
    Retrieve a specific todo owned by the current user.

    Args:
        todo_id: The ID of the todo to retrieve
        current_user_id: The ID of the authenticated user (extracted from JWT)

    Returns:
        The requested todo if it exists and belongs to the user
    """
    statement = select(Todo).where(
        Todo.id == todo_id,
        Todo.user_id == current_user_id  # User ownership verification
    )
    db_todo = db.exec(statement).first()

    if not db_todo:
        logger.warning(f"User {current_user_id} attempted to access non-existent or unauthorized todo {todo_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found or you don't have permission to access it"
        )

    logger.info(f"User {current_user_id} accessed todo {db_todo.id}")
    return db_todo


@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db_session)
) -> TodoResponse:
    """
    Update a specific todo owned by the current user.

    Args:
        todo_id: The ID of the todo to update
        todo_update: Updated todo data
        current_user_id: The ID of the authenticated user (extracted from JWT)

    Returns:
        The updated todo
    """
    statement = select(Todo).where(
        Todo.id == todo_id,
        Todo.user_id == current_user_id  # Verify ownership before update
    )
    db_todo = db.exec(statement).first()

    if not db_todo:
        logger.warning(f"User {current_user_id} attempted to update non-existent or unauthorized todo {todo_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found or you don't have permission to access it"
        )

    # Update fields from the request, preserving ownership
    update_data = todo_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_todo, field, value)
    db_todo.updated_at = datetime.utcnow()

    try:
        db.add(db_todo)
        db.commit()
        db.refresh(db_todo)

        logger.info(f"User {current_user_id} updated todo {db_todo.id}")
        return db_todo
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating todo {todo_id} for user {current_user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the todo"
        )


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    current_user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db_session)
) -> None:
    """
    Delete a specific todo owned by the current user.

    Args:
        todo_id: The ID of the todo to delete
        current_user_id: The ID of the authenticated user (extracted from JWT)
    """
    statement = select(Todo).where(
        Todo.id == todo_id,
        Todo.user_id == current_user_id  # Verify ownership before deletion
    )
    db_todo = db.exec(statement).first()

    if not db_todo:
        logger.warning(f"User {current_user_id} attempted to delete non-existent or unauthorized todo {todo_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Todo not found or you don't have permission to access it"
        )

    try:
        db.delete(db_todo)
        db.commit()

        logger.info(f"User {current_user_id} deleted todo {db_todo.id}")
    except Exception as e:
        db.rollback()
        logger.error(f"Error deleting todo {todo_id} for user {current_user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the todo"
        )


# Models and Schemas would be defined separately
"""
SQLModel models and Pydantic schemas:

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class TodoBase(SQLModel):
    title: str
    description: Optional[str] = None
    is_completed: bool = False

class Todo(TodoBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)  # Foreign key to users table
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class TodoCreate(TodoBase):
    pass

class TodoUpdate(SQLModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None

class TodoResponse(TodoBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
"""
```

### Additional Files Created
- Model definitions if not already existing (e.g., `models/todo.py`)
- Pydantic schema definitions if needed (e.g., `schemas/todo.py`)
- Authentication dependencies if not already existing (e.g., `dependencies/auth.py`)
- Database session dependencies if needed (e.g., `database.py`)
- Logging configuration if needed (e.g., `logging_config.py`)