# 🚀 CareerConnect – Smart Student Placement & Skill Management Platform

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-Passing-2088FF?logo=github-actions&logoColor=white)](https://github.com/features/actions)

> **CareerConnect** is a full-stack, enterprise-grade Campus Placement and Skill Management SaaS platform built using the MERN stack. It empowers universities and colleges to streamline recruitment drives, match student capabilities with corporate job requirements using an intelligent algorithm, and deliver real-time notifications across WebSockets, Email, and WhatsApp.

---

## 📑 Table of Contents
- [✨ Key Features](#-key-features)
- [🏗️ System Architecture](#️-system-architecture)
- [🧪 Full-Stack Lab Practical Mapping (Practicals 1–10)](#-full-stack-lab-practical-mapping-practicals-110)
- [🛠️ Tech Stack](#️-tech-stack)
- [⚡ Quick Start & Installation](#-quick-start--installation)
- [🔑 Demo Login Credentials](#-demo-login-credentials)
- [📡 REST API Documentation](#-rest-api-documentation)
- [🐳 DevOps, CI/CD & Deployment](#-devops-cicd--deployment)
- [🔒 Security Implementations](#-security-implementations)
- [👥 Authors & Acknowledgments](#-authors--acknowledgments)

---

## ✨ Key Features

### 🎓 1. Student Portal
* **Placement Profile:** Create comprehensive placement profiles with CGPA, degree, department, technical skills array, projects, certifications, and resume links.
* **Intelligent Skill Matcher:** Automated backend matching engine comparing student skills against job criteria ($MatchScore = \frac{MatchedSkills}{RequiredSkills} \times 100$), highlighting matched and missing skills.
* **Opportunity Discovery:** Filter jobs by salary, location, job type (Full Time/Internship), work mode (Remote/Hybrid/Onsite), and minimum CGPA eligibility.
* **One-Click Application:** Apply with duplicate application prevention and deadline validation.
* **Application Tracker:** Visual recruitment pipeline: `Applied` $\rightarrow$ `Under Review` $\rightarrow$ `Shortlisted` $\rightarrow$ `Interview` $\rightarrow$ `Selected / Rejected`.
* **Multi-Channel Alerts:** Real-time in-app WebSocket notifications, automated HTML offer letters via Nodemailer, and WhatsApp alerts (`wa.me`).

### 🏢 2. Corporate Recruiter Portal
* **Company Profile:** Corporate branding with logo, website, industry, and office headquarters.
* **Job Posting & Management:** Post technical job openings with customized CGPA cutoffs, required skill tags, and application deadlines.
* **Applicant Review Dashboard:** Sort candidates by skill match percentage, inspect resumes, and manage interview pipelines.
* **Live Status Dispatcher:** Updating applicant status automatically triggers multi-channel alerts (WebSockets + Email + WhatsApp) to the student.

### 👑 3. University Placement Admin Portal
* **Executive Placement Dashboard:** Overview of total students, registered recruiters, active job openings, and overall placement percentages.
* **Verification & Audit:** Approve or reject job postings and manage student accounts.
* **Analytics & Reports:** Visual charts powered by Recharts tracking student skills distribution and application trends.

---

## 🏗️ System Architecture

```text
[ Browser / Client ] ──(React 18 + Vite + Tailwind CSS + Context API)
        │
        ├── HTTP / REST APIs ──► [ Express.js Backend Server (Port 5000) ]
        │                                  │
        │                                  ├── Mongoose ORM ──► [ MongoDB Database ]
        │                                  │                     (Users, Jobs, Profiles,
        │                                  │                      Applications, Notifications)
        │                                  ├── Skill Matcher Engine (skillMatcherService.js)
        │                                  ├── Email Dispatcher (Nodemailer)
        │                                  └── WhatsApp Webhooks / wa.me Service
        │
        └── WebSockets (Socket.IO) ◄───────┘ (Bi-directional Real-Time Notifications)
```

---

## 🧪 Full-Stack Lab Practical Mapping (Practicals 1–10)

This repository serves as a reference implementation for university **Full-Stack Development Laboratory** curriculums:

| Exp # | Academic Practical Title | Implementation in CareerConnect |
|:---:|---|---|
| **1** | Build responsive & interactive UIs using Tailwind CSS | Mobile-first grid (`grid-cols-1 lg:grid-cols-4`), hover micro-interactions, dynamic state badges (`JobCard.jsx`, `JobsList.jsx`). |
| **2** | React Hooks (`useState`, `useEffect`, `useContext`, custom hooks) | Component state, async side-effects, real-time socket subscriptions, custom hooks (`useAuth`, `useJobs`, `useNotifications`). |
| **3** | Manage complex state with Context API / Redux | Modular Context architecture (`AuthContext`, `JobContext`, `NotificationContext`) avoiding prop-drilling. |
| **4** | REST API Design with MongoDB + Mongoose Integration | 6 normalized Mongoose models (`User`, `Job`, `StudentProfile`, etc.), `.populate()` relational joins, and automated skill matching. |
| **5** | Create secure, production-ready RESTful APIs | Helmet security headers, CORS origin controls, `express-validator` request sanitization, and centralized error handling. |
| **6** | Implement authentication and user roles with JWT | Salted Bcrypt password hashing, stateless JWT Bearer token issuance, and Role-Based Access Control (`student`, `recruiter`, `admin`). |
| **7** | Validating RESTful APIs using Postman | Complete REST collection testing status codes (`200`, `201`, `400`, `401`, `403`, `409`), headers, and negative edge cases. |
| **8** | Enable real-time communication via WebSockets | Socket.IO bi-directional rooms (`user_<id>`), live unread badges, + **Enhanced Email & WhatsApp notifications**. |
| **9** | CI/CD Deployment with GitHub Actions + Render/Vercel | Automated GitHub Actions CI workflow (`ci.yml`), Vercel SPA rewrites (`vercel.json`), and Render backend blueprints (`render.yaml`). |
| **10** | Deploy full-stack apps using DevOps tools & Docker | Multi-stage Nginx/React Dockerfile, Node Alpine Dockerfile, and multi-container orchestration (`docker-compose.yml`). |

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS + PostCSS
- **Routing:** React Router v6
- **Icons:** Lucide React
- **HTTP Client:** Axios with JWT request/response interceptors
- **State Management:** React Context API + Custom Hooks
- **Data Visualization:** Recharts

### Backend
- **Runtime:** Node.js (v18+)
- **Server Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & Bcrypt.js
- **Real-Time Engine:** Socket.IO
- **Email Delivery:** Nodemailer
- **Security:** Helmet, CORS, Express-Validator

### DevOps & Cloud
- **Containerization:** Docker & Docker Compose
- **Continuous Integration:** GitHub Actions Runner
- **Frontend Hosting:** Vercel (Edge CDN)
- **Backend Hosting:** Render Web Services

---

## ⚡ Quick Start & Installation

### Prerequisites
- [Node.js (v18 or higher)](https://nodejs.org/)
- [MongoDB (running locally on port 27017 or MongoDB Atlas connection string)](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/gayatribajaj02-han/GITS.git
cd GITS
```

### 2. Install Dependencies
```bash
# Install root, client, and server dependencies
npm run setup
```

### 3. Configure Environment Variables
Create `.env` inside `server/` (or copy `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/careerconnect
JWT_SECRET=careerconnect_super_secret_jwt_key_2026_change_in_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Seed Database with Realistic Demo Data
```bash
npm run seed
```

### 5. Launch Development Servers
Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
npm run dev:server
# Server running at http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
# Client running at http://localhost:5173
```

---

## 🔑 Demo Login Credentials

You can use the **One-Click Demo Credentials** on the login page or enter:

| Role | Email | Password | Permissions |
|---|---|---|---|
| 🎓 **Student** | `student@careerconnect.demo` | `password123` | Browse jobs, view match score %, apply, receive alerts |
| 🏢 **Recruiter** | `recruiter@careerconnect.demo` | `password123` | Post jobs, evaluate candidate skills, update status |
| 👑 **Admin** | `admin@careerconnect.demo` | `password123` | Platform dashboard, user management, audit logs |

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user (student/recruiter)
- `POST /api/auth/login` - Authenticate user & issue JWT token
- `GET /api/auth/me` - Fetch authenticated user session & profile

### Placement Opportunities (`/api/jobs`)
- `GET /api/jobs` - Browse active jobs with search, filtering, and skill matching
- `GET /api/jobs/:id` - Fetch detailed job posting with requirements
- `POST /api/jobs` - Post new job opportunity (Recruiter/Admin)
- `PUT /api/jobs/:id` - Update existing job details
- `DELETE /api/jobs/:id` - Delete job posting & associated applications
- `POST /api/jobs/sync-market-jobs` - Sync real-time developer jobs from market feeds

### Applications (`/api/applications`)
- `POST /api/applications` - Submit application (with eligibility & duplicate checks)
- `GET /api/applications/my` - Fetch logged-in student's application history
- `PATCH /api/applications/:id/status` - Update status & dispatch Email/WhatsApp notifications

### Notifications (`/api/notifications`)
- `GET /api/notifications` - Fetch user's notification list & unread count
- `PATCH /api/notifications/read-all` - Mark all notifications as read
- `GET /api/notifications/preview-email/:id` - View rendered HTML placement offer letter
- `POST /api/notifications/send-test-alert` - Live multi-channel test alert dispatcher

---

## 🐳 DevOps, CI/CD & Deployment

### 🐳 Run with Docker Compose (Single Command)
Ensure Docker Desktop is running, then execute:
```bash
docker-compose up --build
```
* **Frontend:** `http://localhost:5173`
* **Backend:** `http://localhost:5000`
* **MongoDB:** `localhost:27017`

### 🔄 GitHub Actions CI/CD Pipeline
The workflow in `.github/workflows/ci.yml` triggers on every push and pull request to `main`:
1. Launches an ephemeral Ubuntu runner container.
2. Boots up a live MongoDB 7.0 container.
3. Tests server routes and validates environment settings.
4. Compiles the Vite React production bundle (`npm run build`).

---

## 🔒 Security Implementations

* **Password Hashing:** Salted Bcrypt (`bcryptjs`) executed in Mongoose `pre('save')` hooks.
* **Stateless JWT Authorization:** Tokens signed with `HS256` secret keys and validated via `auth.js` middleware.
* **Role-Based Access Control (RBAC):** Strict endpoint isolation enforced via `checkRole.js`.
* **API Hardening:** HTTP security headers applied via `helmet()` and CORS policy enforcement.
* **Data Sanitization:** Strict input payload validation using `express-validator`.

---

## 👥 Authors & Acknowledgments

* **Developer:** [Gayatri Bajaj](https://github.com/gayatribajaj02-han)
* **Project Repository:** [https://github.com/gayatribajaj02-han/GITS](https://github.com/gayatribajaj02-han/GITS)
* Built for university **Full-Stack Development Lab & Project Evaluation**.

---
⭐ *If you find this project helpful, feel free to star the repository!*
