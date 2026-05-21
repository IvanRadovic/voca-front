import type { ReactNode } from 'react';

interface FieldProps {
  label?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

export default function Field({ label, error, htmlFor, children, className = '' }: FieldProps) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="label">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
