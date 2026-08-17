import { useEffect, useState } from "react";
import QuestionField from "../dynamic/QuestionField.jsx";
import ContactStep from "./ContactStep.jsx";
import ResultStep from "./ResultStep.jsx";
import { fetchPublicConfig, submitEstimate } from "../../services/api.js";

// Wizard steps = [one step per active question from the API] + [contact] + [result].
// The step COUNT and CONTENT are entirely derived from server data — nothing here
// assumes there are 5 questions, or that a "material" or "pitch" question exists.
export default function EstimatorWizard() {
  const [config, setConfig] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [stepIndex, setStepIndex] = useState(0); // index into questions[]
  const [answers, setAnswers] = useState({});
  const [fieldError, setFieldError] = useState(null);
  const [phase, setPhase] = useState("questions"); // questions | contact | result
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    fetchPublicConfig()
      .then(setConfig)
      .catch((err) => setLoadError(err.message));
  }, []);

  // Edge case: Dale has toggled every question off. Nothing to ask, so
  // skip straight to contact capture rather than showing a blank step.
  useEffect(() => {
    if (config && config.questions.length === 0 && phase === "questions") {
      setPhase("contact");
    }
  }, [config, phase]);

  if (loadError) {
    return (
      <div className="text-center text-red-600 py-12">
        Couldn't load the estimator right now: {loadError}
      </div>
    );
  }

  if (!config) {
    return <div className="text-center text-gray-400 py-12">Loading estimator…</div>;
  }

  const questions = config.questions;
  const currentQuestion = questions[stepIndex];

  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setFieldError(null);
  };

  const validateCurrent = () => {
    const q = currentQuestion;
    const val = answers[q.key];
    const isEmpty = val === undefined || val === null || val === "";

    if (q.required && isEmpty) return `${q.label} is required.`;
    if (!isEmpty && q.type === "number") {
      if (q.min !== undefined && val < q.min) return `Must be at least ${q.min}.`;
      if (q.max !== undefined && val > q.max) return `Must be at most ${q.max}.`;
    }
    return null;
  };

  const goNext = () => {
    const err = validateCurrent();
    if (err) {
      setFieldError(err);
      return;
    }
    if (stepIndex < questions.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setPhase("contact");
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
      setFieldError(null);
    }
  };

  const handleContactSubmit = async (contact) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const data = await submitEstimate({ ...contact, answers });
      setResult(data);
      setPhase("result");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setStepIndex(0);
    setResult(null);
    setPhase("questions");
  };

  const progressPct =
    phase === "result"
      ? 100
      : phase === "contact"
      ? 95
      : Math.round(((stepIndex + 0.5) / questions.length) * 90);

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
          {config.business.name}
        </p>
        <h1 className="text-xl font-bold text-gray-900">Get an instant roofing estimate</h1>
      </div>

      <div className="h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-brand-600 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {phase === "questions" && currentQuestion && (
        <div className="flex flex-col gap-6">
          <QuestionField
            question={currentQuestion}
            value={answers[currentQuestion.key]}
            onChange={handleAnswerChange}
            error={fieldError}
          />
          <div className="flex justify-between items-center pt-2">
            <button
              onClick={goBack}
              disabled={stepIndex === 0}
              className="text-gray-500 font-medium disabled:opacity-0"
            >
              Back
            </button>
            <button
              onClick={goNext}
              className="bg-brand-600 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-brand-700"
            >
              {stepIndex === questions.length - 1 ? "Continue" : "Next"}
            </button>
          </div>
        </div>
      )}

      {phase === "contact" && (
        <ContactStep onSubmit={handleContactSubmit} submitting={submitting} error={submitError} />
      )}

      {phase === "result" && result && (
        <ResultStep result={result} businessName={config.business.name} onRestart={handleRestart} />
      )}
    </div>
  );
}
