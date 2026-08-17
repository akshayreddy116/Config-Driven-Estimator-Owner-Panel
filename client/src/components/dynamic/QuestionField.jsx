/**
 * Renders a single form field purely from a `question` object the API
 * gave us. This file must never reference a question `key`, `value`, or
 * rate by name — if it did, that would be exactly the hardcoding the
 * assignment forbids. Everything here is generic over `type`.
 */
export default function QuestionField({ question, value, onChange, error }) {
  const { key, label, type, unit, min, max, options, required } = question;

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-gray-800" htmlFor={key}>
        {label}
        {required && <span className="text-red-500"> *</span>}
        {unit ? <span className="text-gray-400 font-normal"> ({unit})</span> : null}
      </label>

      {type === "number" && (
        <input
          id={key}
          type="number"
          min={min}
          max={max}
          value={value ?? ""}
          onChange={(e) => onChange(key, e.target.value === "" ? "" : Number(e.target.value))}
          className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
          placeholder={min !== undefined && max !== undefined ? `Between ${min} and ${max}` : ""}
        />
      )}

      {type === "select" && (
        <div className="grid grid-cols-1 gap-2">
          {(options || []).map((opt) => (
            <label
              key={opt.value}
              className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between transition ${
                value === opt.value
                  ? "bg-brand-50 border-brand-600 font-medium"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <span>{opt.label}</span>
              <input
                type="radio"
                name={key}
                value={opt.value}
                checked={value === opt.value}
                onChange={() => onChange(key, opt.value)}
                className="h-4 w-4 accent-brand-600"
              />
            </label>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
