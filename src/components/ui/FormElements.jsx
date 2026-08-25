import { forwardRef } from "react";

export const Input = forwardRef(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-1.5">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        ref={ref}
        {...props}
        className={`w-full rounded-xl border border-brown/15 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-maroon focus:ring-1 focus:ring-maroon/20 ${className}`}
      />

      {error && (
        <p className="mt-1 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

export function Select({ label, error, className = "", id, children, ...props }) {
  const selectId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-brown mb-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-4 py-2.5 rounded-xl border ${
          error ? "border-nonveg" : "border-brown/15"
        } bg-white focus:border-maroon focus:ring-1 focus:ring-maroon outline-none transition ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-nonveg">{error}</p>}
    </div>
  );
}

export function Badge({ children, tone = "maroon", className = "" }) {
  const tones = {
    maroon: "bg-maroon text-white",
    saffron: "bg-saffron text-white",
    gold: "bg-gold text-white",
    veg: "bg-veg/10 text-veg",
    outline: "border border-maroon text-maroon",
  };
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "", ...props }) {
  return (
    <div className={`card ${className}`} {...props}>
      {children}
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-brown/10 rounded-lg ${className}`} />;
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {Icon && <Icon className="w-12 h-12 text-brown/30 mb-4" aria-hidden="true" />}
      <h3 className="text-lg font-semibold text-brown mb-1">{title}</h3>
      {description && <p className="text-brown/60 max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Something went wrong", description, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <h3 className="text-lg font-semibold text-nonveg mb-1">{title}</h3>
      {description && <p className="text-brown/60 max-w-sm mb-4">{description}</p>}
      {onRetry && (
        <button onClick={onRetry} className="btn-outline">
          Try Again
        </button>
      )}
    </div>
  );
}
