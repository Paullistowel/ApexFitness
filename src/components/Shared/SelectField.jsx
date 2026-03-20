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
      <span className="text-sm font-semibold text-gray-300">
        {label} {required && <span className="text-orange-500">*</span>}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          className={`h-11 w-full rounded-xl border bg-white/5 px-4 text-sm transition-colors focus:ring-2 ${
            error
              ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20 text-white"
              : "border-white/10 focus:border-orange-500/60 focus:ring-orange-500/20 text-white"
          } ${!value ? "text-gray-600" : "text-white"}`}
        >
          <SelectValue placeholder={placeholder || `Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-[#1a0f08] border border-white/10 rounded-xl text-white">
          {options.map((opt) => (
            <SelectItem
              key={opt.value ?? opt}
              value={opt.value ?? opt}
              className="text-gray-300 focus:bg-white/10 focus:text-white cursor-pointer"
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
