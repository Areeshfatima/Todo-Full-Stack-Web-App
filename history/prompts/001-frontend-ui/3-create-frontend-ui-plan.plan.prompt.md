---
id: 3
title: create-frontend-ui-plan
stage: plan
date: 2026-01-31
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-frontend-ui
branch: 001-frontend-ui
user: user
command: /sp.plan
labels: [frontend, ui, plan, todo-app, architecture]
links:
  spec: specs/001-frontend-ui/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-frontend-ui/plan.md
  - specs/001-frontend-ui/research.md
  - specs/001-frontend-ui/data-model.md
  - specs/001-frontend-ui/quickstart.md
  - specs/001-frontend-ui/contracts/api-contract.md
tests:
  - none
---

## Prompt

```
Phase 2 Frontend: Implementation Plan for Professional, Eye-Catching Next.js Todo Web Interface

Create:
- Architecture sketch: App Router structure with root layout, protected route wrapper (middleware or server component check), auth pages (/login, /signup), protected dashboard (/app page), reusable components in /components (TaskCard, TaskFormModal, ToastProvider, Header, EmptyState).
- Component structure: Modular, reusable components — Header (user info + logout), FloatingAddButton, TaskCard (with hover effects, checkbox animation, action icons), TaskFormModal (add/edit unified), Toast notifications, SkeletonLoader for task list.
- Page flow: Public auth routes → redirect to / on login → protected /app route with task dashboard → modals for add/edit → optimistic UI updates.
- UI polish plan: Tailwind-based theme with custom config (soft shadows, rounded-lg, indigo/emerald accents, subtle gradients), animation classes (transitions, hover:scale, fade-ins), icon integration (Lucide-react).
- API client: Centralized /lib/api.ts with JWT attachment from Better Auth session, typed fetch wrappers for each endpoint.
- Quality validation: Visual review against premium design standards (whitespace, hierarchy, delight factors), performance check (fast initial load, no jank), accessibility audit (keyboard nav, ARIA).

Decisions needing documentation (in /frontend/CLAUDE.md):
- Layout choice: Single protected layout with client-side auth check vs server-side middleware — choose client wrapper for Better Auth session simplicity (tradeoff: slight flash vs easier JWT handling).
- Modal library: Pure Tailwind + Headless UI vs custom — choose custom with portal and blur backdrop for full control and minimal deps.
- Animation approach: Pure Tailwind transitions + CSS keyframes vs framer-motion — choose pure Tailwind for zero extra deps and sufficient polish (tradeoff: less complex animations but faster build).
- Icon library: Lucide-react vs Heroicons — choose Lucide for more modern, consistent stroke and built-in Tailwind support.
- Toast system: Custom with context vs third-party — choose simple context-based for lightweight and full style control.
- Optimistic updates: Implement for toggle complete and delete vs refetch only — choose optimistic for premium feel (tradeoff: minor complexity vs snappy UX).

Testing strategy (manual validation based on success criteria):
- Authentication: Signup → login → redirect to dashboard with valid JWT; failed login shows elegant error; logout clears session and redirects.
- Task Dashboard: Load tasks with skeleton → display premium cards with hover/animation; empty state shows inspiring illustration/message.
- Add Task: Open modal via floating button → submit valid data → instant optimistic add + toast success → refresh confirms persistence.
- Update Task: Edit modal pre-filled → partial changes → optimistic update in list → visual polish (smooth transitions).
- Delete Task: Confirm dialog → fade-out animation → optimistic remove + toast.
- Toggle Complete: Checkbox click → instant strike-through/color shift + optimistic update → sync on refetch.
- Responsiveness: Test mobile (stacked cards, larger touch targets), tablet, desktop views.
- Polish & Accessibility: Verify animations subtle and delightful, keyboard navigation works (tab through cards, modals), focus states visible and elegant, contrast ratios pass.
- Error States: Network offline → graceful message; API 401 → auto-redirect to login; validation errors → inline feedback in forms.

Technical details:
- Use iterative Claude Code generation via Frontend Subagent: Start with auth pages + Better Auth config → generate protected layout and API client → build dashboard and task list → add modals and forms → implement interactions and optimistic updates → final polish pass for animations/toasts/empty state.
- Spec refinement loop: If initial output lacks polish (e.g., flat cards, no hover), add explicit Tailwind class requirements and animation descriptions to next spec version.
- Break into phased generation: Phase A: Auth pages + Better Auth JWT setup + API client; Phase B: Protected layout + header + dashboard skeleton; Phase C: TaskCard component + list with empty state; Phase D: TaskFormModal (add/edit) + floating button; Phase E: Interactions (toggle, delete, optimistic updates) + toasts; Phase F: Final animations, responsiveness, and accessibility polish.
- Coordinate with Auth Subagent for Better Auth config and Integration Subagent for end-to-end flow validation.
- Document every iteration in specs/history/ and /frontend/CLAUDE.md with prompt, output summary, refinement rationale, and visual descriptions.
```

## Response snapshot

# Implementation Plan: Professional Todo Web Interface

**Branch**: `001-frontend-ui` | **Date**: 2026-01-31 | **Spec**: specs/001-frontend-ui/spec.md
**Input**: Feature specification from `/specs/001-frontend-ui/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a visually stunning, professional todo web interface using Next.js 16+ App Router with a premium design aesthetic. The application will feature clean minimalism with tasteful visual polish, modern typography, subtle animations, elegant card layouts, and intuitive interactions. It will include authentication pages, a protected dashboard with responsive task cards, modal forms for task management, and comprehensive error handling. All API calls will be secured with JWT tokens from Better Auth integration.

## Technical Context

**Language/Version**: TypeScript 5.0+, JavaScript ES2022
**Primary Dependencies**: Next.js 16+, React 19+, Tailwind CSS 3.4+, Better Auth, Lucide React, Headless UI
**Storage**: N/A (frontend only - data stored via API calls to backend)
**Testing**: Jest, React Testing Library (planned for future implementation)
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Web application
**Performance Goals**: <200ms initial page load, <100ms UI interaction response, 60fps animations
**Constraints**: <5MB bundle size, WCAG 2.1 AA accessibility compliance, responsive design for 320px-1920px screens
**Scale/Scope**: Single tenant per user, up to 1000 tasks per user, mobile-first responsive design

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- ✅ **Spec-Driven Development**: Plan follows the specification created in spec.md with detailed implementation approach
- ✅ **Iterative Spec Refinement**: Research phase will refine technical decisions based on practical implementation needs
- ✅ **Monorepo Organization**: Follows specified structure with /frontend directory and organized specs/
- ✅ **Separation of Concerns**: Clear boundary between frontend (Next.js App Router, TypeScript, Tailwind) and backend (handled separately)
- ✅ **Security First**: JWT-based protection integrated with Better Auth; all API requests require valid tokens
- ✅ **Reusable Intelligence**: Leverages Frontend Subagent for component development and consistent implementation

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-ui/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
frontend/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication pages (login, signup)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (protected)/              # Protected dashboard
│   │   └── app/
│   │       └── page.tsx
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page (redirects to app if authenticated)
├── components/                   # Reusable UI components
│   ├── TaskCard.tsx              # Premium task card component
│   ├── TaskFormModal.tsx         # Add/edit task modal
│   ├── Header.tsx                # Navigation header
│   ├── ProtectedRoute.tsx        # Auth wrapper component
│   ├── EmptyState.tsx            # Empty dashboard illustration
│   ├── ToastProvider.tsx         # Toast notifications
│   ├── SkeletonLoader.tsx        # Loading states
│   ├── ui/                       # Base UI components (buttons, inputs, etc.)
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   └── icons/                    # Icon components
│       └── index.ts              # Export all icons
├── lib/                          # Utility functions
│   └── api.ts                    # API client with JWT handling
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts                # Authentication state management
│   ├── useTasks.ts               # Task management hooks
│   └── useToast.ts               # Toast notification hooks
├── styles/                       # Global styles and Tailwind config
│   ├── globals.css
│   └── tailwind.config.js
├── public/                       # Static assets
│   └── images/                   # Illustrations for empty states
├── types/                        # TypeScript type definitions
│   └── index.ts
├── package.json
├── tsconfig.json
└── README.md
```

**Structure Decision**: Web application structure selected with dedicated frontend directory following Next.js App Router conventions. Components are organized by feature with reusable UI primitives in the ui/ subdirectory. Authentication and protected routes are separated into different route groups to maintain clear access controls.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Custom modal implementation | Need precise control over styling for premium aesthetic | Using Headless UI would limit design flexibility needed for brand identity |
| Custom toast system | Need seamless integration with design system and precise control over timing/positioning | Third-party libraries wouldn't match the exact visual specifications required |

## Outcome

- ✅ Impact: Created comprehensive implementation plan for the professional todo web interface
- 🧪 Tests: none
- 📁 Files: Created plan at specs/001-frontend-ui/plan.md, research.md, data-model.md, quickstart.md, and contracts/api-contract.md
- 🔁 Next prompts: Ready for task generation phase with /sp.tasks
- 🧠 Reflection: Plan covers architecture, technical context, project structure, and key decisions

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): not applicable
- Prompt variant (if applicable): not applicable
- Next experiment (smallest change to try): proceed to task generation phase