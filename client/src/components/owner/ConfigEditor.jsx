import { useEffect, useState } from "react";
import { fetchAdminConfig, saveAdminConfig } from "../../services/api.js";

// Human-friendly labels for the rate fields an option might carry.
// This is UI-only labelling — it doesn't restrict which fields we send
// back, so a brand-new rate field added by a backend change still shows
// up (as its raw key) instead of silently disappearing from the editor.
const FIELD_LABELS = {
  rate_per_sqft: "Rate per sq ft ($)",
  multiplier: "Multiplier (e.g. 1.12 = +12%)",
  tear_off_per_sqft: "Tear-off cost per sq ft ($)",
};

function OptionEditor({ option, onChange }) {
  const rateKeys = Object.keys(option).filter((k) => k !== "value" && k !== "label");

  return (
    <div className="border border-gray-200 rounded-lg p-3 flex flex-col gap-2 bg-gray-50">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-gray-500">Option label</label>
        <input
          value={option.label}
          onChange={(e) => onChange({ ...option, label: e.target.value })}
          className="p-2 border rounded text-sm"
        />
      </div>
      {rateKeys.map((field) => (
        <div key={field} className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">
            {FIELD_LABELS[field] || field}
          </label>
          <input
            type="number"
            step="any"
            value={option[field]}
            onChange={(e) => onChange({ ...option, [field]: Number(e.target.value) })}
            className="p-2 border rounded text-sm"
          />
        </div>
      ))}
    </div>
  );
}

function QuestionEditor({ question, onChange }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3 bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">Question shown to customers</label>
          <input
            value={question.label}
            onChange={(e) => onChange({ ...question, label: e.target.value })}
            className="p-2 border rounded text-sm font-medium"
          />
          <span className="text-xs text-gray-400">field key: {question.key}</span>
        </div>
        <label className="flex items-center gap-2 pt-5 shrink-0">
          <span className="text-xs font-semibold text-gray-600">
            {question.active ? "Visible on site" : "Hidden"}
          </span>
          <input
            type="checkbox"
            checked={question.active}
            onChange={(e) => onChange({ ...question, active: e.target.checked })}
            className="h-5 w-5 accent-brand-600"
          />
        </label>
      </div>

      {question.type === "number" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Minimum allowed</label>
            <input
              type="number"
              value={question.min ?? ""}
              onChange={(e) => onChange({ ...question, min: Number(e.target.value) })}
              className="p-2 border rounded text-sm"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500">Maximum allowed</label>
            <input
              type="number"
              value={question.max ?? ""}
              onChange={(e) => onChange({ ...question, max: Number(e.target.value) })}
              className="p-2 border rounded text-sm"
            />
          </div>
        </div>
      )}

      {question.type === "select" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.options.map((opt, i) => (
            <OptionEditor
              key={opt.value}
              option={opt}
              onChange={(updatedOpt) => {
                const nextOptions = [...question.options];
                nextOptions[i] = updatedOpt;
                onChange({ ...question, options: nextOptions });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ConfigEditor({ token, onAuthError }) {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState(null);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error

  useEffect(() => {
    fetchAdminConfig(token)
      .then(setConfig)
      .catch((err) => {
        if (err.status === 401) return onAuthError?.();
        setError(err.message);
      });
  }, [token]);

  const updateQuestion = (index, updated) => {
    const next = [...config.questions];
    next[index] = updated;
    setConfig({ ...config, questions: next });
    setSaveState("idle");
  };

  const updateModifier = (key, value) => {
    setConfig({ ...config, modifiers: { ...config.modifiers, [key]: Number(value) } });
    setSaveState("idle");
  };

  const handleSave = async () => {
    setSaveState("saving");
    try {
      const saved = await saveAdminConfig(token, {
        business: config.business,
        questions: config.questions,
        modifiers: config.modifiers,
      });
      setConfig(saved);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2500);
    } catch (err) {
      if (err.status === 401) return onAuthError?.();
      setError(err.message);
      setSaveState("error");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!config) return <p className="text-gray-400">Loading configuration…</p>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Rates & Questions</h2>
          <p className="text-sm text-gray-500">
            Currently live: version {config.config_version}. Saving publishes a new version
            immediately — no restart needed.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saveState === "saving"}
          className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-brand-700 disabled:opacity-50"
        >
          {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">Waste factor (%)</label>
          <input
            type="number"
            step="any"
            value={config.modifiers.waste_factor * 100}
            onChange={(e) => updateModifier("waste_factor", Number(e.target.value) / 100)}
            className="p-2 border rounded text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">Permit flat fee ($)</label>
          <input
            type="number"
            step="any"
            value={config.modifiers.permit_flat_fee}
            onChange={(e) => updateModifier("permit_flat_fee", e.target.value)}
            className="p-2 border rounded text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-500">Estimate range spread (%)</label>
          <input
            type="number"
            step="any"
            value={config.modifiers.range_spread_pct}
            onChange={(e) => updateModifier("range_spread_pct", e.target.value)}
            className="p-2 border rounded text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {config.questions
          .slice()
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map((q) => {
            const realIndex = config.questions.findIndex((item) => item.key === q.key);
            return (
              <QuestionEditor key={q.key} question={q} onChange={(u) => updateQuestion(realIndex, u)} />
            );
          })}
      </div>
    </div>
  );
}
