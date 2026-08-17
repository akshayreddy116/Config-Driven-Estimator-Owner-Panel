import mongoose from "mongoose";

/**
 * `answers` is intentionally Mixed/schemaless. The seed data proves why:
 * ld_0917 was captured against config_version 1 and has a completely
 * different answer shape (chimney_count, gutter_replace, a material value
 * that doesn't exist in the current config). Leads are a historical record
 * of "what was asked and answered at that point in time" — they must not
 * be forced into today's question schema, or we'd be rewriting history
 * every time Dale changes a question.
 */
const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    config_version: { type: Number, required: true },
    answers: { type: mongoose.Schema.Types.Mixed, required: true },
    estimate_low: { type: Number, required: true },
    estimate_high: { type: Number, required: true },
    captured_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Lead = mongoose.model("Lead", LeadSchema);
