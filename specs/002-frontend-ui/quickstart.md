# Quickstart Guide: Professional Todo Web Interface

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A code editor (VS Code recommended)
- Git for version control

## Setup Instructions

### 1. Clone and Initialize the Repository
```bash
# Navigate to your project directory
cd /path/to/your/project

# Install dependencies
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the root of the frontend directory with the following:

```env
# Better Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-super-secret-jwt-token-here-change-me

# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### 3. Run the Development Server
```bash
# Start the frontend development server
npm run dev

# The application will be available at http://localhost:3000
```

## Project Structure Overview

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, signup)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (protected)/       # Protected dashboard
│   │   └── app/page.tsx
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (redirects to app if authenticated)
├── components/            # Reusable UI components
│   ├── TaskCard.tsx       # Premium task card component
│   ├── TaskFormModal.tsx  # Add/edit task modal
│   ├── Header.tsx         # Navigation header
│   ├── ProtectedRoute.tsx # Auth wrapper component
│   └── ui/               # Base UI components (buttons, inputs, etc.)
├── lib/                  # Utility functions
│   └── api.ts            # API client with JWT handling
├── hooks/                # Custom React hooks
│   └── useAuth.ts        # Authentication state management
└── styles/               # Global styles and Tailwind config
    └── globals.css
```

## Key Components

### Authentication Flow
1. Unauthenticated users are directed to `/login` or `/signup`
2. Successful authentication stores JWT in Better Auth session
3. Protected routes use `ProtectedRoute` wrapper component
4. JWT is automatically attached to all API requests

### Task Management
1. Tasks are displayed in a responsive grid of premium cards
2. Each card has hover effects, completion toggle, and action icons
3. Add/edit operations use modal dialogs with smooth animations
4. Optimistic updates provide instant visual feedback

### UI Components
- **Header**: Shows user info and logout button
- **TaskCard**: Displays task info with completion toggle and actions
- **TaskFormModal**: Unified form for adding and editing tasks
- **ToastProvider**: Handles success/error notifications
- **SkeletonLoader**: Shows loading states during data fetch

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests (if implemented)
npm run test
```

## API Integration

The application uses a centralized API client in `lib/api.ts` that:
- Attaches JWT tokens from Better Auth session to requests
- Handles common error scenarios
- Implements optimistic updates for better UX
- Provides typed request/response handling

## Styling Convention

- All styling uses Tailwind CSS utility classes
- Custom design tokens defined in `tailwind.config.js`
- Consistent color palette: soft grays, whites, indigo/emerald accents
- Responsive design using Tailwind's breakpoint system
- Smooth transitions and animations using Tailwind's transition utilities

## Common Development Tasks

### Adding a New Page
1. Create a new directory in `app/` with the route name
2. Add a `page.tsx` file in the directory
3. Import and use the `ProtectedRoute` component if authentication is required

### Creating a New Component
1. Create the component in the `components/` directory
2. Follow the premium design aesthetic with proper spacing and typography
3. Use Tailwind classes for styling
4. Add TypeScript interfaces for props

### Adding API Endpoints
1. Add the endpoint to `lib/api.ts` with proper typing
2. Include JWT token handling
3. Add error handling and loading states
4. Implement optimistic updates where appropriate

## Troubleshooting

### Common Issues
- **Authentication fails**: Check that `BETTER_AUTH_SECRET` is the same in frontend and backend
- **API calls return 401**: Verify JWT token is being properly attached to requests
- **Styling issues**: Ensure Tailwind CSS is properly configured and classes are correctly applied
- **Component not rendering**: Check that imports are correct and component exports are properly defined

### Development Tips
- Use the browser's developer tools to inspect network requests and component state
- Enable React Developer Tools for debugging component hierarchies
- Check console for any TypeScript or runtime errors
- Verify that all environment variables are properly set