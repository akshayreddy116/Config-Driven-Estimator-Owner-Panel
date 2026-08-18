import { Lead } from "../models/Lead.js";
import { getActiveConfig } from "./configController.js";
import { calculateEstimate, validateAnswers, EstimateValidationError } from "../services/calculator.js";

export async function submitEstimate(req, res) {
  try {
    const { name, phone, email, answers } = req.body || {};
    if (!name || !phone || !email) {
      return res.status(400).json({ error: "name, phone, and email are required." });
    }
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "answers payload is required." });
    }

    const config = await getActiveConfig();
    validateAnswers(config, answers);

    const { estimate_low, estimate_high } = calculateEstimate(config, answers);

    const lead = await Lead.create({
      name,
      phone,
      email,
      config_version: config.config_version,
      answers,
      estimate_low,
      estimate_high,
    });

    res.status(201).json({
      lead_id: lead._id,
      config_version: config.config_version,
      estimate_low,
      estimate_high,
      currency: config.business.currency,
    });
  } catch (err) {
    if (err instanceof EstimateValidationError) {
      return res.status(422).json({ error: err.message, details: err.details });
    }
    console.error("[estimate] failed:", err);
    res.status(500).json({ error: "Could not calculate estimate." });
  }
}
