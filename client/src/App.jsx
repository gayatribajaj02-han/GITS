import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Toast from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import JobsList from './pages/JobsList';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentApplications from './pages/student/StudentApplications';
import StudentNotifications from './pages/student/StudentNotifications';
import ApplicationDetail from './pages/ApplicationDetail';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterCompany from './pages/recruiter/RecruiterCompany';
import MyJobs from './pages/recruiter/MyJobs';
import CreateJob from './pages/recruiter/CreateJob';
import JobApplicants from './pages/recruiter/JobApplicants';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminRecruiters from './pages/admin/AdminRecruiters';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';
import AdminAnalytics from './pages/admin/AdminAnalytics';

function App() {
  return (
    <Router>
      <AuthProvider>
        <JobProvider>
          <NotificationProvider>
            <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-blue-600 selection:text-white">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/jobs" element={<JobsList />} />
                  <Route path="/jobs/:id" element={<JobDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Shared Protected Application Detail */}
                  <Route element={<ProtectedRoute allowedRoles={['student', 'recruiter', 'admin']} />}>
                    <Route path="/applications/:id" element={<ApplicationDetail />} />
                  </Route>

                  {/* Student Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                    <Route path="/student/dashboard" element={<StudentDashboard />} />
                    <Route path="/student/profile" element={<StudentProfile />} />
                    <Route path="/student/applications" element={<StudentApplications />} />
                    <Route path="/student/notifications" element={<StudentNotifications />} />
                  </Route>

                  {/* Recruiter Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
                    <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
                    <Route path="/recruiter/company" element={<RecruiterCompany />} />
                    <Route path="/recruiter/jobs" element={<MyJobs />} />
                    <Route path="/recruiter/jobs/create" element={<CreateJob />} />
                    <Route path="/recruiter/jobs/edit/:id" element={<CreateJob />} />
                    <Route path="/recruiter/jobs/:id/applicants" element={<JobApplicants />} />
                  </Route>

                  {/* Admin Routes */}
                  <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<AdminStudents />} />
                    <Route path="/admin/recruiters" element={<AdminRecruiters />} />
                    <Route path="/admin/jobs" element={<AdminJobs />} />
                    <Route path="/admin/applications" element={<AdminApplications />} />
                    <Route path="/admin/analytics" element={<AdminAnalytics />} />
                  </Route>

                  {/* Fallback Catch-all Route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <Toast />
            </div>
          </NotificationProvider>
        </JobProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
