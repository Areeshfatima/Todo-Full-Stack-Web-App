---
id: 1
title: update-project-constitution-todo-app
stage: constitution
date: 2026-01-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: user
command: /sp.constitution
labels: [constitution, spec-driven-development, todo-app, full-stack]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

```
Project: Evolution of Todo - Phase 2: Full-Stack Multi-User Web Application

Core principles:
- Strict Spec-Driven Development: All code in both frontend and backend must be generated exclusively by Claude Code using Spec-Kit Plus. No manual code writing or editing is permitted at any point.
- Iterative Spec Refinement: Specifications must be refined through multiple documented iterations until Claude Code produces correct, complete, and idiomatic output for both Next.js and FastAPI stacks.
- Monorepo Organization: Use the exact Spec-Kit Plus monorepo structure with .spec-kit/config.yaml, organized /specs directory (overview.md, features/, api/, database/, ui/), and layered CLAUDE.md files (root, frontend/, backend/).
- Separation of Concerns: Clear boundaries between frontend (Next.js App Router, TypeScript, Tailwind), backend (FastAPI, SQLModel), database (Neon PostgreSQL), and authentication layers.
- Security First: Mandatory Better Auth with JWT tokens; every API request requires valid Authorization: Bearer token; all data operations strictly filtered by authenticated user_id for complete user isolation.
- Reusable Intelligence: Leverage defined subagents (Architecture, Frontend, Backend, Database, Auth, API, Integration) and skills for consistent, efficient implementation.

Key standards:
- Technology Stack: Next.js 16+ (App Router), TypeScript, Tailwind CSS (frontend); FastAPI, SQLModel, Neon Serverless PostgreSQL (backend); Better Auth with JWT plugin (authentication).
- API Design: RESTful endpoints exactly as specified (/api/tasks with CRUD and completion toggle, including user_id path where required); all protected by JWT; responses filtered to authenticated user only.
- Database Schema: SQLModel models with users table (managed by Better Auth), tasks table (id, user_id foreign key, title, description, completed, created_at, updated_at); proper indexes on user_id and completed.
- Authentication: Shared BETTER_AUTH_SECRET environment variable; frontend issues JWT on signup/login and attaches to all requests; backend middleware verifies token and extracts user_id.
- Project Structure: Monorepo with /frontend, /backend, root CLAUDE.md for navigation, domain-specific CLAUDE.md files, comprehensive /specs organization.
- Documentation: Full iteration history in specs/history/, detailed CLAUDE.md tracking subagent usage, prompts, and refinements.

Constraints:
- Features: Implement only the 5 Basic Level CRUD + completion features as a multi-user web application; no Intermediate (priorities, tags, search, sort) or Advanced (due dates, recurring) features in Phase 2.
- Persistence: All data stored in Neon PostgreSQL via SQLModel; no in-memory or file storage.
- Authentication: Required for all endpoints; no unauthenticated access; enforce user ownership on every operation.
- Dependencies: Only specified stack; no additional packages.
- Development Workflow: Use @specs/... referencing; subagents handle domain-specific work; Architecture/Integration subagents coordinate cross-stack tasks.

Success criteria:
- Fully functional multi-user web app: Users can independently signup/login, manage only their own tasks via responsive UI; complete data isolation verified.
- Secure API: All endpoints return 401/403 on invalid/missing token or ownership violation; JWT flow works end-to-end.
- Persistent storage: Tasks survive restarts, correctly associated with users via Neon DB.
- Clean monorepo: Organized specs, layered CLAUDE.md files guide Claude Code effectively; subagents demonstrate reusable intelligence.
- Zero manual code: Complete history shows all implementation via spec iteration and subagent coordination.
- Local integration: Runs via docker-compose or separate dev servers with consistent env vars; full flows validated by Integration Subagent.
- Demo-ready: Public GitHub repo with clear README, working Vercel/frontend and backend deployment possible.
```

## Response snapshot

<!-- SYNC IMPACT REPORT:
Version change: undefined → 1.0.0
Modified principles: [PRINCIPLE_1_NAME] → Spec-Driven Development, [PRINCIPLE_2_NAME] → Iterative Spec Refinement, [PRINCIPLE_3_NAME] → Monorepo Organization, [PRINCIPLE_4_NAME] → Separation of Concerns, [PRINCIPLE_5_NAME] → Security First, [PRINCIPLE_6_NAME] → Reusable Intelligence
Added sections: Technology Stack Standards, Development Workflow Standards, Feature Constraints, Success Criteria
Removed sections: None
Templates requiring updates: ✅ .specify/templates/plan-template.md, ✅ .specify/templates/spec-template.md, ✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->
# Todo Full-Stack Multi-User Web Application Constitution

## Core Principles

### Spec-Driven Development
All code in both frontend and backend must be generated exclusively by Claude Code using Spec-Kit Plus. No manual code writing or editing is permitted at any point.

### Iterative Spec Refinement
Specifications must be refined through multiple documented iterations until Claude Code produces correct, complete, and idiomatic output for both Next.js and FastAPI stacks.

### Monorepo Organization
Use the exact Spec-Kit Plus monorepo structure with .spec-kit/config.yaml, organized /specs directory (overview.md, features/, api/, database/, ui/), and layered CLAUDE.md files (root, frontend/, backend/).

### Separation of Concerns
Clear boundaries between frontend (Next.js App Router, TypeScript, Tailwind), backend (FastAPI, SQLModel), database (Neon PostgreSQL), and authentication layers.

### Security First
Mandatory Better Auth with JWT tokens; every API request requires valid Authorization: Bearer token; all data operations strictly filtered by authenticated user_id for complete user isolation.

### Reusable Intelligence
Leverage defined subagents (Architecture, Frontend, Backend, Database, Auth, API, Integration) and skills for consistent, efficient implementation.

## Technology Stack Standards

### Frontend Requirements
Next.js 16+ (App Router), TypeScript, Tailwind CSS must be used for all frontend development. All UI components must follow responsive design principles and be built with TypeScript for type safety.

### Backend Requirements
FastAPI, SQLModel, and Neon Serverless PostgreSQL must be used for all backend development. All API endpoints must follow RESTful design principles and implement proper error handling.

### Authentication Standards
Better Auth with JWT plugin must be implemented for all authentication flows. Shared BETTER_AUTH_SECRET environment variable must be used across frontend and backend. All API requests must include valid JWT tokens.

### Database Schema Requirements
SQLModel models with users table (managed by Better Auth), tasks table (id, user_id foreign key, title, description, completed, created_at, updated_at) with proper indexes on user_id and completed fields.

## Development Workflow Standards

### Specification Referencing
Use @specs/... referencing for all development tasks. Subagents handle domain-specific work while Architecture/Integration subagents coordinate cross-stack tasks.

### API Design Standards
RESTful endpoints exactly as specified (/api/tasks with CRUD and completion toggle, including user_id path where required); all protected by JWT; responses filtered to authenticated user only.

### Project Structure Requirements
Monorepo with /frontend, /backend, root CLAUDE.md for navigation, domain-specific CLAUDE.md files, comprehensive /specs organization with full iteration history in specs/history/.

## Feature Constraints

### Feature Scope Limitations
Implement only the 5 Basic Level CRUD + completion features as a multi-user web application; no Intermediate (priorities, tags, search, sort) or Advanced (due dates, recurring) features in Phase 2.

### Persistence Requirements
All data stored in Neon PostgreSQL via SQLModel; no in-memory or file storage allowed. All data must persist across application restarts.

### Authentication Enforcement
Required for all endpoints; no unauthenticated access; enforce user ownership on every operation. All API endpoints must return 401/403 on invalid/missing token or ownership violation.

### Dependency Restrictions
Only specified technology stack dependencies; no additional packages beyond those explicitly defined in the requirements.

## Success Criteria

### Functional Requirements
Fully functional multi-user web app: Users can independently signup/login, manage only their own tasks via responsive UI; complete data isolation verified.

### Security Requirements
Secure API: All endpoints return 401/403 on invalid/missing token or ownership violation; JWT flow works end-to-end with proper user isolation.

### Persistence Verification
Persistent storage: Tasks survive restarts, correctly associated with users via Neon DB with proper foreign key relationships and data integrity.

### Repository Standards
Clean monorepo: Organized specs, layered CLAUDE.md files guide Claude Code effectively; subagents demonstrate reusable intelligence; Zero manual code with complete history showing all implementation via spec iteration and subagent coordination.

### Integration Requirements
Local integration: Runs via docker-compose or separate dev servers with consistent env vars; full flows validated by Integration Subagent.

### Deployment Readiness
Demo-ready: Public GitHub repo with clear README, working Vercel/frontend and backend deployment possible.

## Governance

All development must strictly follow Spec-Driven Development principles with Claude Code as the primary implementation tool. All changes must be documented through Prompt History Records (PHRs) and Architectural Decision Records (ADRs) when appropriate. Amendments to this constitution require explicit documentation and approval through the Spec-Kit Plus process.

**Version**: 1.0.0 | **Ratified**: 2026-01-31 | **Last Amended**: 2026-01-31

## Outcome

- ✅ Impact: Updated project constitution with comprehensive principles for Todo Full-Stack Web Application
- 🧪 Tests: none
- 📁 Files: Updated .specify/memory/constitution.md with detailed project governance
- 🔁 Next prompts: Continue with spec development and implementation
- 🧠 Reflection: Constitution now serves as the authoritative guide for all development activities

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): begin spec development using new constitution