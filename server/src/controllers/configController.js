import { Config } from "../models/Config.js";

export async function getActiveConfig() {
  const config = await Config.findOne({ is_active: true }).lean();
  if (!config) {
    throw new Error("No active config found. Run the seed script.");
  }
  return config;
}

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

