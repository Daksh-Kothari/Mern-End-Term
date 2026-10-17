# MERN End Term Project

A full-stack MERN (MongoDB, Express, React, Node.js) application featuring authentication, subject & topic tracking, study sessions, revisions, exams, goals, notes, and analytics.

## Project Structure

```text
├── client/
│   └── vite-project/   # React + Vite frontend
├── server/             # Express.js backend API
└── .gitignore          # Root Git ignore rules
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or MongoDB Atlas connection URI

### Server Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your configuration:
   ```bash
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_secret_key
   MONGO_URI=mongodb://127.0.0.1:27017/devflow
   ```
4. Start the backend server:
   ```bash
   npm run dev # or node index.js
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
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
