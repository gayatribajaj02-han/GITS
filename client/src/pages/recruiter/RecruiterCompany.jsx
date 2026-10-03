import React, { useState, useEffect } from 'react';
import { Building2, Save, CheckCircle2 } from 'lucide-react';
import { fetchCompanyProfile, updateCompanyProfileApi } from '../../services/recruiterService';
import Button from '../../components/common/Button';

export default function RecruiterCompany() {
  const [company, setCompany] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    website: '',
    logo: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadCompany = async () => {
      setLoading(true);
      try {
        const res = await fetchCompanyProfile();
        if (res.success) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await updateCompanyProfileApi(company);
      if (res.success) {
        setCompany(res.data);
        setMessage('Company profile updated successfully!');
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-400">Loading company profile...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-700/60 pb-4">
        <h1 className="text-2xl font-extrabold text-white">Company Profile Management</h1>
        <p className="text-xs text-slate-400">Update company branding, description, and headquarters location.</p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 rounded-2xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      <div className="bg-slate-800/80 rounded-3xl border border-slate-700/60 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button type="submit" isLoading={saving} variant="primary" icon={Save}>
            Save Company Profile
          </Button>
        </form>
      </div>
    </div>
  );
}
