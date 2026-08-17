# AI_LOG.md

## Tools used

- Claude (Anthropic), used directly in an agentic coding environment with file read/write/bash access, for the entire implementation — planning, all server and client code, testing, and this documentation.

## A concrete example of an AI mistake, caught and corrected

**The mistake:** While building `LeadsTable.jsx`, the first draft used React shorthand fragments (`<>...</>`) inside a `.map()` to group a table row with its conditionally-rendered "details" row underneath it:

```jsx
{leads.map((lead) => (
  <>
    <tr key={lead._id}>...</tr>
    {expandedId === lead._id && <tr>...</tr>}
  </>
))}
```

This is invalid — the `key` prop was placed on the `<tr>` inside the fragment instead of on the fragment itself, and shorthand fragments (`<>`) can't take a `key` prop at all in React. In a list render, every top-level element returned from `.map()` needs the key, and the top-level element here is the fragment, not the first `<tr>`. Left as-is, this either throws a warning-turned-error in strict mode or causes list-reconciliation bugs (rows not re-rendering correctly when leads are added/expanded/collapsed), which is exactly the kind of subtle bug that looks fine on first load and only shows up once you interact with the table.

**How it was caught:** Not by a test — by re-reading the component against React's actual fragment/key rules before shipping it, since this project didn't have a JS test runner wired up for React component logic (only the calculator has direct unit tests; see below).

**The fix:** Replaced the shorthand fragment with the named `Fragment` import from React, which does accept a `key`:

```jsx
import { Fragment, useEffect, useState } from "react";
// ...
{leads.map((lead) => (
  <Fragment key={lead._id}>
    <tr>...</tr>
    {expandedId === lead._id && <tr>...</tr>}
  </Fragment>
))}
```

## What was directly tested, not just written

- `server/src/services/calculator.js` (the pricing engine) and `validateAnswers` were run standalone against realistic seed-shaped input — including Ana Ruiz's and Priya Nair's exact answers from the seed leads, plus deliberately broken inputs (missing required fields, an out-of-range `roof_area`, an invalid `material` value) — to confirm both correct math and correct rejection behavior. This is real output, not a description of expected output; the numbers in `DECISIONS.md`'s "seed data oddities" section come from actually running this code.
- Every server `.js` file was syntax-checked with `node --check`.
- The full client was installed and built with `vite build` to catch broken imports/JSX before delivery, and the dev server was smoke-tested with `curl`.
- The client source tree was grepped for every literal rate/label/option value from the seed data (`4.25`, `asphalt_3tab`, `Northline`, etc.) to directly verify the "no hardcoded pricing in the frontend" constraint, rather than just asserting it was followed.

## What was not testable in this environment, and is left for you to verify

- No live MongoDB instance was reachable from the build environment (outbound network was restricted to package registries; `mongodb-memory-server`'s binary download was blocked). The DB layer (models, connection, seed script, and every controller that touches Mongoose) is written and reviewed but has **not** been run against a live database. Run `npm run seed` against your own MongoDB and walk through the checklist in `README.md` before treating this as verified end-to-end.
- No deployment was performed — there is no live URL from this process. You'll need to deploy `server/` and `client/` yourself (Render/Railway/Fly for the API, Vercel/Netlify for the static client are reasonable defaults) and update `CLIENT_ORIGIN`/`VITE_API_URL` accordingly.

## Parts written without AI assistance

None — this is an AI-authored codebase, built end-to-end in this session, per the assignment's disclosure requirement. Every architectural call (JWT vs. Basic Auth, config versioning strategy, how to store `ld_0917`'s mismatched shape) is explained with its reasoning in `DECISIONS.md` so it can be evaluated on those merits rather than taken on faith.
