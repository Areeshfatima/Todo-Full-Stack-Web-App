---
name: premium-tailwind-component-generator
description: Generates premium Tailwind components for Next.js 16+ with consistent indigo/emerald palette
version: 1.0.0
---

# Premium Tailwind Component Generator

## Description
This skill generates premium Tailwind CSS components for Next.js 16+ applications with a consistent indigo/emerald color palette. The generated components feature soft shadows, hover lifts, smooth transitions, mobile responsiveness, accessibility features, and delightful interactions like checkbox animations and tooltips.

## When to Use This Skill
- Creating form components (buttons, inputs, checkboxes, toggles)
- Building layout components (cards, modals, navigation, grids)
- Developing interactive elements (tooltips, dropdowns, accordions, dialogs)
- Ensuring consistent design system across the application
- Implementing accessible and responsive UI components
- Adding delightful micro-interactions to UI elements

## Process Steps

1. **Identify the component type** needed (button, card, form element, etc.) and its primary function
2. **Establish the base styling** with consistent indigo/emerald color palette:
   - Primary indigo colors: `indigo-500`, `indigo-600`, `indigo-700`
   - Secondary emerald colors: `emerald-500`, `emerald-600`
   - Neutral backgrounds: `gray-50`, `gray-100`, `white`
3. **Implement soft shadow effects** using Tailwind's shadow utilities (`shadow-sm`, `shadow`, `shadow-md`) with hover enhancements
4. **Add hover lift effects** using transform utilities (`hover:-translate-y-0.5`, `hover:shadow-lg`)
5. **Apply smooth transition properties** for all interactive states (`transition-all duration-200 ease-in-out`)
6. **Ensure mobile responsiveness** with responsive utility classes (`sm:`, `md:`, `lg:` prefixes)
7. **Integrate accessibility features**:
   - Semantic HTML elements
   - Proper ARIA attributes
   - Keyboard navigation support
   - Focus ring styles (`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`)
8. **Add delightful micro-interactions**:
   - Checkbox animations with opacity and transform transitions
   - Tooltip fade-ins with `animate-in fade-in`
   - Button press effects
9. **Implement proper focus states** for keyboard navigation with visible focus rings
10. **Structure the component** with TypeScript interfaces for type safety and prop validation
11. **Document the component** with JSDoc comments explaining props and usage
12. **Test responsive behavior** across various screen sizes and devices

## Output Format
The skill generates:
- A React component file with TypeScript support
- Consistent indigo/emerald color palette applied throughout
- Proper Tailwind classes for styling and responsiveness
- Accessibility attributes and keyboard navigation support
- Interactive states with smooth transitions
- Documentation comments for props and usage

## Example

### Input
```
Generate a premium button and card component with indigo/emerald colors, hover effects, and animations
```

### Output

```tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    // Variant classes
    const variantClasses = {
      primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 border-transparent',
      secondary: 'bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 focus:ring-indigo-500',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-indigo-500',
      destructive: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 border-transparent',
    };

    const disabledClasses = disabled || isLoading
      ? '!bg-gray-300 !text-gray-500 !border-gray-300 !cursor-not-allowed pointer-events-none'
      : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center rounded-md font-medium
          transition-all duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2
          border border-transparent shadow-sm
          hover:shadow-md hover:-translate-y-0.5
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? 'w-full' : ''}
          ${disabledClasses}
          ${className || ''}
        `}
        {...props}
      >
        {isLoading && (
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  border?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, elevated = true, border = true, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          bg-white rounded-xl
          ${elevated ? 'shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out' : 'shadow-none'}
          ${border ? 'border border-gray-200' : 'border-0'}
          overflow-hidden
          transition-all duration-200 ease-in-out
          ${className || ''}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={`first:pt-6 px-6 pb-4 ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  )
);

CardHeader.displayName = "CardHeader";

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={`px-6 pb-6 ${className || ''}`} {...props}>
      {children}
    </div>
  )
);

CardContent.displayName = "CardContent";

export { Button, Card, CardHeader, CardContent };
```

### Additional Files Created
- Type definitions if not already existing (e.g., `types/components.ts`)
- Reusable utility functions if needed (e.g., `lib/utils.ts`)
- Component storybook stories if Storybook is integrated