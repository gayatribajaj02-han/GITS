import React, { useState, useEffect } from 'react';
import { Building2, Save, CheckCircle2, User, Lock, Phone, Mail, Shield, AlertCircle } from 'lucide-react';
import { fetchCompanyProfile, updateCompanyProfileApi } from '../../services/recruiterService';
import { updateUserDetailsApi, updatePasswordApi } from '../../services/authService';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';

export default function RecruiterCompany() {
  const { user, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'security' | 'company'

  // Company State
  const [company, setCompany] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    logo: '',
  });

  // Personal Details State (Name, Phone)
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    email: '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingCompany, setSavingCompany] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [companyMessage, setCompanyMessage] = useState({ type: '', text: '' });
  const [detailsMessage, setDetailsMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setUserDetails({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const loadCompany = async () => {
      setLoading(true);
      try {
        const res = await fetchCompanyProfile();
        if (res.success && res.data) {
          setCompany(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadCompany();
  }, []);

  // Update Personal Details (Name, Phone)
  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    setSavingDetails(true);
    setDetailsMessage({ type: '', text: '' });
    try {
      const res = await updateUserDetailsApi({
        name: userDetails.name,
        phone: userDetails.phone,
      });
      if (res.success) {
        setDetailsMessage({ type: 'success', text: 'Personal details (Name & Phone Number) updated successfully!' });
        await refreshProfile();
      }
    } catch (err) {
      setDetailsMessage({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setSavingDetails(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      setSavingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      setSavingPassword(false);
      return;
    }

    try {
      const res = await updatePasswordApi({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.success) {
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setSavingPassword(false);
    }
  };

  // Update Company Profile
  const handleUpdateCompany = async (e) => {
    e.preventDefault();
    setSavingCompany(true);
    setCompanyMessage({ type: '', text: '' });
    try {
      const res = await updateCompanyProfileApi(company);
      if (res.success) {
        setCompany(res.data);
        setCompanyMessage({ type: 'success', text: 'Company profile updated successfully!' });
      }
    } catch (err) {
      setCompanyMessage({ type: 'error', text: err.response?.data?.message || err.message });
    } finally {
      setSavingCompany(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-400">Loading profile and settings...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-700/60 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Recruiter Profile & Settings</h1>
        <p className="text-xs text-slate-400">
          Manage your personal contact info, change account password, and update your company profile.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 space-x-2">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${activeTab === 'details'
              ? 'border-blue-500 text-blue-400 bg-slate-800/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          <User className="w-4 h-4" />
          <span>Basic Details (Phone & Name)</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${activeTab === 'security'
              ? 'border-blue-500 text-blue-400 bg-slate-800/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          <Lock className="w-4 h-4" />
          <span>Change Password</span>
        </button>

        <button
          onClick={() => setActiveTab('company')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 ${activeTab === 'company'
              ? 'border-blue-500 text-blue-400 bg-slate-800/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company Profile</span>
        </button>
      </div>

      {/* TAB 1: BASIC DETAILS (PHONE, NAME, EMAIL) */}
      {activeTab === 'details' && (
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700/60 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-700/60 pb-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Recruiter Personal Contact Details</h2>
              <p className="text-xs text-slate-400">Update your official contact number used for recruitment notifications.</p>
            </div>
          </div>

          {detailsMessage.text && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-center gap-2 font-semibold ${detailsMessage.type === 'success'
                  ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                }`}
            >
              {detailsMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              )}
              <span>{detailsMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateDetails} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number (WhatsApp & Direct)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                    placeholder="e.g. +91 8983398247"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Used by students and candidates to connect with you.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Registered Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  disabled
                  value={userDetails.email}
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-slate-400 font-medium cursor-not-allowed"
                />
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Primary account identifier (Email cannot be altered).
              </span>
            </div>

            <div className="pt-2">
              <Button type="submit" isLoading={savingDetails} variant="primary" icon={Save}>
                Save Basic Details
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: CHANGE PASSWORD */}
      {activeTab === 'security' && (
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700/60 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-700/60 pb-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Account Password & Security</h2>
              <p className="text-xs text-slate-400">Ensure your account is protected with a strong, secure password.</p>
            </div>
          </div>

          {passwordMessage.text && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-center gap-2 font-semibold ${passwordMessage.type === 'success'
                  ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                }`}
            >
              {passwordMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">New Password (Min 6 Characters)</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                placeholder="Enter new strong password"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                placeholder="Re-enter new password"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" isLoading={savingPassword} variant="primary" icon={Lock}>
                Update Password
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: COMPANY PROFILE */}
      {activeTab === 'company' && (
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700/60 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-700/60 pb-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Company Profile Management</h2>
              <p className="text-xs text-slate-400">Update company branding, description, and headquarters location.</p>
            </div>
          </div>

          {companyMessage.text && (
            <div
              className={`p-4 rounded-2xl text-xs flex items-center gap-2 font-semibold ${companyMessage.type === 'success'
                  ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border border-rose-500/40 text-rose-300'
                }`}
            >
              {companyMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              )}
              <span>{companyMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateCompany} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Industry</label>
                <input
                  type="text"
                  required
                  value={company.industry}
                  onChange={(e) => setCompany({ ...company, industry: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Headquarters Location</label>
                <input
                  type="text"
                  required
                  value={company.location}
                  onChange={(e) => setCompany({ ...company, location: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Website URL</label>
                <input
                  type="text"
                  value={company.website || ''}
                  onChange={(e) => setCompany({ ...company, website: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Company Overview / Description</label>
              <textarea
                rows={4}
                required
                value={company.description}
                onChange={(e) => setCompany({ ...company, description: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" isLoading={savingCompany} variant="primary" icon={Save}>
                Save Company Profile
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
