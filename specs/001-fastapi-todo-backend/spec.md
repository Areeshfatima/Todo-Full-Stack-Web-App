# Feature Specification: FastAPI Secure Multi-User Todo API

**Feature Branch**: `001-fastapi-todo-backend`
**Created**: 2026-02-01
**Status**: Draft
**Input**: User description: "Phase 2 Backend: Complete FastAPI Secure Multi-User Todo API with Neon PostgreSQL and Frontend Integration

Objective: Implement the full production-ready backend for the multi-user Todo application using FastAPI and SQLModel, providing persistent storage in Neon Serverless PostgreSQL, complete Basic Level CRUD + completion functionality, and seamless integration with the Next.js frontend via shared JWT authentication from Better Auth.

Focus: Deliver a secure, clean, and fully functional API that enforces user isolation at every level, uses environment variables for configuration, connects reliably to Neon DB, verifies JWT tokens issued by the frontend, and works end-to-end with the completed frontend without errors — enabling immediate testing of full stack flows (signup/login → create/view/update/delete/toggle tasks).

Success criteria:
- Environment Configuration: Loads BETTER_AUTH_SECRET and DATABASE_URL (or Neon_db_url) from .env; uses them for JWT verification and DB connection.
- JWT Authentication Middleware: Custom dependency that:
  - Requires Authorization: Bearer <token> header on all /api routes.
  - Verifies token signature with BETTER_AUTH_SECRET.
  - Decodes token to extract user_id.
  - Returns 401 Unauthorized if missing/invalid/expired.
  - Injects authenticated user_id into route handlers.
- Strict User Isolation: Every database query and operation filters by authenticated user_id; 403 Forbidden if task ownership mismatch; no cross-user data leakage.
- Database Schema & Models:
  - SQLModel Task model: id (Integer, primary_key), user_id (String, foreign_key to Better Auth users), title (str, not null), description (str, optional), completed (bool, default False), created_at (datetime), updated_at (datetime).
  - Proper indexes on user_id and completed.
  - Engine connected via Neon DATABASE_URL with SSL.
- Full API Endpoints (base /api, all protected):
  - GET /api/tasks → List tasks for authenticated user (return list of Task objects).
  - POST /api/tasks → Create task (body: title required, description optional) owned by user.
  - GET /api/tasks/{task_id} → Get single task (404 if not found or not owned).
  - PUT /api/tasks/{task_id} → Full update task (title/description).
  - DELETE /api/tasks/{task_id} → Delete task (204 on success).
  - PATCH /api/tasks/{task_id}/complete → Toggle completed status (return updated task).
- Request/Response Models: Pydantic/SQLModel schemas for clean validation and serialization.
- Error Handling: HTTPException with appropriate status codes (400 validation, 401 auth, 403 forbidden, 404 not found, 500 generic).
- Integration with Frontend:
  - Accepts JWT tokens issued by Better Auth on frontend (same BETTER_AUTH_SECRET).
  - Frontend API client points to http://localhost:8000/api (or configurable).
  - Full stack test flow works: Frontend login → JWT → backend protected routes → tasks persisted and isolated per user.
- Server: Runs with uvicorn main:app --reload --port 8000; CORS configured for localhost:3000.
- Overall Backend: Clean project structure (main.py, models.py, database.py, dependencies.py, routes/tasks.py); ready for docker-compose integration.

Constraints:
- Dependencies: FastAPI, SQLModel, uvicorn, python-jose[cryptography], passlib[bcrypt], python-dotenv, psycopg2-binary or asyncpg.
- Patterns: Modular routes, dependency injection for auth/db session; follow /backend/CLAUDE.md strictly.
- Security: Never trust frontend user_id; always extract from verified JWT; use same BETTER_AUTH_SECRET as frontend.
- Code Generation: All code produced solely by Claude Code (via Backend/Auth/Database Subagents) through iterative spec refinement.
- No Extra Features: Only Basic Level CRUD + complete; no priorities, tags, search, etc.

Implementation Instructions for Backend Subagent:
- Generate complete backend structure: main.py (app setup, CORS, include routers), database.py (engine/session), models.py (Task), dependencies.py (get_current_user JWT dependency, get_db), routes/tasks.py (all endpoints with ownership checks).
- Use provided .env values: BETTER_AUTH_SECRET and Neon_db_url as DATABASE_URL.
- Include .env loading with python-dotenv.
- Ensure immediate compatibility with frontend (CORS origins ["http://localhost:3000"], JWT algorithm HS256).
- Output full file contents ready to copy.
- After generation: Instruct user to cd backend && pip install -r requirements.txt && uvicorn main:app --reload --port 8000
- Verify: With frontend running, full flows work without auth/database errors."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Task Management (Priority: P1)

As an authenticated user, I want to securely create, view, update, delete, and mark tasks as complete so that I can manage my personal tasks without seeing others' tasks.

**Why this priority**: This is the core functionality of the todo application - users must be able to perform all basic CRUD operations on their tasks with proper security.

**Independent Test**: Can be fully tested by signing up for an account, logging in, creating tasks, viewing only my tasks, updating them, marking them complete/incomplete, and deleting them - all while ensuring I cannot access other users' tasks.

**Acceptance Scenarios**:

1. **Given** user is authenticated with valid JWT token, **When** user creates a new task via POST /api/tasks, **Then** task is saved with user's ID and only accessible by that user
2. **Given** user has multiple tasks created, **When** user requests GET /api/tasks, **Then** only tasks belonging to that user are returned
3. **Given** user owns a specific task, **When** user updates the task via PUT /api/tasks/{id}, **Then** task is updated only if it belongs to the user
4. **Given** user owns a specific task, **When** user deletes the task via DELETE /api/tasks/{id}, **Then** task is deleted only if it belongs to the user and returns 204
5. **Given** user owns a specific task, **When** user toggles completion via PATCH /api/tasks/{id}/complete, **Then** task completion status is updated only if it belongs to the user

---

### User Story 2 - Secure Authentication and Authorization (Priority: P1)

As a user, I want the system to verify my identity using JWT tokens from the frontend authentication system so that my tasks remain private and secure.

**Why this priority**: Without proper authentication and authorization, the entire security model fails and users' data would be exposed.

**Independent Test**: Can be tested by attempting to access API endpoints without a token (should return 401), with an invalid token (should return 401), and with a valid token (should allow access to user's own data).

**Acceptance Scenarios**:

1. **Given** user makes request without Authorization header, **When** requesting any /api endpoint, **Then** 401 Unauthorized is returned
2. **Given** user makes request with invalid JWT token, **When** requesting any /api endpoint, **Then** 401 Unauthorized is returned
3. **Given** user has valid JWT token, **When** requesting any /api endpoint, **Then** request proceeds with authenticated user context

---

### User Story 3 - Persistent Task Storage (Priority: P2)

As a user, I want my tasks to be stored persistently in a database so that they remain available when I return to the application.

**Why this priority**: Without persistent storage, the application has no value as tasks would disappear after sessions end.

**Independent Test**: Can be tested by creating tasks, logging out, logging back in, and verifying that the same tasks are still available.

**Acceptance Scenarios**:

1. **Given** user creates a task, **When** user navigates away and returns, **Then** task remains in database and is accessible
2. **Given** user updates a task, **When** checking the database, **Then** the updated information is persisted
3. **Given** user deletes a task, **When** checking the database, **Then** the task is permanently removed

---

### User Story 4 - Frontend Integration (Priority: P2)

As a frontend developer, I want the backend API to be compatible with the Next.js frontend so that users can seamlessly interact with their tasks through the UI.

**Why this priority**: The backend must work seamlessly with the existing frontend for the complete user experience.

**Independent Test**: Can be tested by connecting the frontend to the backend API and performing all task operations through the UI without errors.

**Acceptance Scenarios**:

1. **Given** frontend sends JWT token in Authorization header, **When** making API requests, **Then** backend accepts the token and processes requests appropriately
2. **Given** frontend makes CORS requests from localhost:3000, **When** accessing API, **Then** requests are allowed without CORS errors
3. **Given** frontend expects specific JSON response formats, **When** making API calls, **Then** responses match expected schema

---

### Edge Cases

- What happens when a user attempts to access a task that doesn't exist or doesn't belong to them? (Should return 404 or 403)
- How does the system handle expired JWT tokens? (Should return 401 and require re-authentication)
- What occurs when the database connection fails during an operation? (Should return appropriate error response)
- How does the system handle concurrent requests from the same user? (Should handle safely without data corruption)
- What happens when request payloads exceed expected size limits? (Should return validation error)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST load configuration from environment variables (BETTER_AUTH_SECRET, DATABASE_URL) for JWT verification and database connection
- **FR-002**: System MUST verify JWT tokens in Authorization: Bearer header using HS256 algorithm with BETTER_AUTH_SECRET
- **FR-003**: System MUST extract user_id from verified JWT tokens and use it for user isolation
- **FR-004**: System MUST filter all database queries by authenticated user_id to enforce strict user isolation
- **FR-005**: System MUST return 401 Unauthorized for missing/invalid/expired JWT tokens
- **FR-006**: System MUST return 403 Forbidden when users attempt to access resources they don't own
- **FR-007**: System MUST provide GET /api/tasks endpoint that returns only authenticated user's tasks
- **FR-008**: System MUST provide POST /api/tasks endpoint to create tasks owned by authenticated user
- **FR-009**: System MUST provide GET /api/tasks/{task_id} endpoint to retrieve specific user-owned tasks
- **FR-010**: System MUST provide PUT /api/tasks/{task_id} endpoint to update user-owned tasks
- **FR-011**: System MUST provide DELETE /api/tasks/{task_id} endpoint to delete user-owned tasks (returns 204)
- **FR-012**: System MUST provide PATCH /api/tasks/{task_id}/complete endpoint to toggle task completion status
- **FR-013**: System MUST validate request bodies and return 400 Bad Request for invalid data
- **FR-014**: System MUST return appropriate HTTP status codes (400, 401, 403, 404, 500) for error conditions
- **FR-015**: System MUST store Task entities with id, user_id, title (required), description (optional), completed status, created_at, and updated_at
- **FR-016**: System MUST configure CORS to allow requests from http://localhost:3000
- **FR-017**: System MUST connect to Neon Serverless PostgreSQL database with SSL
- **FR-018**: System MUST create proper database indexes on user_id and completed fields for performance

### Key Entities

- **Task**: Represents a user's todo item with attributes id (primary key), user_id (foreign key to Better Auth user), title (required string), description (optional string), completed (boolean with default false), created_at (timestamp), updated_at (timestamp)
- **User**: Represents an authenticated user identified by user_id extracted from JWT token, owns multiple Task entities

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can perform all CRUD operations on their tasks with 100% success rate when authenticated properly
- **SC-002**: Users can only access their own tasks - zero cross-user data leakage occurs in 100% of test cases
- **SC-003**: API responds to requests within 2 seconds under normal load conditions
- **SC-004**: JWT authentication validates successfully in 99%+ of legitimate requests
- **SC-005**: Frontend can connect to backend API and perform complete user flows (login → create/view/update/delete/toggle tasks) without authentication or database errors
- **SC-006**: Database operations complete successfully with 99%+ success rate under typical usage patterns
