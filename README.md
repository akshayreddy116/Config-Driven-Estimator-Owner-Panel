# Configuration-Driven Roofing Estimator

A full-stack roofing estimator where the questions, labels, options, pricing rates, and calculation settings are stored in MongoDB instead of being hardcoded in the React frontend.

The application has two main parts:

- *Public Estimator* — Customers answer a series of questions and receive an estimated roofing cost range.
- *Owner Panel* — An authenticated owner can edit questions, labels, options, rates, and active/inactive settings and can also view captured customer leads.

Changes made through the owner panel are stored in MongoDB and are reflected in the public estimator without requiring changes to the frontend code or a redeployment.
Customers can:

- View dynamically loaded questions
- Enter their roofing information
- Select materials and other options
- Submit their contact information
- Receive an estimated project cost range

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

```
---

## Public Estimator

Local:

text
http://localhost:5173/


Production:

text
https://config-driven-estimator-ow-git-af08cf-akshays-projects-207531dc.vercel.app/


Customers can:

- View dynamically loaded questions
- Enter their roofing information
- Select materials and other options
- Submit their contact information
- Receive an estimated project cost range

---

## Owner Panel

Local:

text
http://localhost:5173/admin


Production:

text
https://config-driven-estimator-ow-git-af08cf-akshays-projects-207531dc.vercel.app/admin
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

The owner can:

- Log in
- View estimator configuration
- Edit question labels
- Edit options
- Edit pricing rates
- Change validation values
- Enable or disable questions
- Save configuration changes
- View captured customer leads

---

# Admin Authentication

The owner panel uses *JWT authentication*.

After successful login:

1. The backend creates a JWT.
2. The frontend stores the token in browser localStorage.
3. The token is stored under:

text
roof_estimator_owner_token


4. Axios automatically sends the token with protected API requests.

The request contains:

http
Authorization: Bearer <JWT>


The backend verifies the JWT before allowing access to protected owner routes.

### Local Development Credentials

text
Username: admin
Password: roofing2026!


These values come from the server .env file.

*Change these credentials before using the application in a real production environment.*

---

# How the Application Works

## Public Estimator Flow

text
Customer
   ↓
React Estimator
   ↓
GET /api/config
   ↓
Express API
   ↓
MongoDB
   ↓
Questions + Options + Rates
   ↓
Customer answers questions
   ↓
Contact information submitted
   ↓
POST /api/estimate
   ↓
Backend validates answers
   ↓
Pricing calculator
   ↓
Estimate range generated
   ↓
Lead saved in MongoDB
   ↓
Estimate returned to customer


---

## Owner Panel Flow

text
Owner
   ↓
/admin
   ↓
Login
   ↓
POST /api/auth/login
   ↓
JWT generated
   ↓
JWT stored in browser
   ↓
Protected admin requests
   ↓
Authorization: Bearer <JWT>
   ↓
Backend verifies JWT
   ↓
Admin configuration / Leads
   ↓
MongoDB


---

# Main API Endpoints

## Public Endpoints

### Get Estimator Configuration

http
GET /api/config


Returns the active configuration used by the public estimator.

---

### Submit Estimate

http
POST /api/estimate


Receives customer answers and contact information and returns the calculated estimate.

---

## Authentication

### Owner Login

http
POST /api/auth/login


Authenticates the owner and returns a JWT.

---

## Protected Admin Endpoints

### Get Configuration

http
GET /api/admin/config


Requires a valid JWT.

---

### Update Configuration

http
PUT /api/admin/config


Requires a valid JWT.

---

### Get Captured Leads

http
GET /api/admin/leads


Requires a valid JWT.

---

# Configuration-Driven Design

One of the main requirements of the project is that the estimator should be *configuration-driven*.

The React frontend does not contain individual roofing questions, material prices, or calculation rates as hardcoded application logic.

Instead, the configuration is stored in MongoDB.

For example, the database configuration contains questions such as:

text
Roughly how big is your roof?
What material do you want?
How steep is the roof?
How many layers of old roofing are on there now?
How many stories is the house?


It also contains pricing information such as:

text
Asphalt shingle - 3-tab
Asphalt shingle - architectural
Standing seam metal
Cedar shake


along with their respective rates.

The frontend retrieves this configuration through:

http
GET /api/config


The QuestionField component then renders the question dynamically based on the question's type.

This allows the owner to modify the estimator configuration without changing the React source code.

---

# Estimate Calculation

The backend performs the estimate calculation based on the configuration and customer answers.

The calculation uses information such as:

- Roof area
- Selected roofing material
- Roof pitch
- Existing roofing layers
- Number of stories
- Waste factor
- Permit fee
- Estimate range spread

The pricing logic is kept on the backend rather than trusting calculations performed by the browser.

This allows the backend to validate the answers and calculate the final estimate consistently.

---

# Leads

A lead represents a customer who has submitted the estimator.

A lead contains information such as:

text
Name
Phone
Email
Configuration version
Answers
Low estimate
High estimate
Captured date


The owner can view these leads through:

text
/admin


under the *Leads* section.

---

# Testing the No-Redeployment Requirement

The configuration-driven behavior can be verified manually.

## Test 1 — Change a Pricing Rate

1. Open the Owner Panel.
2. Log in.
3. Open *Rates & Questions*.
4. Change a material rate.
5. Click *Save Changes*.
6. Open the public estimator.
7. Complete the estimator using that material.
8. Verify that the new rate affects the estimate.

No frontend code change or redeployment should be required.

---

## Test 2 — Disable a Question

1. Open the Owner Panel.
2. Go to *Rates & Questions*.
3. Disable a question.
4. Save the configuration.
5. Reload the public estimator.
6. Verify that the disabled question no longer appears.

---

## Test 3 — Change a Question Label

1. Open the Owner Panel.
2. Change a question label.
3. Save the configuration.
4. Reload the public estimator.
5. Verify that the updated label is displayed.

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

