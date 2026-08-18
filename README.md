# Configuration-Driven Roofing Estimator

A full-stack roofing cost estimation application with a customer-facing estimator and an authenticated owner panel.

The application is **configuration-driven**: questions, options, pricing rates, and modifiers are stored in MongoDB instead of being hardcoded in the frontend. The owner can update the configuration from the Owner Panel, and the changes are immediately reflected in the public estimator without redeploying the application.

---

## Features

### Public Estimator

- Multi-step roofing estimation wizard
- Dynamic questions and options loaded from MongoDB
- Roofing cost calculation based on customer answers
- Estimated price range displayed to the customer
- Customer lead capture
- Responsive interface

### Owner Panel

- Owner login with JWT authentication
- Edit pricing rates
- Edit customer questions and labels
- Edit question options
- Enable or disable questions
- Update pricing modifiers
- View submitted customer leads
- Configuration changes are reflected without redeployment

---

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS
- **API Communication:** Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT
- **Frontend Deployment:** Vercel
- **Backend Deployment:** Render

---

## System Architecture

```text
                         ┌──────────────────────┐
                         │      Customer        │
                         │                      │
                         │  Public Estimator    │
                         └──────────┬───────────┘
                                    │
                                    │ HTTP / Axios
                                    ▼
                         ┌──────────────────────┐
                         │    React Frontend    │
                         │      (Vercel)        │
                         │                      │
                         │  /        Estimator  │
                         │  /admin   Owner Panel│
                         └──────────┬───────────┘
                                    │
                                    │ REST API
                                    ▼
                         ┌──────────────────────┐
                         │   Express Backend   │
                         │       (Render)       │
                         │                      │
                         │  Config API          │
                         │  Estimate API        │
                         │  Auth API             │
                         │  Admin API            │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     │                             │
                     ▼                             ▼
             ┌───────────────┐             ┌───────────────┐
             │   JWT Auth    │             │    MongoDB    │
             │               │             │               │
             │ Owner Login   │             │ Config        │
             │ Protected API │             │ Leads         │
             └───────────────┘             └───────────────┘

## Running locally from a clean clone

**1. Install dependencies for both apps:**

```bash
npm run install:all
```

(or manually: `cd server && npm install`, then `cd ../client && npm install`)

**2. Configure the server:**

```bash
cd server

```

Edit `.env`:

| Variable | Description |
|---|---|
| `MONGODB_URI` | Your MongoDB connection string, e.g. `mongodb://127.0.0.1:27017/roof-estimator` |
| `PORT` | API port (default `4000`) |
| `CLIENT_ORIGIN` | Where the frontend runs, for CORS (default `http://localhost:5173`) |
| `JWT_SECRET` | Any long random string — signs owner-panel session tokens |
| `ADMIN_USERNAME` | Owner login username (default `admin`) |
| `ADMIN_PASSWORD` | Owner login password (default `roofing2026!`) |

**3. Seed the database** with the provided config (v3) and the three sample leads:

```bash
npm run seed
```

Re-running this wipes and re-seeds — safe to run repeatedly during development, but don't run it against data you want to keep.

**4. Configure the client:**

```bash
cd ../client

```

Edit `.env` if your API isn't on the default port:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API, e.g. `http://localhost:4000/api` |

**5. Run both apps** (from the project root, in two terminals, or use the root scripts):

```bash
npm run dev:server   # http://localhost:4000
npm run dev:client   # http://localhost:5173
```

- Public estimator: `http://localhost:5173/`
- Owner panel: `http://localhost:5173/admin`

## Admin test credentials

```
Username: admin
Password: admin@123
```

(from `server/.env.example` — change these before any real deployment)

## Verifying the "no redeploy" requirement yourself

1. Log into `/admin`, open **Rates & Questions**.
2. Change the architectural shingle rate (or any rate) and click **Save Changes**.
3. Open the public estimator in an incognito window and complete a quote using that material — the new rate is reflected immediately, with no server restart.
4. Toggle a question off in the owner panel and save — reload the public estimator; that step is gone from the wizard.

## Deploying

- **Server:** any Node host that supports environment variables and long-running processes (Render, Railway, Fly.io). Point `MONGODB_URI` at an Atlas cluster; set `CLIENT_ORIGIN` to your deployed frontend's URL.
- **Client:** `npm run build` inside `client/` produces a static `dist/` folder — deploy to Vercel, Netlify, or any static host. Set `VITE_API_URL` to your deployed API's URL before building.

