# AI_LOG.md

## Tools used

- Claude, chatgpt used directly in an agentic coding environment with file read/write/bash access, for the entire implementation — planning, all server and client code, testing, and this documentation.

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

- The main features were tested locally to make sure they worked as expected. I tested the roofing estimator with different inputs, including valid and invalid values, checked the form validation, tested the API requests and responses, verified the admin login and protected routes, and tested the configuration and lead-management features. I also built and ran the frontend to check for errors and verified that the application worked correctly across different screen sizes.


## Parts written without AI assistance

Some parts of the project were completed without direct AI assistance, including setting up the project structure, configuring the MongoDB connection and environment variables, setting up the GitHub repository and deployment configuration, testing the application locally, connecting the frontend with the backend APIs, and making UI and responsive design changes based on the project requirements. I also reviewed, modified, and debugged the AI-generated code to make sure it worked correctly with my project.
