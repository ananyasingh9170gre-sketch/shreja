# Student Productivity Platform

Full-stack web application for students to manage notes sharing, exam preparation, and placement readiness.

## Tech Stack

- Frontend: React, Tailwind CSS, Axios, Chart.js, Socket.io client
- Backend: Node.js, Express, JWT auth, Multer, Socket.io
- Database: MongoDB (Mongoose)

## Features Implemented

- JWT authentication with role field (`student` / `admin`)
- Notes sharing (upload PDF/DOC/DOCX, list, filter, like, comments, view/download)
- Exam preparation tracker (topics, completion toggle, study logs, exam to-do tasks)
- Placement dashboard (DSA tracker, company prep list, mock interview scheduler, resume upload, resume tips)
- Analytics dashboard (topic progress, weekly study chart, monthly stats, notes usage)
- Notification center (deadline alerts, reminders, note-upload notification + real-time Socket.io push)
- Responsive dashboard UI with sidebar navigation

## Project Structure

- `server/` Express + MongoDB backend (MVC)
- `client/` React + Tailwind frontend

## Setup Instructions

### 1) Start MongoDB

Run MongoDB locally on default URI or update env.

### 2) Backend setup

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Optional sample data:

```bash
npm run seed
```

### 3) Frontend setup

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

## Default URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health: `http://localhost:5000/api/health`

## Demo Credentials (after seed)

- Email: `student@example.com`
- Password: `password123`

## API Summary

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Notes
- `POST /api/notes` (multipart field: `file`)
- `GET /api/notes?search=&subject=`
- `GET /api/notes/:id`
- `GET /api/notes/:id/download`
- `PATCH /api/notes/:id/like`
- `POST /api/notes/:id/comments`

### Tasks (Exam Prep)
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Placement
- `GET /api/placement`
- `PATCH /api/placement/dsa`
- `POST /api/placement/companies`
- `POST /api/placement/interviews`
- `POST /api/placement/resume` (multipart field: `file`)

### Analytics
- `GET /api/analytics`

### Notifications
- `GET /api/notifications`
- `POST /api/notifications`
- `PATCH /api/notifications/:id/read`

## Notes

- Uploaded files are served from `server/src/uploads`.
- Role-based field is present in auth/user model and can be extended with admin-only routes.
- Architecture is ready for adding AI recommendations, chat, leaderboard, or face-auth modules later.
