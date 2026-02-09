---
name: nextjs-protected-page-generator
description: Generates protected pages in Next.js 16+ App Router with Better Auth integration
version: 1.0.0
---

# Next.js Protected Page Generator

## Description
This skill generates protected pages for Next.js 16+ applications using the App Router. The generated pages implement server-side authentication checks with Better Auth, redirecting unauthenticated users to the login page while rendering premium content for authenticated users.

## When to Use This Skill
- Creating protected dashboard pages
- Building authenticated user interfaces
- Implementing role-based access control
- Generating pages that require user authentication
- Securing sensitive content or functionality

## Process Steps

1. **Create the protected page file** in the `app` directory with the appropriate route (e.g., `app/dashboard/page.tsx`)
2. **Import required modules**:
   - `getServerSession` from better-auth/next-js
   - `redirect` from next/navigation
   - Any UI components or data fetching functions needed
   - Types for TypeScript support if applicable
3. **Implement server-side authentication check** using `getServerSession()` at the top of the component
4. **Handle authentication failure** by redirecting unauthenticated users to the login page using `redirect('/login')`
5. **Extract user information** from the session for personalized content
6. **Fetch protected data** using the user ID from the session with centralized API client
7. **Render protected content** for authenticated users with appropriate UI components
8. **Apply premium styling** using Tailwind CSS or your preferred styling framework
9. **Add error handling** for data fetching operations
10. **Include loading states** for better user experience during data fetching

## Output Format
The skill generates:
- A server component file (page.tsx) with authentication check
- Proper imports for Better Auth session management
- Conditional rendering based on authentication status
- Integration with API client for data fetching
- Responsive UI elements with Tailwind CSS classes

## Example

### Input
```
Generate a protected dashboard page that shows user's todo tasks
```

### Output

```typescript
import { getServerSession } from "@/.auth/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { TodoList } from "@/components/todo-list";
import { getUserTasks } from "@/lib/api-client";
import { Skeleton } from "@/components/ui/skeleton";

async function DashboardContent({ userId }: { userId: string }) {
  try {
    const tasks = await getUserTasks(userId);

    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
        <TodoList tasks={tasks} />
      </div>
    );
  } catch (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-red-500">Failed to load tasks. Please try again later.</p>
      </div>
    );
  }
}

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold leading-tight text-gray-900">
            Welcome back, {session.user.name || session.user.email}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="bg-white shadow rounded-lg p-6">
              <Skeleton className="h-6 w-1/4 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          }
        >
          <DashboardContent userId={session.user.id} />
        </Suspense>
      </main>
    </div>
  );
}
```

### Additional Files Created
- Component files if not already existing (e.g., `components/todo-list.tsx`)
- API client functions if not already existing (e.g., `lib/api-client.ts`)
- UI components if using shadcn/ui (e.g., `components/ui/skeleton.tsx`)