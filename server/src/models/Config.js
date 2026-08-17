import mongoose from "mongoose";

/**
 * A single selectable option inside a "select" type question.
 * Not every field applies to every question — e.g. `rate_per_sqft` only
 * makes sense on the `material` question's options, `multiplier` on
 * `pitch`/`stories`, `tear_off_per_sqft` on `layers`. We keep the schema
 * loose (all optional) rather than modelling each question type as a
 * separate sub-schema, because Dale may add a brand-new question type
 * of rate in the future and we don't want a migration to do it.
 */
const OptionSchema = new mongoose.Schema(
  {
    value: { type: String, required: true },
    label: { type: String, required: true },
    rate_per_sqft: { type: Number },
    multiplier: { type: Number },
    tear_off_per_sqft: { type: Number },
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    type: { type: String, enum: ["number", "select"], required: true },
    unit: { type: String },
    required: { type: Boolean, default: true },
    min: { type: Number },
    max: { type: Number },
    active: { type: Boolean, default: true },
    // Explicit display order so the owner can reorder questions later
    // without us relying on array insertion order (which Mongo does not
    // guarantee is stable across updates the way you'd hope).
    order: { type: Number, default: 0 },
    options: { type: [OptionSchema], default: undefined },
  },
  { _id: false }
);

const ConfigSchema = new mongoose.Schema(
  {
    config_version: { type: Number, required: true, default: 1 },
    // Only one config document is ever "live" at a time. We keep history
    // by never deleting old versions — every save creates a new version
    // — and leads reference the version that produced their estimate.
    is_active: { type: Boolean, default: true },
    business: {
      name: { type: String, required: true },
      region: { type: String },
      currency: { type: String, default: "USD" },
    },
    questions: { type: [QuestionSchema], default: [] },
    modifiers: {
      waste_factor: { type: Number, default: 0.1 },
      permit_flat_fee: { type: Number, default: 350 },
      range_spread_pct: { type: Number, default: 12 },
    },
  },
  { timestamps: true }
);

export const Config = mongoose.model("Config", ConfigSchema);
