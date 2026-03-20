export default function Field({ label, placeholder, type = "text", suffix, value, onChange, error, required }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold tracking-wide text-gray-300">
        {label} {required && <span className="text-orange-500">*</span>}
      </span>
      <div className="relative">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`h-11 w-full rounded-xl border bg-white/5 px-4 text-sm text-white placeholder:text-gray-600 outline-none transition-colors focus:ring-2 ${
            error
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20"
              : "border-white/10 focus:border-orange-500/60 focus:ring-orange-500/20"
          }`}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-4 flex items-center text-xs font-semibold text-gray-400">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </label>
  );
}
