from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlmodel import Session, select
from datetime import datetime, timedelta
import os
import hashlib
from typing import Optional
from pydantic import BaseModel
from dotenv import load_dotenv
from models import Task, TaskCreate, TaskUpdate, TaskResponse, User, UserCreate, UserResponse
from dependencies import get_current_user, get_db, SECRET_KEY
from database import engine

load_dotenv()

router = APIRouter(prefix="/api", tags=["auth"])

# Secret key for JWT
from dependencies import SECRET_KEY
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Pydantic models for request/response
class UserLogin(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    token: str
    user: UserResponse

def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None):
    """Create JWT access token"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {"sub": user_id, "userId": user_id, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Simple password verification (in a real app, use bcrypt or similar)"""
    # For simplicity, using a basic hash comparison
    # In a production app, use bcrypt or similar
    return hashlib.sha256(plain_password.encode()).hexdigest() == hashed_password

def get_password_hash(password: str) -> str:
    """Simple password hashing (in a real app, use bcrypt or similar)"""
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/auth/signup", response_model=AuthResponse)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    """
    # Check if user already exists in the database
    existing_user = db.exec(select(User).where(User.email == user_data.email)).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )

    # Hash the password
    hashed_password = get_password_hash(user_data.password)

    # Create and store user in the database
    db_user = User(
        email=user_data.email,
        password=hashed_password,
        name=user_data.name
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create access token
    access_token = create_access_token(db_user.id)

    return {
        "token": access_token,
        "user": UserResponse(
            id=db_user.id,
            email=db_user.email,
            name=db_user.name,
            created_at=db_user.created_at
        )
    }

@router.post("/auth/login", response_model=AuthResponse)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate a user and return a JWT token
    """
    # Find user by email in the database
    db_user = db.exec(select(User).where(User.email == user_data.email)).first()

    if not db_user or not verify_password(user_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    # Create access token
    access_token = create_access_token(db_user.id)

    return {
        "token": access_token,
        "user": UserResponse(
            id=db_user.id,
            email=db_user.email,
            name=db_user.name,
            created_at=db_user.created_at
        )
    }

@router.post("/auth/logout")
def logout(user_id: str = Depends(get_current_user)):
    """
    Logout endpoint (mostly for consistency with frontend expectations)
    """
    # In a real application, you might add the token to a blacklist
    return {"message": "Logged out successfully"}

@router.get("/auth/me", response_model=UserResponse)
def get_current_user_details(user_id: str = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Get details of the currently authenticated user
    """
    # Find user in the database by user_id
    db_user = db.exec(select(User).where(User.id == user_id)).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return UserResponse(
        id=db_user.id,
        email=db_user.email,
        name=db_user.name,
        created_at=db_user.created_at
    )