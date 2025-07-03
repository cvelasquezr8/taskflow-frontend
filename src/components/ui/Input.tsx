import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  className = '',
  ...props
}, ref) => {
  const inputClasses = `
    block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-secondary-400 
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed
    ${error 
      ? 'border-error-300 text-error-900 focus:ring-error-500' 
      : 'border-secondary-300 text-secondary-900'
    }
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-secondary-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';