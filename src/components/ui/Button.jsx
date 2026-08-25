const VARIANTS = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "inline-flex items-center justify-center gap-2 text-maroon font-semibold px-4 py-2 rounded-xl2 hover:bg-maroon/5 transition-colors",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  className = "",
  children,
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <Component
      className={`${VARIANTS[variant] || VARIANTS.primary} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </Component>
  );
}
