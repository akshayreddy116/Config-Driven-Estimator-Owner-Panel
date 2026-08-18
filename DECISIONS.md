# DECISIONS.md

## Stack

- **Frontend:** React 18 + Vite + Tailwind, React Router for two routes (`/` public estimator, `/admin` owner panel).
- **Backend:** Node + Express, plain JS with ES modules (no TypeScript — the schema is small enough that the extra build step wasn't worth it for a project this size).
- **Database:** MongoDB + Mongoose. Chosen over Postgres because the config shape is a nested, semi-variable document (options carry *different* pricing fields depending on which question they belong to — `rate_per_sqft` on material, `multiplier` on pitch/stories, `tear_off_per_sqft` on layers). Modeling that in a relational schema would mean either a sparse table with a lot of nullable columns or an EAV pattern, both worse than just storing the document as it naturally is.
- **Auth:** JWT, not the raw Basic Auth from the brief's code snippet. See "Deviation from the brief" below.

## Deviation from the brief: JWT instead of Basic Auth

The brief's example middleware checks `Authorization: Basic ...` on every single request, with credentials re-sent in the header each time. That works, but it means the browser is holding onto and resending a raw username/password on every admin API call, and there's no way to invalidate a session short of changing the password. Swapping in a JWT (signed with `JWT_SECRET`, 12h expiry, returned from `POST /api/auth/login`) costs about 15 extra lines and gets a real login screen, an expiring session, and a token that can be revoked by rotating the secret — for the same "one shared admin account" scope the brief asks for. This isn't scope creep — it's the same feature, implemented in a way that isn't handing a password to `fetch` on every click.

## The pricing formula, in plain language

For a given roof:
1. **Base material cost** = roof area × the selected material's rate per sq ft, bumped up by the waste factor (materials are always over-ordered a bit to cover cuts and mistakes).
2. **Tear-off cost** = roof area × the selected "layers" option's tear-off rate (removing old roofing costs more per layer).
3. Add those two together, then multiply by the pitch multiplier (steeper roofs are slower and riskier to work) and the stories multiplier (more stories = more staging/safety overhead).
4. Add the flat permit fee.
5. That total is the *mid-point* estimate. The customer-facing range is that mid-point minus/plus the spread percentage (12% by default) — low and high.

This lives entirely in `server/src/services/calculator.js` as a pure function with no DB or HTTP dependency, so it's testable on its own and there's no path by which a browser can run or tamper with it.

## Config versioning and the "no redeploy, no breaking a live user" requirement

Every save from the owner panel does **not** edit the live config document in place. Instead:
- The current active config is fetched.
- A brand-new `Config` document is created with `config_version + 1` and `is_active: true`.
- The old document is flipped to `is_active: false`.

The reasoning: if a homeowner has `GET /api/config`'s response sitting in their browser mid-flow and Dale saves a rate change at that exact moment, the homeowner's eventual `POST /api/estimate` would otherwise be silently recalculated against rates they never saw. Versioning means: 1) that specific problem doesn't fully disappear (a fresh page load always gets the newest active config, and the *calculation* still runs server-side against whatever is active at submit time — the estimate a user sees at the end of the wizard, before submission, is only a preview based on breakdown data returned on the same request), but more importantly 2) every historical Lead permanently records which `config_version` produced its number, so "why did this quote say $21,000" is always answerable, and Dale editing a rate can never retroactively change a number a customer already saw and was quoted.

## Seed data oddities and how they were handled

- **`pitch.medium.multiplier` was the string `"1.12"`**, while every other multiplier in the file was a number. Normalized to `1.12` (Number) in the seed script, with a comment marking it as the one deliberate edit to otherwise-verbatim seed data. `calculator.js` also defensively `Number()`-casts every rate field it reads, so a stray string wouldn't have silently produced `NaN` math even without the fix — but the seed itself is fixed rather than relying only on that safety net.
- **`ld_0917` (Bill Tanner) references `config_version: 1`**, a config version that doesn't exist as a document (we only seed v3), and its `answers` object has a completely different shape: `chimney_count`, `gutter_replace`, and a `material` value (`slate_natural`) that isn't in the current v3 material list. This is handled by *not* trying to normalize it. `Lead.answers` is `Schema.Types.Mixed` specifically so historical leads are stored exactly as they were captured, independent of what today's active question set looks like. The admin leads table renders whatever keys exist in `answers` generically (`Object.entries(...)`) rather than assuming the current five question keys — so Bill Tanner's lead displays correctly with its own field names instead of showing blanks for `material`/`pitch`/etc.
- **Historical `estimate_low`/`estimate_high` in the seed leads don't match what this calculator would produce** for the same inputs (confirmed by running the calculator against Ana Ruiz's and Priya Nair's answers — the new numbers are lower). This is expected and stated in the brief: the historical figures are the client's old system's output, not a target to reverse-engineer. The seed script stores them as-is because they're a historical record, not a live recalculation.

## What was left out of scope, and why

- **Multiple owner accounts / role permissions.** The brief specifies one shared owner+bookkeeper login. Building a full user model with per-user roles for a two-person team would be solving a problem nobody described.
- **Multi-tenancy.** This is one business (Northline). A multi-tenant version would need a `business_id` on every document and scoped queries everywhere — real work, not needed here.
- **Config edit history / rollback UI.** Old config versions are preserved (never deleted), so the data needed for a "revert to a previous version" feature exists, but no UI was built for it — Dale asked for "edit rates," not "audit and roll back rates."
- **Email/SMS notification to Dale when a lead comes in.** The brief describes leads being viewable in the panel, not a real-time alert system. Would be a reasonable v2.
- **Question reordering UI, adding/removing questions entirely.** The owner can edit labels/rates/toggle active, per the brief. Reordering and adding brand-new question types would need a more complex form builder than "edit rates and turn a question on or off" calls for.
- **Rate limiting / bot protection on the public endpoints.** `POST /api/estimate` has no throttling. Fine for a review submission; not fine for production with real traffic — flagged below.

3. Is a single shared owner/bookkeeper login acceptable long-term, or does Marcus need his own account with fewer permissions than Dale (e.g., can view leads but not change rates)?
4. What's the expected traffic volume on the public estimator? The current build has no rate limiting on `/api/estimate` — fine for a demo, not fine if a bot could hammer it and fill the leads table with garbage.
5. Does "range spread" (12%) need to vary per material or region, or is one global spread percentage fine indefinitely?
