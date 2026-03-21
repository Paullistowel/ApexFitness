export default function Field({ label, placeholder, type = "text", suffix, value, onChange, error, required }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold tracking-wide text-foreground/80">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`h-11 w-full rounded-xl border bg-overlay/5 px-4 text-sm text-foreground placeholder:text-subtle outline-none transition-colors focus:ring-2 ${
            error
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
              : "border-border/10 focus:border-primary/60 focus:ring-primary/20"
          }`}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-muted">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </label>
  );
}
