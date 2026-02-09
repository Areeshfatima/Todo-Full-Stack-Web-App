# Todo Mastery Frontend

A premium todo application with elegant design and smooth interactions built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Secure login and signup with JWT handling
- **Task Management**: Create, read, update, and delete tasks
- **Premium UI**: Elegant design with smooth animations and transitions
- **Responsive Design**: Works seamlessly across mobile, tablet, and desktop
- **Accessibility**: Full keyboard navigation and ARIA support

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Headless UI
- **Authentication**: Better Auth

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with the following:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=your-super-secret-jwt-token-here-change-me
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (protected)/       # Protected dashboard
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── icons/            # Icon components
├── lib/                  # Utility functions
├── hooks/                # Custom React hooks
├── styles/               # Global styles
├── types/                # TypeScript definitions
└── public/               # Static assets
```

## Key Components

- **TaskCard**: Displays individual tasks with completion toggle and actions
- **TaskFormModal**: Modal form for creating and editing tasks
- **ProtectedRoute**: Wrapper component to protect routes that require authentication
- **Header**: Navigation header with user info and logout
- **SkeletonLoader**: Loading states for better UX
- **ToastProvider**: Notification system for success/error messages

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the backend API
- `BETTER_AUTH_URL`: URL for the Better Auth service
- `BETTER_AUTH_SECRET`: Secret for JWT signing (change in production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT