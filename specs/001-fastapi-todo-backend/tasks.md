# Implementation Tasks: FastAPI Secure Multi-User Todo API

## Dependencies

- **User Story Priority Order**: US1 → US2 → US3 → US4 (Based on spec priorities: P1, P1, P2, P2)
- **Cross-Story Dependencies**:
  - US2 (Authentication) must complete before US1, US3, US4 (all require authentication)
  - US3 (Database) must complete before US1 (task operations require storage)
  - US4 (Frontend Integration) requires all other stories complete

## Parallel Execution Examples

- **Within US1**: [P] Task model creation, [P] Task endpoints implementation, [P] Request/response schemas
- **Within US2**: [P] JWT dependency implementation, [P] Token verification logic, [P] User extraction
- **Within US3**: [P] Database connection setup, [P] Session management, [P] Index creation
- **Within US4**: [P] CORS configuration, [P] API documentation, [P] Frontend compatibility checks

## Implementation Strategy

- **MVP Scope**: Complete US2 (Authentication) + minimal US1 (basic task creation/listing) to establish core functionality
- **Incremental Delivery**: Each user story builds upon previous foundations but remains independently testable
- **Security First**: Authentication and user isolation implemented before any data operations

---

## Phase 1: Setup Tasks

### Goal
Initialize the project structure and install required dependencies

- [x] T001 Create backend directory structure
- [x] T002 Create requirements.txt with FastAPI, SQLModel, python-jose[cryptography], uvicorn, python-dotenv, psycopg2-binary
- [x] T003 Create initial main.py file with basic FastAPI app
- [x] T004 Create .env file with placeholder values for BETTER_AUTH_SECRET and DATABASE_URL

---

## Phase 2: Foundational Tasks

### Goal
Establish core infrastructure that all user stories depend on

- [x] T005 [P] Create models.py file with Task model definition
- [x] T006 [P] Create database.py file with SQLModel engine and session setup
- [x] T007 [P] Create dependencies.py file with get_db dependency
- [x] T008 [P] Configure environment variable loading with python-dotenv
- [x] T009 [P] Set up CORS middleware for localhost:3000

---

## Phase 3: User Story 1 - Secure Task Management (Priority: P1)

### Goal
Enable authenticated users to create, view, update, delete, and mark tasks as complete with proper user isolation

### Independent Test Criteria
Can be fully tested by signing up for an account, logging in, creating tasks, viewing only my tasks, updating them, marking them complete/incomplete, and deleting them - all while ensuring I cannot access other users' tasks.

- [x] T010 [P] [US1] Create TaskCreate request model in models.py
- [x] T011 [P] [US1] Create TaskUpdate request model in models.py
- [x] T012 [P] [US1] Create TaskResponse model in models.py
- [x] T013 [P] [US1] Create routes/tasks.py file with basic router
- [x] T014 [US1] Implement POST /api/tasks endpoint to create tasks owned by authenticated user
- [x] T015 [US1] Implement GET /api/tasks endpoint to list tasks for authenticated user only
- [x] T016 [US1] Implement GET /api/tasks/{task_id} endpoint to retrieve specific user-owned tasks
- [x] T017 [US1] Implement PUT /api/tasks/{task_id} endpoint to update user-owned tasks
- [x] T018 [US1] Implement DELETE /api/tasks/{task_id} endpoint to delete user-owned tasks (returns 204)
- [x] T019 [US1] Implement PATCH /api/tasks/{task_id}/complete endpoint to toggle task completion status
- [x] T020 [US1] Add user_id filtering to all task operations to enforce strict user isolation
- [x] T021 [US1] Add proper error handling with HTTPException for invalid operations (403, 404)

---

## Phase 4: User Story 2 - Secure Authentication and Authorization (Priority: P1)

### Goal
Verify user identity using JWT tokens from the frontend authentication system to keep tasks private and secure

### Independent Test Criteria
Can be tested by attempting to access API endpoints without a token (should return 401), with an invalid token (should return 401), and with a valid token (should allow access to user's own data).

- [x] T022 [P] [US2] Import required JWT libraries (python-jose[cryptography]) in dependencies.py
- [x] T023 [P] [US2] Create JWT verification utility function in dependencies.py
- [x] T024 [US2] Implement JWT authentication dependency in dependencies.py that extracts user_id from token
- [x] T025 [US2] Add JWT dependency to all task endpoints to require Authorization: Bearer header
- [x] T026 [US2] Configure JWT algorithm to HS256 using BETTER_AUTH_SECRET
- [x] T027 [US2] Add proper error handling for invalid/missing/expired JWT tokens (401 Unauthorized)
- [x] T028 [US2] Test JWT token verification with mock tokens

---

## Phase 5: User Story 3 - Persistent Task Storage (Priority: P2)

### Goal
Store tasks persistently in database so they remain available when users return to the application

### Independent Test Criteria
Can be tested by creating tasks, logging out, logging back in, and verifying that the same tasks are still available.

- [x] T029 [P] [US3] Configure database connection using DATABASE_URL from environment
- [x] T030 [P] [US3] Add proper indexes on user_id and completed fields for performance
- [x] T031 [US3] Implement database session management in all task endpoints
- [x] T032 [US3] Test database persistence by restarting server and verifying tasks remain
- [x] T033 [US3] Add auto timestamps (created_at, updated_at) to Task model
- [x] T034 [US3] Connect to Neon Serverless PostgreSQL database with SSL

---

## Phase 6: User Story 4 - Frontend Integration (Priority: P2)

### Goal
Ensure backend API is compatible with Next.js frontend for seamless user interaction with tasks through UI

### Independent Test Criteria
Can be tested by connecting the frontend to the backend API and performing all task operations through the UI without errors.

- [x] T035 [P] [US4] Configure CORS to allow requests from http://localhost:3000
- [x] T036 [P] [US4] Add base API path as /api to all endpoints
- [x] T037 [US4] Ensure JSON response formats match frontend expectations
- [x] T038 [US4] Test compatibility with Better Auth JWT tokens
- [x] T039 [US4] Add API documentation with FastAPI automatic docs
- [x] T040 [US4] Validate successful communication between frontend and backend

---

## Phase 7: Polish & Cross-Cutting Concerns

### Goal
Finalize implementation with proper error handling, validation, and production readiness

- [x] T041 Add request body validation with Pydantic models for all endpoints
- [x] T042 Implement proper HTTP status codes (400, 401, 403, 404, 500) for error conditions
- [x] T043 Add input sanitization and validation for all user inputs
- [x] T044 Create README.md with setup and usage instructions
- [x] T045 Test complete user flow: login → create/view/update/delete/toggle tasks
- [x] T046 Verify zero cross-user data leakage in all operations
- [x] T047 Optimize database queries with proper indexing
- [x] T048 Add logging for debugging and monitoring
- [x] T049 Perform final integration test with frontend
- [x] T050 Update main.py to include all routes and dependencies