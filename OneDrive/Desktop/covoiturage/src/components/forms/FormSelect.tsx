import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Option[];
  error?: string;
  helperText?: string;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, options, error, helperText, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="w-full flex flex-col gap-1.5 text-left">
        <label htmlFor={selectId} className="text-xs font-semibold text-text/80 tracking-wide uppercase">
          {label}
        </label>
        <select
          id={selectId}
          ref={ref}
          className={`w-full px-4 py-3 rounded-2xl border ${
            error ? 'border-danger focus:ring-danger/20' : 'border-border focus:ring-primary/20'
          } bg-white text-text text-sm transition-all focus:outline-none focus:ring-4 font-medium appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%2522%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%2364748B%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10 cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <span className="text-xs text-danger font-medium">{error}</span>
        ) : helperText ? (
          <span className="text-xs text-slate-500 font-medium">{helperText}</span>
        ) : null}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
