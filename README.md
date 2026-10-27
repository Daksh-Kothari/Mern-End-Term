# StudyFlow — MERN End Term Project

A full-stack MERN (MongoDB, Express, React, Node.js) platform featuring an SM-2 spaced repetition revision engine, subject & topic tracking, interactive study focus timer, exams countdown, automated goal tracking, academic notes, and real-time retention analytics.

## 🚀 Live Deployment

- **Live URL:** [[https://mern-end-term-lemon.vercel.app]([https://study-flow-orpin-kappa.vercel.app/)](https://mern-end-term-lemon.vercel.app](https://study-flow-orpin-kappa.vercel.app/))
- **Login Portal:** [[https://mern-end-term-lemon.vercel.app/login]](https://study-flow-orpin-kappa.vercel.app/login)([https://mern-end-term-lemon.vercel.app/login](https://study-flow-orpin-kappa.vercel.app/login))

### Quick Demo Access
- **Email:** `student@studyflow.com`
- **Password:** `password123`
*(Or use the 1-click **"Use Demo Student (Alex Rivera)"** button directly on the login screen)*

---

## Features

- **Authentication & Security**: JWT session cookies and Bearer tokens with role-based access. Includes a 1-click Demo Student login button.
- **Academic Dashboard**: High-level focus metrics (Today, Weekly, Monthly minutes), study streak counter, topic mastery progression, and upcoming exams.
- **Diagnostic Weak Topic Engine**: Automatically surfaces topics with struggling recall or approaching exam deadlines that need immediate review.
- **Spaced Repetition Queue (SM-2)**: Categorized into Due Today, Overdue, Next 7 Days, and Recommended. Lets students rate recall quality (`FORGOT`, `HARD`, `GOOD`, `EASY`) to compute optimal intervals and mastery changes.
- **Focus Timer (Stopwatch & Pomodoro)**: Live tracking modal linked to specific subjects and topics, logging duration and reflections directly to the database.
- **Subject & Topic Management**: Curricula organization with difficulty, importance levels, and mastery progress bars.
- **Exam Countdown & Planner**: Schedule midterms and finals with days-remaining indicators and readiness scores.
- **Study Goals**: Automated progress tracking for daily minutes, weekly minutes, topics mastered, and completed revisions.
- **Academic Notes**: Markdown/text repository organized by subjects and topics.
- **Persistent Storage**: Hybrid storage supporting MongoDB and zero-dependency local persistent JSON engine fallback.

## Project Structure

```text
├── client/
│   └── vite-project/   # React 19 + Vite + Tailwind CSS v4 frontend
├── server/             # Express.js backend API & Spaced Repetition Engine
│   ├── config/         # Database and storage configurations
│   ├── controllers/    # Route controllers
│   ├── models/         # Mongoose schemas & data repositories
│   ├── routes/         # REST API endpoints
│   ├── seed/           # Seed script with demo data
│   └── services/       # Spaced repetition, mastery, streak, and goal engines
├── vercel.json         # Vercel multi-service routing configuration
└── .gitignore          # Root Git ignore rules
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or MongoDB Atlas connection URI (optional: embedded storage is supported if MongoDB is offline)

### Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env` (already created with sensible defaults):
   ```bash
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=studyflow_super_secret_jwt_key_2026_academics
   MONGO_URI=mongodb://127.0.0.1:27017/devflow
   ```
4. Seed the database with sample subjects, topics, and sessions:
   ```bash
   npm run seed
   ```
   **Demo Student Credentials:**
   - Email: `student@studyflow.com`
   - Password: `password123`
5. Start the backend server:
   ```bash
   npm run dev # or npm start
   ```

### Client Setup
1. Navigate to the client directory:
   ```bash
   cd client/vite-project
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.
