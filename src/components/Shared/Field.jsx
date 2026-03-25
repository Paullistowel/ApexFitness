import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function Field({ label, placeholder, type = "text", suffix, value, onChange, error, required }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold tracking-wide text-foreground/80">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`h-11 w-full rounded-xl border bg-overlay/5 px-4 text-sm text-foreground placeholder:text-subtle outline-none transition-colors focus:ring-2 ${
            isPassword || suffix ? "pr-10" : ""
          } ${
            error
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
              : "border-border/10 focus:border-primary/60 focus:ring-primary/20"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-foreground transition-colors"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {suffix && !isPassword && (
          <span className="absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-muted">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </label>
  );
}
