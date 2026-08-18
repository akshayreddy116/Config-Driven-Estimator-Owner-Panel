import { useEffect, useState } from "react";
import QuestionField from "../dynamic/QuestionField.jsx";
import ContactStep from "./ContactStep.jsx";
import ResultStep from "./ResultStep.jsx";
import { fetchPublicConfig, submitEstimate,} from "../../services/api.js";

export default function EstimatorWizard() {
  const [config, setConfig] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [fieldError, setFieldError] = useState("");
  const [phase, setPhase] = useState("questions");
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchPublicConfig()
      .then(setConfig)
      .catch((err) =>
        setLoadError(err.message || "Failed to load estimator")
      );
  }, []);

  useEffect(() => {
    if (
      config &&
      config.questions.length === 0 &&
      phase === "questions"
    ) {
      setPhase("contact");
    }
  }, [config, phase]);

  if (loadError) {
    return (
      <div className="py-12 text-center text-red-600">
        Couldn't load the estimator right now: {loadError}
      </div>
    );
  }

  if (!config) {
    return (
      <div className="py-12 text-center text-gray-400">
        Loading estimator...
      </div>
    );
  }

  const questions = config.questions;
  const currentQuestion = questions[stepIndex];
  const handleAnswerChange = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
    setFieldError("");
  };

  const validateCurrent = () => {
    const q = currentQuestion;
    const value = answers[q.key];
    const isEmpty =
      value === undefined ||
      value === null ||
      value === "";

    if (q.required && isEmpty) {
      return `${q.label} is required.`;
    }

    if (!isEmpty && q.type === "number") {
      if (q.min !== undefined && value < q.min) {
        return `Must be at least ${q.min}.`;
      }

      if (q.max !== undefined && value > q.max) {
        return `Must be at most ${q.max}.`;
      }
    }

    return "";
  };

  const goNext = () => {
    const error = validateCurrent();

    if (error) {
      setFieldError(error);
      return;
    }

    if (stepIndex < questions.length - 1) {
      setStepIndex((prev) => prev + 1);
    } else {
      setPhase("contact");
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
      setFieldError("");
    }
  };

  const handleContactSubmit = async (contact) => {
    setSubmitting(true);
    setSubmitError("");

    try {
      const data = await submitEstimate({
        ...contact,
        answers,
      });
      setResult(data);
      setPhase("result");
    } catch (err) {
      setSubmitError(
        err.response?.data?.error ||
          err.message ||
          "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setStepIndex(0);
    setResult(null);
    setFieldError("");
    setSubmitError("");
    setPhase("questions");
  };

  const progress =
    phase === "result"
      ? 100
      : phase === "contact"
      ? 95
      : Math.round(
          ((stepIndex + 0.5) / questions.length) * 90
        );

  return (
    <div className="mx-auto w-full max-w-md">
      {/* ESTIMATOR CARD */}
      <div className="min-h-[520px] rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* HEADER */}
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {config.business.name}
          </p>

          <h1 className="mt-1 text-xl font-bold text-gray-900">
            Get an instant roofing estimate
          </h1>
        </div>

        {/* PROGRESS */}
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-brand-600 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        {phase === "questions" && currentQuestion && (
          <div className="flex min-h-[330px] flex-col">
            <div className="flex-1">
              <QuestionField
                question={currentQuestion}
                value={answers[currentQuestion.key]}
                onChange={handleAnswerChange}
                error={fieldError}
              />
            </div>

            <div className="flex items-center justify-between pt-6">
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="font-medium text-gray-500 disabled:invisible"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-lg bg-brand-600 px-6 py-2.5 font-semibold text-white hover:bg-brand-700"
              >
                {stepIndex === questions.length - 1
                  ? "Continue" : "Next"}
              </button>
            </div>
          </div>
        )}

        {phase === "contact" && (
          <div className="min-h-[330px]">
            <ContactStep
              onSubmit={handleContactSubmit}
              submitting={submitting}
              error={submitError}
            />
          </div>
        )}

        {phase === "result" && result && (
          <div className="min-h-[330px]">
            <ResultStep
              result={result}
              businessName={config.business.name}
              onRestart={handleRestart}
            />
          </div>
        )}
      </div>
    </div>
  );
}