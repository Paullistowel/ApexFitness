import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function SelectField({ label, options = [], placeholder, value, onChange, error, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-foreground/80">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`h-11 w-full rounded-xl border bg-overlay/5 px-4 text-sm transition-colors focus:ring-2 ${
            error
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20 text-foreground"
              : "border-border/10 focus:border-primary/60 focus:ring-primary/20 text-foreground"
          } ${!value ? "text-subtle" : "text-foreground"}`}
        >
          <SelectValue placeholder={placeholder || `Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-surface border border-border/10 rounded-xl text-foreground">
          {options.map((opt) => (
            <SelectItem
              key={opt.value ?? opt}
              value={opt.value ?? opt}
              className="text-foreground/80 focus:bg-overlay/10 focus:text-foreground cursor-pointer"
            >
              {opt.label ?? opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
