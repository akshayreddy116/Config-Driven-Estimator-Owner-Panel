# Configuration-Driven Roofing Estimator

A full-stack roofing cost estimation application with a customer-facing estimator and an authenticated owner panel.

The application is **configuration-driven**: questions, options, pricing rates, and modifiers are stored in MongoDB instead of being hardcoded in the frontend. The owner can update the configuration from the Owner Panel, and the changes are immediately reflected in the public estimator without redeploying the application.

---
---

## 🚀 Live Application

### Frontend

**Public Estimator:**  
https://config-driven-estimator-owner-panel-three.vercel.app/

**Owner Panel:**  
https://config-driven-estimator-owner-panel-three.vercel.app/admin

### Backend API

**Backend:**  
https://config-driven-estimator-owner-panel-1.onrender.com


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



```
# 💻 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/akshayreddy116/Config-Driven-Estimator-Owner-Panel.git
cd Config-Driven-Estimator-Owner-Panel
```

### 2. Install dependencies

```bash
npm run install:all
```

Or manually:

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Create the `.env` files described above.

### 4. Seed the database

From the `server` directory:

```bash
npm run seed
```

### 5. Start the backend

```bash
npm run dev:server
```

Backend:

```text
http://localhost:4000
```

### 6. Start the frontend

In another terminal:

```bash
npm run dev:client
```

Frontend:

```text
http://localhost:5173
```

---

## 🌐 Local URLs

### Public Estimator

```text
http://localhost:5173/
```

### Owner Panel

```text
http://localhost:5173/admin
```

### Backend

```text
http://localhost:4000
```


## Admin test credentials

```
Username: admin
Password: admin@123
---

## 🧪 Testing

The application was tested for:

- Public estimator workflow
- Dynamic configuration loading
- Estimate calculation
- Owner login
- JWT authentication


## 🚀 Deployment

### Frontend

The React frontend is deployed using Vercel.

**Live URL:**

https://config-driven-estimator-owner-panel-three.vercel.app/

Production API configuration:

```env
VITE_API_URL=https://config-driven-estimator-owner-panel-1.onrender.com/api
```

### Backend

The Express backend is deployed using Render.

**Live URL:**

https://config-driven-estimator-owner-panel-1.onrender.com

Required Render environment variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_password
CLIENT_ORIGIN=https://config-driven-estimator-owner-panel-three.vercel.app
```

---
## Verifying the "no redeploy" requirement yourself

1. Log into `/admin`, open **Rates & Questions**.
2. Change the architectural shingle rate (or any rate) and click **Save Changes**.
3. Open the public estimator in an incognito window and complete a quote using that material — the new rate is reflected immediately, with no server restart.
4. Toggle a question off in the owner panel and save — reload the public estimator; that step is gone from the wizard.
--- 


## 🔒 Security

- Owner APIs are protected using JWT authentication.
- JWT secrets are stored in environment variables.
- Admin credentials are stored in environment variables.
- MongoDB credentials are never exposed to the frontend.
- `.env` files are excluded from Git.
- Unauthorized users cannot access admin configuration or leads.

---



## 🔮 Future Improvements

- Multiple owner accounts
- Role-based access control
- Configuration history and rollback
- Lead export to CSV
- Email notifications for new leads
- Lead analytics dashboard
- Advanced pricing rules
- Improved session management

---

## 👨‍💻 Author

**Akshay Reddy**


deployed API's URL before building.

