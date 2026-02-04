from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
import os
from dotenv import load_dotenv
import secrets

load_dotenv()

class TaskBase(SQLModel):
    title: str = Field(min_length=1)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

class Task(TaskBase, table=True):
    """
    Task model representing a user's todo item
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)  # Will store user ID as string
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

class TaskCreate(TaskBase):
    """
    Model for creating new tasks
    """
    pass  # Inherits all fields from TaskBase

class TaskUpdate(SQLModel):
    """
    Model for updating tasks
    """
    title: Optional[str] = Field(default=None, min_length=1)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: Optional[bool] = Field(default=None)

class TaskResponse(SQLModel):
    """
    Model for task responses (without user_id to prevent disclosure)
    """
    id: int
    title: str
    description: Optional[str]
    completed: bool
    created_at: datetime
    updated_at: datetime

class UserBase(SQLModel):
    email: str = Field(unique=True, index=True)
    name: Optional[str] = Field(default=None)

class User(UserBase, table=True):
    """
    User model representing an authenticated user
    """
    id: Optional[str] = Field(default_factory=lambda: f"user_{secrets.token_hex(8)}", primary_key=True)
    password: str  # Hashed password
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

class UserCreate(UserBase):
    """
    Model for creating new users
    """
    password: str

class UserUpdate(SQLModel):
    """
    Model for updating users
    """
    name: Optional[str] = Field(default=None)

class UserResponse(SQLModel):
    """
    Model for user responses
    """
    id: str
    email: str
    name: Optional[str]
    created_at: datetime