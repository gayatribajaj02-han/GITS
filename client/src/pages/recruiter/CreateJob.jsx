import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, DollarSign, MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { createJobPosting } from '../../services/jobService';
import Button from '../../components/common/Button';

export default function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requiredSkills: '',
    location: 'Bengaluru',
    workMode: 'On-site',
    jobType: 'Full Time',
    salary: '₹8 - 12 LPA',
    minCGPA: 7.5,
    eligibleDepartments: 'Information Technology, Computer Engineering',
    openings: 3,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const skillsArray = formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const respArray = formData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean);
      const deptArray = formData.eligibleDepartments.split(',').map((d) => d.trim()).filter(Boolean);

      const jobData = {
        ...formData,
        requiredSkills: skillsArray,
        responsibilities: respArray,
        eligibleDepartments: deptArray,
        minCGPA: parseFloat(formData.minCGPA),
        openings: parseInt(formData.openings),
      };

      const res = await createJobPosting(jobData);
      if (res.success) {
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to create job posting');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-700/60 pb-4">
        <h1 className="text-3xl font-extrabold text-white">Post a Placement Opportunity</h1>
        <p className="text-slate-400 text-sm mt-1">Specify required technical skills and eligibility criteria for candidates.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 text-rose-300 rounded-2xl text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-slate-800/80 rounded-3xl border border-slate-700/60 p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
              <input
                type="text"
                required
                placeholder="Software Engineer Intern"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Salary / Stipend</label>
              <input
                type="text"
                required
                placeholder="₹35,000 / month or ₹10 LPA"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Work Mode</label>
              <select
                value={formData.workMode}
                onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Job Type</label>
              <select
                value={formData.jobType}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              >
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="Part Time">Part Time</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Required Technical Skills (Comma Separated)
            </label>
            <input
              type="text"
              required
              placeholder="JavaScript, React, Node.js, MongoDB, Docker"
              value={formData.requiredSkills}
              onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm font-semibold text-blue-400 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Minimum CGPA Requirement</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.minCGPA}
                onChange={(e) => setFormData({ ...formData, minCGPA: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Openings</label>
              <input
                type="number"
                min="1"
                required
                value={formData.openings}
                onChange={(e) => setFormData({ ...formData, openings: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Application Deadline</label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Job Description</label>
            <textarea
              rows={4}
              required
              placeholder="Detailed job summary and project responsibilities..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <Button type="submit" isLoading={loading} variant="primary" icon={Plus} className="w-full py-3">
            Publish Job Opening
          </Button>
        </form>
      </div>
    </div>
  );
}
