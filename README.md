# Configuration-driven roofing estimator

 A public multi-step wizard calculates a cost estimate entirely from data stored in MongoDB (no question, label, option, or rate is hardcoded in the frontend), and an authenticated owner panel lets a non-technical user edit those rates/labels/toggles and view captured leads — with changes going live immediately, no redeploy.

**Live URLs:** *Not deployed from the build environment — see `AI_LOG.md` for why. Deploy steps are below.*

## Project structure

```
roof-estimator/
├── server/     Express API + MongoDB (Mongoose)
├── client/     React (Vite) + Tailwind — public estimator at "/", owner panel at "/admin"
├── DECISIONS.md
├── AI_LOG.md
└── README.md
```

## Prerequisites

- Node.js 18+
- A MongoDB instance — either local (`mongod` running on `localhost:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster.

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
Password: roofing2026!
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

