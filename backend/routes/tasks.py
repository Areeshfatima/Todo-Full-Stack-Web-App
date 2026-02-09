from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from models import Task, TaskCreate, TaskUpdate, TaskResponse, User
from dependencies import get_current_user, get_db
from database import engine
from datetime import datetime

router = APIRouter(prefix="/api", tags=["tasks"])

@router.post("/tasks", response_model=TaskResponse)
def create_task(task_data: TaskCreate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    """
    Create a new task owned by the authenticated user
    """
    # Create a new task with the authenticated user's ID
    task = Task(
        title=task_data.title,
        description=task_data.description,
        completed=task_data.completed,
        user_id=user_id
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.get("/tasks", response_model=List[TaskResponse])
def list_tasks(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    """
    List all tasks for the authenticated user only
    """
    # Query for tasks owned by the authenticated user
    statement = select(Task).where(Task.user_id == user_id)
    tasks = db.exec(statement).all()

    return tasks


@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    """
    Get a specific task owned by the authenticated user
    """
    # Query for the specific task owned by the user
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = db.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to the user"
        )

    return task


@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_data: TaskUpdate, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    """
    Update a specific task owned by the authenticated user
    """
    # Query for the specific task owned by the user
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = db.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to the user"
        )

    # Update task fields if provided
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    # Update timestamp
    task.updated_at = datetime.utcnow()

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    """
    Delete a specific task owned by the authenticated user
    """
    # Query for the specific task owned by the user
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = db.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to the user"
        )

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}


@router.patch("/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_task_completion(task_id: int, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    """
    Toggle the completion status of a specific task owned by the authenticated user
    """
    # Query for the specific task owned by the user
    statement = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = db.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to the user"
        )

    # Toggle the completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()

    db.add(task)
    db.commit()
    db.refresh(task)

    return task