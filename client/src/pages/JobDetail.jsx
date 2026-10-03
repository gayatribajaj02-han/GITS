import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowLeft,
  Send,
  Users,
} from 'lucide-react';
import { fetchJobById } from '../services/jobService';
import { applyToJobApi } from '../services/applicationService';
import { useAuth } from '../hooks/useAuth';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ApplicationProgress from '../components/dashboard/ApplicationProgress';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, role } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  const loadJobDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchJobById(id);
      if (res.success) {
        setJob(res.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setApplying(true);
    setApplyError('');
    try {
      const res = await applyToJobApi(job._id);
      if (res.success) {
        setApplySuccess(true);
        await loadJobDetails();
      }
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3"></div>
        <div className="h-48 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
        <p className="text-slate-500">{error || 'The requested job posting is no longer available.'}</p>
        <Link to="/jobs">
          <Button variant="secondary" icon={ArrowLeft}>
            Back to Job Board
          </Button>
        </Link>
      </div>
    );
  }

  const {
    title,
    company,
    description,
    responsibilities = [],
    requiredSkills = [],
    location,
    workMode,
    jobType,
    salary,
    minCGPA,
    eligibleDepartments = [],
    openings,
    deadline,
    matchScore,
    matchedSkills = [],
    missingSkills = [],
    hasApplied,
    applicationStatus,
    isEligible = true,
  } = job;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-blue-600">
        <ArrowLeft className="w-4 h-4" /> Back to Opportunity Board
      </Link>

      {/* Main Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-2xl overflow-hidden shrink-0">
              {company?.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{title}</h1>
              <p className="text-base font-semibold text-slate-600">{company?.name || 'Company Name'}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5 text-slate-400" />{location}</span>
                <span className="flex items-center gap-1 font-medium"><Briefcase className="w-3.5 h-3.5 text-slate-400" />{workMode} • {jobType}</span>
                <span className="flex items-center gap-1 font-bold text-slate-800"><DollarSign className="w-3.5 h-3.5 text-emerald-600" />{salary}</span>
                <span className="flex items-center gap-1 font-medium"><Users className="w-3.5 h-3.5 text-slate-400" />{openings} Openings</span>
              </div>
            </div>
          </div>

          {/* Application Action Button */}
          {role === 'student' && (
            <div className="shrink-0 flex flex-col items-end gap-2">
              {hasApplied ? (
                <div className="text-right space-y-2">
                  <span className="inline-flex items-center gap-1 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold ring-1 ring-emerald-600/30">
                    <CheckCircle2 className="w-4 h-4" /> Applied (Status: {applicationStatus})
                  </span>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  icon={Send}
                  isLoading={applying}
                  disabled={!isEligible}
                  onClick={handleApply}
                  className="shadow-lg shadow-blue-500/20"
                >
                  Apply Now
                </Button>
              )}
            </div>
          )}
        </div>

        {applyError && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>{applyError}</span>
          </div>
        )}

        {/* Existing Application Progress Bar */}
        {hasApplied && applicationStatus && (
          <div className="pt-6 border-t border-slate-100">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Your Application Lifecycle</h4>
            <ApplicationProgress status={applicationStatus} />
          </div>
        )}
      </div>

      {/* Skill Match Breakdown Panel */}
      {role === 'student' && matchScore !== undefined && (
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400 ring-1 ring-blue-400/30">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Your Compatibility Match</h3>
                <p className="text-xs text-slate-400">Based on your student profile technical skills</p>
              </div>
            </div>
            <div className="text-3xl font-black text-blue-400 bg-blue-950/80 px-4 py-2 rounded-2xl border border-blue-800/60 self-start sm:self-auto">
              {matchScore}% Match
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 space-y-3">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Matched Skills ({matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchedSkills.length > 0 ? (
                  matchedSkills.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-emerald-950 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-800/50">
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No matched skills yet.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-slate-800/60 rounded-2xl p-5 border border-slate-700/60 space-y-3">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> Missing Skills ({missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {missingSkills.length > 0 ? (
                  missingSkills.map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-rose-950 text-rose-300 rounded-lg text-xs font-bold border border-rose-800/50">
                      × {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-400 font-bold">Great job! You possess all required skills!</span>
                )}
              </div>
            </div>
          </div>

          {missingSkills.length > 0 && (
            <p className="text-xs text-slate-400 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              💡 <span className="font-bold text-white">Actionable Skill Recommendation:</span> Improve your match compatibility score by adding or practicing <span className="text-blue-300 font-semibold">{missingSkills.join(', ')}</span> in your profile.
            </p>
          )}
        </div>
      )}

      {/* Description & Responsibilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-3">Role Overview</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{description}</p>
          </div>

          {responsibilities.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h3>
              <ul className="space-y-2">
                {responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Eligibility Sidebar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Eligibility Criteria</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Minimum CGPA:</span>
              <span className="font-bold text-slate-900">{minCGPA} / 10.0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Departments:</span>
              <span className="font-bold text-slate-900 text-right">{eligibleDepartments.join(', ') || 'All'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500 font-medium">Application Deadline:</span>
              <span className="font-bold text-slate-900">{new Date(deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
