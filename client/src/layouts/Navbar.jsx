import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Briefcase,
  User,
  Bell,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Building2,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import Button from '../components/common/Button';

export default function Navbar() {
  const { user, isAuthenticated, logout, role } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (role === 'student') return '/student/dashboard';
    if (role === 'recruiter') return '/recruiter/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/jobs';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Career<span className="text-blue-600">Connect</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded-md ring-1 ring-blue-600/20">
                Placement Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              to="/jobs"
              className={`transition-colors ${
                isActive('/jobs') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Explore Jobs
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to={getDashboardPath()}
                  className={`flex items-center gap-1.5 transition-colors ${
                    location.pathname.includes('/dashboard')
                      ? 'text-blue-600 font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>

                {role === 'student' && (
                  <>
                    <Link
                      to="/student/applications"
                      className={`transition-colors ${
                        isActive('/student/applications')
                          ? 'text-blue-600 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      My Applications
                    </Link>
                    <Link
                      to="/student/profile"
                      className={`transition-colors ${
                        isActive('/student/profile')
                          ? 'text-blue-600 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      My Profile
                    </Link>
                  </>
                )}

                {role === 'recruiter' && (
                  <>
                    <Link
                      to="/recruiter/company"
                      className={`transition-colors ${
                        isActive('/recruiter/company')
                          ? 'text-blue-600 font-bold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Company Profile
                    </Link>
                    <Link
                      to="/recruiter/jobs/create"
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-semibold transition-colors"
                    >
                      + Post Job
                    </Link>
                  </>
                )}

                {role === 'admin' && (
                  <Link
                    to="/admin/analytics"
                    className={`flex items-center gap-1 transition-colors ${
                      isActive('/admin/analytics')
                        ? 'text-blue-600 font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Action Icons & User Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <Link
                  to={role === 'student' ? '/student/notifications' : '#'}
                  className="relative p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <div className="h-6 w-px bg-slate-200"></div>

                {/* User Info & Logout */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 line-clamp-1">{user?.name}</p>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-xs font-bold">
                {unreadCount}
              </span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-medium text-slate-700 hover:text-blue-600"
          >
            Explore Jobs
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-900"
              >
                Dashboard ({role})
              </Link>
              {role === 'student' && (
                <>
                  <Link
                    to="/student/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-slate-700"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/student/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-slate-700"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/student/notifications"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-slate-700"
                  >
                    Notifications ({unreadCount})
                  </Link>
                </>
              )}
              {role === 'recruiter' && (
                <>
                  <Link
                    to="/recruiter/company"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm text-slate-700"
                  >
                    Company Profile
                  </Link>
                  <Link
                    to="/recruiter/jobs/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 text-sm font-bold text-blue-600"
                  >
                    + Post Job Opening
                  </Link>
                </>
              )}
              {role === 'admin' && (
                <Link
                  to="/admin/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-slate-700"
                >
                  Analytics & Reports
                </Link>
              )}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{user?.email}</span>
                <Button variant="danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Log in
                </Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" className="w-full">
                  Register Account
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
