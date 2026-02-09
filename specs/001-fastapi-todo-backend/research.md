# Research Summary: FastAPI Secure Multi-User Todo API

## Overview
This document captures the research findings for implementing the FastAPI backend for the multi-user Todo application with Neon PostgreSQL and JWT authentication integration.

## Key Decisions Made

### 1. JWT Library Selection
**Decision**: python-jose[cryptography] vs pyjwt
**Rationale**: Chosen python-jose[cryptography] for Better Auth compatibility and robust verification capabilities. Better Auth uses specific JWT signing algorithms that work well with python-jose.
**Alternatives considered**:
- pyjwt: More lightweight but potentially less compatible with Better Auth's token format
- jwt library: Less feature-rich than python-jose

### 2. User ID Type
**Decision**: String (UUID from Better Auth) vs Integer
**Rationale**: Choose String to match Better Auth default user ID format, ensuring compatibility with frontend-generated JWT tokens that contain UUID-style user identifiers.
**Alternatives considered**:
- Integer: Traditional approach but would require mapping layer between Better Auth UUIDs and integer IDs

### 3. Session Management Approach
**Decision**: Sync SQLModel with SessionLocal vs async
**Rationale**: Choose sync for simplicity in Phase 2 development, trading off async performance benefits for easier implementation and debugging. This follows the user's instruction to use sync for simplicity in Phase 2.
**Alternatives considered**:
- Async: Better performance under high load but more complex to implement initially

### 4. Error Response Handling
**Decision**: Direct HTTPException vs Custom Exception Handlers
**Rationale**: Choose direct HTTPException for clarity and simplicity, making error handling more explicit and easier to understand during initial implementation.
**Alternatives considered**:
- Custom exception handlers: More centralized but could obscure error flows during development

### 5. CORS Origin Configuration
**Decision**: Hardcode ["http://localhost:3000"] vs Environment Variable
**Rationale**: Choose hardcoded for development reliability, ensuring consistent behavior during testing. Production deployments would use environment variables.
**Alternatives considered**:
- Environment variable: More flexible but could lead to configuration errors during development

## Architecture Components

### Modular Structure
- **main.py**: FastAPI app initialization, CORS configuration, router inclusion
- **database.py**: SQLModel engine and session management with Neon PostgreSQL connection
- **models.py**: Task model with proper relationships and constraints
- **dependencies.py**: JWT authentication dependency and database session dependency
- **routes/tasks.py**: All task-related endpoints with proper ownership checks

### JWT Authentication Flow
1. Extract JWT token from Authorization: Bearer header
2. Verify token signature using BETTER_AUTH_SECRET
3. Decode token to extract user_id
4. Return 401 for invalid/missing tokens
5. Inject authenticated user_id into route handlers

### Database Model Design
- **Task Model**: id (Integer, primary), user_id (String, FK to Better Auth), title (str, not null), description (str, optional), completed (bool, default False), created_at (datetime), updated_at (datetime)
- Proper indexes on user_id and completed fields for performance
- Auto timestamps using server_default

## Integration Points
- CORS configured for frontend origin (localhost:3000)
- Base API path as /api with all endpoints protected
- Immediate compatibility with frontend API client expecting standard REST patterns
- Environment variables loading for BETTER_AUTH_SECRET and DATABASE_URL

## Testing Strategy
- Auth validation: Verify invalid/missing tokens return 401
- CRUD operations: Test create/list/get/update/delete/toggle endpoints
- Ownership enforcement: Verify users can only access their own tasks
- Persistence: Confirm data survives server restarts via Neon DB
- Full stack integration: Validate frontend-backend communication