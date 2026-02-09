'use client';

import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, success, helperText, className, ...props }, ref) => {
    const hasError = !!error;
    const isSuccess = !!success;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
            hasError
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50'
              : isSuccess
              ? 'border-green-300 focus:ring-green-500 focus:border-green-500 bg-green-50'
              : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 bg-white'
          } ${className || ''}`}
          {...props}
        />
        {(helperText || error || success) && (
          <p
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