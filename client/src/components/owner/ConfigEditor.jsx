import { useEffect, useState } from "react";
import { fetchAdminConfig, saveAdminConfig } from "../../services/api.js";

const LABELS = {
  rate_per_sqft: "Rate per sq ft ($)",
  multiplier: "Multiplier",
  tear_off_per_sqft: "Tear-off / sq ft ($)",
};

const Input = ({ label, ...props }) => (
  <label className="flex flex-col gap-1">
    <span className="text-xs font-semibold text-slate-500">{label}</span>
    <input
      {...props}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
    />
  </label>
);

function OptionEditor({ option, onChange }) {
  const fields = Object.keys(option).filter(
    (key) => !["value", "label"].includes(key)
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Input
          label="Option label"
          value={option.label}
          onChange={(e) => onChange({ ...option, label: e.target.value })}
        />

        {fields.map((field) => (
          <Input
            key={field}
            label={LABELS[field] || field}
            type="number"
            step="any"
            value={option[field] ?? ""}
            onChange={(e) =>
              onChange({ ...option, [field]: Number(e.target.value) })
            }
          />
        ))}
      </div>
    </div>
  );
}

function QuestionEditor({ question, onChange }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <Input
            label="Customer question"
            value={question.label}
            onChange={(e) => onChange({ ...question, label: e.target.value })}
          />
          <p className="mt-1 text-xs text-slate-400">
            Field: {question.key}
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600">
          <input
            type="checkbox"
            checked={question.active}
            onChange={(e) =>
              onChange({ ...question, active: e.target.checked })
            }
            className="h-4 w-4 accent-emerald-600"
          />
          {question.active ? "Visible" : "Hidden"}
        </label>
      </div>

      {question.type === "number" && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Input
            label="Minimum allowed"
            type="number"
            value={question.min ?? ""}
            onChange={(e) =>
              onChange({ ...question, min: Number(e.target.value) })
            }
          />
          <Input
            label="Maximum allowed"
            type="number"
            value={question.max ?? ""}
            onChange={(e) =>
              onChange({ ...question, max: Number(e.target.value) })
            }
          />
        </div>
      )}

      {question.type === "select" && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {question.options?.map((option, index) => (
            <OptionEditor
              key={option.value}
              option={option}
              onChange={(updated) => {
                const options = [...question.options];
                options[index] = updated;
                onChange({ ...question, options });
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
  const [error, setError] = useState("");
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    fetchAdminConfig(token)
      .then(setConfig)
      .catch((err) => {
        if (err.status === 401) return onAuthError?.();
        setError(err.message);
      });
  }, [token]);

  const updateQuestion = (index, question) => {
    const questions = [...config.questions];
    questions[index] = question;
    setConfig({ ...config, questions });
    setStatus("idle");
  };

  const updateModifier = (key, value) => {
    setConfig({
      ...config,
      modifiers: {
        ...config.modifiers,
        [key]: Number(value),
      },
    });
    setStatus("idle");
  };

  const save = async () => {
    setStatus("saving");

    try {
      const saved = await saveAdminConfig(token, {
        business: config.business,
        questions: config.questions,
        modifiers: config.modifiers,
      });

      setConfig(saved);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      if (err.status === 401) return onAuthError?.();
      setError(err.message);
      setStatus("error");
    }
  };

  if (error)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );

  if (!config)
    return (
      <div className="flex min-h-40 items-center justify-center text-sm text-slate-400">
        Loading configuration...
      </div>
    );

  const questions = [...config.questions].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  );

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Rates & Questions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage estimator pricing and customer questions.
          </p>
          <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            Version {config.config_version}
          </span>
        </div>

        <button
          onClick={save}
          disabled={status === "saving"}
          className="rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "saving"
            ? "Saving..."
            : status === "saved"
            ? "✓ Saved"
            : "Save Changes"}
        </button>
      </div>

      {/* Pricing */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h3 className="font-bold text-slate-900">Pricing Modifiers</h3>
          <p className="text-sm text-slate-500">
            These values affect the final roofing estimate.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Waste factor (%)"
            type="number"
            step="any"
            value={(config.modifiers.waste_factor ?? 0) * 100}
            onChange={(e) =>
              updateModifier("waste_factor", Number(e.target.value) / 100)
            }
          />

          <Input
            label="Permit flat fee ($)"
            type="number"
            step="any"
            value={config.modifiers.permit_flat_fee ?? ""}
            onChange={(e) =>
              updateModifier("permit_flat_fee", e.target.value)
            }
          />

          <Input
            label="Estimate range spread (%)"
            type="number"
            step="any"
            value={config.modifiers.range_spread_pct ?? ""}
            onChange={(e) =>
              updateModifier("range_spread_pct", e.target.value)
            }
          />
        </div>
      </section>

      {/* Questions */}
      <section>
        <div className="mb-4">
          <h3 className="font-bold text-slate-900">Estimator Questions</h3>
          <p className="text-sm text-slate-500">
            Customize what customers answer before receiving an estimate.
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((question) => {
            const index = config.questions.findIndex(
              (item) => item.key === question.key
            );

            return (
              <QuestionEditor
                key={question.key}
                question={question}
                onChange={(updated) => updateQuestion(index, updated)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}