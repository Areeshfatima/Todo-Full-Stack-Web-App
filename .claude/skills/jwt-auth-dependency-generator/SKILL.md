---
name: jwt-auth-dependency-generator
description: Generates JWT authentication dependencies for FastAPI that work with Better Auth
version: 1.0.0
category: authentication
author: Claude Code
---

## When to Use This Skill

Use this skill when you need to:

- Set up JWT authentication in a FastAPI application that integrates with Better Auth
- Create a reusable dependency function that validates JWT tokens and extracts user information
- Implement secure token verification using HS256 algorithm
- Ensure consistent authentication patterns across your FastAPI endpoints
- Generate proper error handling for invalid or missing tokens (HTTP 401 responses)
- Load JWT secret from environment variables for security

## Process Steps

1. **Environment Setup**: Verify that BETTER_AUTH_SECRET is available from environment variables
2. **Import Dependencies**: Import required modules (jwt, fastapi, python-jose, etc.)
3. **Create Token Verification Function**: Implement a function to decode and verify the JWT token using HS256
4. **Extract User Information**: Extract the `sub` claim as user_id from the validated token
5. **Handle Authentication Errors**: Raise HTTPException with status code 401 for invalid tokens
6. **Create Dependency Function**: Wrap the verification logic in a FastAPI Depends-compatible function
7. **Return User Context**: Return the extracted user_id or user context for use in route handlers
8. **Validate Output**: Ensure the generated dependency handles edge cases properly

## Output Format

The skill generates:

1. **Python Module** containing:
   - Import statements for required libraries
   - JWT verification utility function
   - FastAPI dependency function that:
     - Extracts Authorization header
     - Decodes and verifies JWT token
     - Returns user_id or raises HTTPException(401)
   - Proper type hints and documentation

2. **Configuration Requirements**:
   - Environment variable setup for BETTER_AUTH_SECRET
   - Dependencies to install (python-jose, fastapi, etc.)

3. **Usage Instructions**:
   - Example of how to use the dependency in route handlers
   - Integration guidelines with existing FastAPI application

## Example

**Input**:
- Application name: "MyTodoApp"
- Secret environment variable: "BETTER_AUTH_SECRET"
- Token location: Authorization header with "Bearer " prefix

**Generated Output**:

```python
import os
from typing import Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt.exceptions import InvalidTokenError
from pydantic import BaseModel

# Define the bearer scheme for documentation
security = HTTPBearer()

# Configuration
JWT_SECRET = os.getenv("BETTER_AUTH_SECRET")
if not JWT_SECRET:
    raise ValueError("BETTER_AUTH_SECRET environment variable must be set")

ALGORITHM = "HS256"

class UserPayload(BaseModel):
    """Structure of the JWT payload"""
    sub: str  # user_id
    exp: int  # expiration timestamp
    iat: int  # issued at timestamp

def verify_jwt_token(token: str) -> UserPayload:
    """
    Verifies the JWT token and returns the decoded payload.

    Args:
        token: JWT token string

    Returns:
        UserPayload: Decoded token payload containing user information

    Raises:
        InvalidTokenError: If the token is invalid, expired, or malformed
    """
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[ALGORITHM],
        )
        user_payload = UserPayload(**payload)

        # Additional validation could be added here
        return user_payload
    except InvalidTokenError:
        raise InvalidTokenError("Invalid token")
    except Exception as e:
        raise InvalidTokenError(f"Token verification failed: {str(e)}")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    FastAPI dependency to get the current user from JWT token.

    Args:
        credentials: HTTP authorization credentials from the request

    Returns:
        str: User ID extracted from the token's 'sub' claim

    Raises:
        HTTPException: 401 Unauthorized if token is invalid or missing
    """
    try:
        token = credentials.credentials
        payload = verify_jwt_token(token)
        user_id = payload.sub

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user_id
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication error",
            headers={"WWW-Authenticate": "Bearer"},
        )

# Usage in a route:
# @app.get("/protected-route")
# async def protected_endpoint(current_user_id: str = Depends(get_current_user)):
#     return {"user_id": current_user_id, "message": "Access granted"}
```