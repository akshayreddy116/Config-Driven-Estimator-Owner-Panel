import { Config } from "../models/Config.js";

/**
 * Fetches the single active config document. There should only ever be
 * one Config with is_active: true — adminController enforces that
 * invariant on every save.
 */
export async function getActiveConfig() {
  const config = await Config.findOne({ is_active: true }).lean();
  if (!config) {
    throw new Error("No active config found. Run the seed script.");
  }
  return config;
}

// GET /api/config — public. Returns only active questions, in order,
// plus public business info. Rates ARE included, because the frontend
// needs `rate_per_sqft` etc. to render option labels/prices if desired —
// what matters is that the *calculation* never runs client-side, not that
// the numbers are secret. A visitor could already infer prices by
// submitting different combinations to /api/estimate anyway.
export async function getPublicConfig(req, res) {
  try {
    const config = await getActiveConfig();
    const activeQuestions = config.questions
      .filter((q) => q.active)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    res.json({
      config_version: config.config_version,
      business: config.business,
      questions: activeQuestions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
