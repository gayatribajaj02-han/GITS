# 🚀 CareerConnect – Smart Student Placement & Skill Management Platform

CareerConnect is a modern, enterprise-grade full-stack placement portal built using the MERN stack (MongoDB, Express.js, React, Node.js) and WebSockets. It streamlines the entire university placement ecosystem by bridging students, recruiters, and placement administrators.

---

## 🌟 Key Features

### 🎓 Student Role
- **Auth & Profile**: Secure JWT registration, login, and comprehensive profile creation (CGPA, degree, skills, education, projects, certifications, external links, resume link).
- **Skill Alignment Engine**: Automated skill matching engine calculating compatibility match percentages ($matchScore = \frac{matchedSkills}{requiredSkills} \times 100$), displaying matched and missing skills.
- **Job Discovery**: Advanced search and filtering by job title, skill requirements, location, work mode (Remote/Hybrid/On-site), and job type.
- **Applications Management**: Instant one-click application submission with duplicate prevention, CGPA and department eligibility validation.
- **Real-Time Notifications**: Instant status updates via Socket.IO when recruiters update application states.

### 🏢 Recruiter Role
- **Company Profile**: Manage company information, website, industry, and location.
- **Job Management**: Post, edit, activate, or close placement opportunities with customizable eligibility, min CGPA, required skills, and deadlines.
- **Applicant Review**: Review applicant cards with candidate match scores, filter applicants, view resumes, and update application stages (`Applied` $\rightarrow$ `Under Review` $\rightarrow$ `Shortlisted` $\rightarrow$ `Interview` $\rightarrow$ `Selected`/`Rejected`).

### 👑 Placement Admin Role
- **Control Center**: Overview dashboard showing total platform metrics, active jobs, placement rates, and system stats.
- **User & Company Audit**: Manage and audit student profiles, corporate recruiters, and company accounts.
- **Job Approval Queue**: Approve or reject recruiter job postings before they go live on campus.
- **Visual Analytics**: Interactive charts (powered by Recharts) showing application workflow breakdown, top demanded skills, and department placement ratios.

---

## 🛠️ Tech Stack

| Domain | Technology |
|---|---|
| **Frontend** | React (Vite), Tailwind CSS, React Router v6, Context API, Axios, Lucide React, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose ORM |
| **Auth & Security** | JWT (JSON Web Tokens), Bcrypt.js, Helmet, CORS |
| **Real-time WebSockets** | Socket.IO |
| **DevOps & Containers** | Docker, Docker Compose, GitHub Actions CI/CD |
| **Deployment Targets** | Vercel (Frontend Client) + Render (Backend REST & Socket Server) |

---

## 🔑 Demo Login Credentials

For testing and college viva demonstration, use the pre-seeded accounts below:

| Role | Email Address | Password | Description |
|---|---|---|---|
| **Admin** | `admin@careerconnect.demo` | `password123` | Dr. Rajesh Sharma (Head of Placement) |
| **Recruiter 1** | `recruiter@careerconnect.demo` | `password123` | Ananya Verma (TechCorp Solutions) |
| **Recruiter 2** | `vikram.recruiter@techcorp.demo` | `password123` | Vikram Mehta (CloudWorks Systems) |
| **Student 1** | `student@careerconnect.demo` | `password123` | Gayatri Patel (IT Dept, CGPA 8.8) |
| **Student 2** | `aarav.student@demo.com` | `password123` | Aarav Gupta (CS Dept, CGPA 9.1) |

---

## ⚙️ Quick Start & Running Commands

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally on port `27017` OR Docker Desktop installed.

### 2. Installation & Setup

Clone the repository and install all dependencies:
```bash
# Navigate into the project root
cd careerconnect

# Install backend and frontend dependencies
npm run setup
```

### 3. Database Seeding
Populate MongoDB with demo users, companies, jobs, applications, and notifications:
```bash
npm run seed
```

### 4. Running the Development Application

Run backend server and frontend client in separate terminal windows:

**Terminal 1 (Backend REST & Socket Server):**
```bash
npm run dev:server
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend React Vite App):**
```bash
npm run dev:client
# Frontend starts on http://localhost:5173
```

---

## 🐳 Running with Docker Compose

To launch MongoDB, Node Express server, and Vite React client with a single command:

```bash
docker-compose up --build
```
- Client interface: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- MongoDB: `mongodb://localhost:27017/careerconnect`

---

## 📡 REST API Reference

### Auth Endpoints
- `POST /api/auth/register` - Register a new Student or Recruiter user
- `POST /api/auth/login` - Authenticate user & return JWT token
- `GET /api/auth/me` - Fetch authenticated user details and profile

### Job Endpoints
- `GET /api/jobs` - List jobs with search, filtering, and pagination
- `GET /api/jobs/:id` - Fetch single job details
- `POST /api/jobs` - Create new job (Recruiter)
- `PUT /api/jobs/:id` - Update existing job details
- `DELETE /api/jobs/:id` - Delete job posting

### Student Profile & Applications
- `GET /api/students/profile` - Get logged-in student profile
- `PUT /api/students/profile` - Update student profile, skills, and links
- `POST /api/applications` - Submit application (enforces CGPA & department eligibility)
- `GET /api/applications/my` - Fetch current student applications
- `GET /api/applications/:id` - Fetch application details & match score
- `PATCH /api/applications/:id/status` - Update application status (Recruiter/Admin)

### Admin Endpoints
- `GET /api/admin/analytics` - Fetch platform analytics & chart data
- `GET /api/admin/students` - Audit all student accounts
- `GET /api/admin/recruiters` - Audit corporate recruiters
- `GET /api/admin/jobs` - Manage & approve campus job postings
- `PATCH /api/admin/jobs/:id/status` - Approve or close job posting

---

## 🎓 Viva Practical Mapping

| Practical Concept | Implementation Location |
|---|---|
| **1. Responsive UI** | Tailwind CSS flexbox/grid layout (`client/src/pages/`) |
| **2. React Custom Hooks** | `useAuth()`, `useJobs()`, `useNotifications()` (`client/src/hooks/`) |
| **3. Context State Management** | `AuthContext.jsx`, `JobContext.jsx`, `NotificationContext.jsx` (`client/src/context/`) |
| **4. Database Schema Design** | Mongoose Models (`server/models/`) |
| **5. Middleware & Security** | JWT auth (`auth.js`), RBAC (`checkRole.js`), Bcrypt, Helmet |
| **6. Skill Normalization Engine** | `skillMatcherService.js` (alias lookup & case-insensitive matching) |
| **7. Real-Time WebSockets** | Socket.IO event emission (`socketManager.js` & `socket.js`) |
| **8. Visual Data Analytics** | Recharts charts in `AdminAnalytics.jsx` |
| **9. DevOps Containerization** | Dockerfiles & `docker-compose.yml` |
| **10. Continuous Integration** | GitHub Actions `.github/workflows/ci.yml` |

---

## 📜 License
Licensed under the [MIT License](LICENSE). Built for academic presentation and production deployment.
