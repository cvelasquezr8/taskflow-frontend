import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  className = '',
  ...props
}, ref) => {
  const selectClasses = `
    block w-full px-3 py-2 pr-10 border rounded-lg shadow-sm 
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
    disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed
    appearance-none bg-white
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
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400 pointer-events-none" />
      </div>
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';