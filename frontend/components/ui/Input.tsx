import React, { useState } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helperText, className, value, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasValue = !!value || (props.defaultValue && props.defaultValue.toString().length > 0);
    const hasError = !!error;
    const isSuccess = !!success;

    // Base classes with Tailwind styling for premium design
    let baseClasses = 'w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 peer';

    if (hasError) {
      baseClasses += 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50';
    } else if (isSuccess) {
      baseClasses += 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50';
    } else {
      baseClasses += 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 hover:border-primary-400 bg-white';
    }

    const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;

    return (
      <div className="w-full relative">
        {label && (
          <label
            htmlFor={props.id}
            className={`absolute left-4 transition-all duration-200 pointer-events-none text-gray-500 ${
              isFocused || hasValue
                ? '-top-2 text-xs bg-white px-1 text-primary-600'
                : 'top-3 text-sm'
            }`}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={combinedClasses}
          aria-invalid={hasError}
          aria-describedby={props.id && (helperText || error || success) ? `${props.id}-feedback` : undefined}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          value={value}
          {...props}
        />
        {(helperText || error || success) && props.id && (
          <p
            id={`${props.id}-feedback`}
            className={`mt-1 text-sm ${
              hasError ? 'text-red-600' : isSuccess ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {error || success || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };