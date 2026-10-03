import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, Users, Briefcase, CheckCircle2, Eye, Calendar } from 'lucide-react';
import { fetchRecruiterJobs, fetchCompanyProfile } from '../../services/recruiterService';
import Button from '../../components/common/Button';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecruiterData = async () => {
      setLoading(true);
      try {
        const [jobsRes, companyRes] = await Promise.all([
          fetchRecruiterJobs(),
          fetchCompanyProfile(),
        ]);
        if (jobsRes.success) setJobs(jobsRes.data || []);
        if (companyRes.success) setCompany(companyRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadRecruiterData();
  }, []);

  const totalApplicants = jobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0);
  const totalShortlisted = jobs.reduce((acc, j) => acc + (j.shortlistedCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-bold text-2xl">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{company?.name || 'Company Dashboard'}</h1>
            <p className="text-sm text-slate-500">{company?.industry} • {company?.location}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/recruiter/company">
            <Button variant="secondary" size="md">
              Edit Company Profile
            </Button>
          </Link>
          <Link to="/recruiter/jobs/create">
            <Button variant="primary" size="md" icon={Plus}>
              Post New Opening
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Job Postings</span>
          <p className="text-3xl font-black text-slate-900">{jobs.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Candidate Applications</span>
          <p className="text-3xl font-black text-blue-600">{totalApplicants}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shortlisted Candidates</span>
          <p className="text-3xl font-black text-emerald-600">{totalShortlisted}</p>
        </div>
      </div>

      {/* Jobs List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">Your Posted Openings</h3>
          <Link to="/recruiter/jobs/create" className="text-xs font-bold text-blue-600 hover:underline">
            + Post Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No job postings created yet. Click "Post New Opening" to start reviewing candidates.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="pb-3">Job Title</th>
                  <th className="pb-3">Location / Mode</th>
                  <th className="pb-3">Salary</th>
                  <th className="pb-3">Deadline</th>
                  <th className="pb-3">Applicants</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50">
                    <td className="py-3.5 font-bold text-slate-900">{job.title}</td>
                    <td className="py-3.5 text-slate-600">{job.location} ({job.workMode})</td>
                    <td className="py-3.5 text-slate-800 font-semibold">{job.salary}</td>
                    <td className="py-3.5 text-slate-500">{new Date(job.deadline).toLocaleDateString()}</td>
                    <td className="py-3.5 font-extrabold text-blue-600">{job.applicantCount || 0} candidates</td>
                    <td className="py-3.5">
                      <Link to={`/recruiter/jobs/${job._id}/applicants`}>
                        <Button variant="secondary" size="sm" icon={Users}>
                          View Applicants
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
