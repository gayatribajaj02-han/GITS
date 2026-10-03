import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const expiredMsg = searchParams.get('expired') ? 'Your session expired. Please log in again.' : '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(formData);
      if (res.success) {
        const userRole = res.data.user.role;
        if (userRole === 'student') navigate('/student/dashboard');
        else if (userRole === 'recruiter') navigate('/recruiter/dashboard');
        else if (userRole === 'admin') navigate('/admin/dashboard');
        else navigate('/jobs');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (email, role) => {
    setFormData({ email, password: 'password123' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 text-sm">Log in to manage your placement portal activities.</p>
        </div>

        {expiredMsg && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {expiredMsg}
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-md space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <Button type="submit" isLoading={loading} variant="primary" icon={LogIn} className="w-full py-2.5">
              Sign In
            </Button>
          </form>

          {/* Quick Viva Demo Login Buttons */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              ⚡ One-Click Demo Credentials
            </span>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('student@careerconnect.demo', 'student')}
                className="px-2 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors"
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('recruiter@careerconnect.demo', 'recruiter')}
                className="px-2 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-medium transition-colors"
              >
                Recruiter Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('admin@careerconnect.demo', 'admin')}
                className="px-2 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-medium transition-colors"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
