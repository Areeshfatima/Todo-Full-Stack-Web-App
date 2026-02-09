from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from sqlmodel import Session
from typing import Generator
import os
from dotenv import load_dotenv
from database import get_session, engine

# Load environment variables
load_dotenv()

# Initialize security scheme for JWT
security = HTTPBearer()

# Get secret key from environment
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET", "your-super-secret-jwt-token-here-change-me")
ALGORITHM = "HS256"

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    Extract and verify user_id from JWT token
    Returns the user_id from the token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode the JWT token
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])

        # Extract user_id from token
        user_id: str = payload.get("userId")

        if user_id is None:
            raise credentials_exception

        return user_id

    except JWTError:
        raise credentials_exception

def get_db() -> Generator[Session, None, None]:
    """
    Get database session dependency
    """
    with Session(engine) as session:
        yield session