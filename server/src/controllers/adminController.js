import { Config } from "../models/Config.js";
import { Lead } from "../models/Lead.js";

// GET /api/admin/config — protected. Returns the full active config,
// including inactive questions, so the owner can re-enable them.
export async function getAdminConfig(req, res) {
  const config = await Config.findOne({ is_active: true }).lean();
  if (!config) return res.status(404).json({ error: "No active config found." });
  res.json(config);
}

/**
 * PUT /api/admin/config — protected.
 *
 * We never mutate the live config document in place. Every save writes a
 * NEW Config document with config_version + 1 and flips is_active, then
 * deactivates the old one. Two reasons:
 *   1. Leads already reference a config_version — if we edited in place,
 *      "what config produced this estimate" would silently rewrite itself.
 *   2. It avoids a race where a homeowner mid-flow reads config v3, Dale
 *      saves an edit, and the homeowner's POST /api/estimate then
 *      recalculates against a config they never saw. The switchover is a
 *      single atomic "new active doc" swap, not a field-by-field patch
 *      that could be read half-written.
 */
export async function updateAdminConfig(req, res) {
  try {
    const current = await Config.findOne({ is_active: true });
    if (!current) return res.status(404).json({ error: "No active config found." });

    const { business, questions, modifiers } = req.body || {};
    if (!business || !Array.isArray(questions) || !modifiers) {
      return res.status(400).json({ error: "business, questions[], and modifiers are required." });
    }

    // Basic shape validation so a bad admin-panel edit can't corrupt the
    // config in a way that crashes the public estimator.
    for (const q of questions) {
      if (!q.key || !q.label || !["number", "select"].includes(q.type)) {
        return res.status(422).json({ error: `Invalid question: ${JSON.stringify(q)}` });
      }
      if (q.type === "select" && (!Array.isArray(q.options) || q.options.length === 0)) {
        return res.status(422).json({ error: `Select question "${q.key}" needs at least one option.` });
      }
    }

    const next = await Config.create({
      config_version: current.config_version + 1,
      is_active: true,
      business,
      questions,
      modifiers,
    });

    current.is_active = false;
    await current.save();

    res.json(next);
  } catch (err) {
    console.error("[admin/config] failed:", err);
    res.status(500).json({ error: "Could not save config." });
  }
}

// GET /api/admin/leads — protected. Most recent first.
export async function getAdminLeads(req, res) {
  const leads = await Lead.find().sort({ captured_at: -1 }).lean();
  res.json(leads);
}
