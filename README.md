# 🌍 WanderAI — AI Powered Travel Planner

 AI travel planner app with trip generation, chatbot, admin dashboard, authentication and more.

---

## 📁 Project Structure

```
WanderAI/
├── client/                        # React Frontend (Vite + Tailwind)
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Admin.jsx          # Admin dashboard (users, trips, contacts, charts)
│   │   │   ├── Chatbot.jsx        # AI travel chatbot
│   │   │   ├── Contact.jsx        # Contact form
│   │   │   ├── Destinations.jsx   # Popular destinations grid
│   │   │   ├── Home.jsx           # AI trip generator
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Signup.jsx         # Signup page
│   │   │   └── Trips.jsx          # User's saved trips
│   │   ├── App.jsx                # Main router + navbar
│   │   ├── api.js                 # Axios instance with JWT interceptor
│   │   ├── index.css              # Tailwind CSS
│   │   └── main.jsx               # React entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
└── server/                        # Node.js + Express Backend
    ├── models/
    │   ├── User.js                # User schema
    │   ├── Trip.js                # Trip schema
    │   └── Contact.js             # Contact schema
    ├── server.js                  # Main server file
    ├── .env                       # Environment variables (edit this!)
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure these are installed on your computer:

- **Node.js** v18 or higher → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community
- **Git** (optional) → https://git-scm.com
- **OpenRouter API Key** → https://openrouter.ai (free account)

---

## 🚀 Step-by-Step Setup

### STEP 1 — Configure Environment Variables

Open `server/.env` and fill in your values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/wanderai
JWT_SECRET=wanderai_super_secret_jwt_key_2024
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=admin123
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxxxxxxxxxx
PORT=5000
```

> ⚠️ Replace `OPENROUTER_API_KEY` with your real key from https://openrouter.ai
> ⚠️ Change `ADMIN_EMAIL` and `ADMIN_PASSWORD` to something secure before deploying

---

### STEP 2 — Start MongoDB

**Windows:**
```bash
# MongoDB should run as a service automatically after install
# Or start manually:
net start MongoDB
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

---

### STEP 3 — Install & Start the Backend

```bash
cd server
npm install
node server.js
```

You should see:
```
MongoDB Connected
Server running on http://localhost:5000
```

> For auto-restart on file changes use: `npx nodemon server.js`

---

### STEP 4 — Install & Start the Frontend

Open a **new terminal window**:

```bash
cd client
npm install
npm run dev
```

You should see:
```
  VITE v5.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

---

### STEP 5 — Open the App

Visit: **http://localhost:5173**

---

## 👤 User Accounts

### Create a Normal User
1. Go to http://localhost:5173/signup
2. Enter Name, Email, Password
3. Click Signup → redirects to Login
4. Login with those credentials

### Admin Login
Use the credentials from your `.env` file:
- Email: `admin@gmail.com` (or whatever you set)
- Password: `admin123` (or whatever you set)

Admin sees: Dashboard, Charts, All Users, All Trips, All Messages

---

## 🔑 Features

| Feature | Description |
|---------|-------------|
|  JWT Auth | Secure login/signup with token-based auth |
|  AI Trip Generator | Generates full day-wise itineraries using DeepSeek AI |
|  Save Trips | Users can save and view their own trips |
|  AI Chatbot | Travel assistant chatbot powered by AI |
| Destinations | Browse 9 popular Indian destinations |
| Contact Form | Users can send messages to admin |
| Admin Dashboard | Manage users, trips, contacts + live charts |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios |
| Charts | Recharts |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| AI | OpenRouter API (DeepSeek model) |

---
