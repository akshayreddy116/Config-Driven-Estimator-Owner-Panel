

export class EstimateValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "EstimateValidationError";
    this.details = details;
  }
}

function getSelectedOption(question, selectedValue) {
  if (!question.options) return null;
  return question.options.find((opt) => opt.value === String(selectedValue)) ?? null;
}


export function validateAnswers(config, answers) {
  const problems = [];
  const activeQuestions = config.questions.filter((q) => q.active);

  for (const q of activeQuestions) {
    const raw = answers?.[q.key];
    const isMissing = raw === undefined || raw === null || raw === "";

    if (q.required && isMissing) {
      problems.push({ key: q.key, message: `${q.label} is required.` });
      continue;
    }
    if (isMissing) continue; // optional and not provided, skip further checks

    if (q.type === "number") {
      const num = Number(raw);
      if (Number.isNaN(num)) {
        problems.push({ key: q.key, message: `${q.label} must be a number.` });
        continue;
      }
      if (q.min !== undefined && num < q.min) {
        problems.push({ key: q.key, message: `${q.label} must be at least ${q.min}.` });
      }
      if (q.max !== undefined && num > q.max) {
        problems.push({ key: q.key, message: `${q.label} must be at most ${q.max}.` });
      }
    }

    if (q.type === "select") {
      const opt = getSelectedOption(q, raw);
      if (!opt) {
        problems.push({ key: q.key, message: `${q.label} has an invalid selection.` });
      }
    }
  }

  if (problems.length > 0) {
    throw new EstimateValidationError("One or more answers are invalid.", problems);
  }
}

export function calculateEstimate(config, answers) {
  const { questions, modifiers } = config;

  const findQuestion = (key) => questions.find((q) => q.key === key);
  const selectedOptionFor = (key) => {
    const q = findQuestion(key);
    if (!q) return null;
    return getSelectedOption(q, answers[key]);
  };

  const roofArea = Number(answers.roof_area || 0);

  const materialOpt = selectedOptionFor("material");
  const pitchOpt = selectedOptionFor("pitch");
  const layersOpt = selectedOptionFor("layers");
  const storiesOpt = selectedOptionFor("stories");

  const ratePerSqft = Number(materialOpt?.rate_per_sqft ?? 0);
  const pitchMultiplier = Number(pitchOpt?.multiplier ?? 1);
  const tearOffPerSqft = Number(layersOpt?.tear_off_per_sqft ?? 0);
  const storiesMultiplier = Number(storiesOpt?.multiplier ?? 1);

  const wasteFactor = Number(modifiers.waste_factor ?? 0.1);
  const permitFee = Number(modifiers.permit_flat_fee ?? 350);
  const spreadPct = Number(modifiers.range_spread_pct ?? 12) / 100;

  const baseMaterialCost = roofArea * ratePerSqft * (1 + wasteFactor);
  const tearOffCost = roofArea * tearOffPerSqft;
  const subtotal = (baseMaterialCost + tearOffCost) * pitchMultiplier * storiesMultiplier;
  const midEstimate = subtotal + permitFee;

  const estimateLow = Math.round(midEstimate * (1 - spreadPct));
  const estimateHigh = Math.round(midEstimate * (1 + spreadPct));

  return {
    estimate_low: estimateLow,
    estimate_high: estimateHigh,
    breakdown: {
      roof_area: roofArea,
      rate_per_sqft: ratePerSqft,
      waste_factor: wasteFactor,
      base_material_cost: Math.round(baseMaterialCost),
      tear_off_per_sqft: tearOffPerSqft,
      tear_off_cost: Math.round(tearOffCost),
      pitch_multiplier: pitchMultiplier,
      stories_multiplier: storiesMultiplier,
      subtotal: Math.round(subtotal),
      permit_fee: permitFee,
      mid_estimate: Math.round(midEstimate),
      spread_pct: spreadPct,
    },
  };
}
