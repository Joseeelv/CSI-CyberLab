import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth, className, ...props }, ref) => {
    return (
      <div className={`flex flex-col gap-2 ${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] 
              rounded-lg text-[var(--text-primary)] font-mono text-sm
              transition-all duration-200 outline-none
              focus:border-[var(--accent-primary)] focus:bg-[var(--bg-secondary)]
              focus:shadow-[0_0_0_3px_rgba(0,255,159,0.1),0_0_20px_rgba(0,255,159,0.15)]
              placeholder:text-[var(--text-muted)] placeholder:italic
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-[var(--accent-danger)]' : ''}
              ${className || ''}
            `}
            {...props}
          />
        </div>
        {error && (
          <span className="text-xs text-[var(--accent-danger)] font-medium">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
