import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, helperText, className = '', type = 'text', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label htmlFor={inputId} className="text-xs font-semibold text-text/80 tracking-wide uppercase">
          {label}
        </label>
        <input
          id={inputId}
          type={type}
          ref={ref}
          className={`w-full px-4 py-3 rounded-2xl border ${
            error ? 'border-danger focus:ring-danger/20' : 'border-border focus:ring-primary/20'
          } bg-white text-text text-sm transition-all focus:outline-none focus:ring-4 placeholder-slate-400 font-medium ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs text-danger font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-slate-500 font-medium">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
