import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Briefcase, Award, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { fetchMyApplications } from '../../services/applicationService';
import { fetchJobs } from '../../services/jobService';
import ProfileCompletionBar from '../../components/student/ProfileCompletionBar';
import JobCard from '../../components/jobs/JobCard';
import ApplicationProgress from '../../components/dashboard/ApplicationProgress';
import Button from '../../components/common/Button';

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [appRes, jobRes] = await Promise.all([
          fetchMyApplications(),
          fetchJobs({ limit: 4, sort: 'latest' }),
        ]);

        if (appRes.success) setApplications(appRes.data || []);
        if (jobRes.success) {
          // Sort recommended jobs by match score descending
          const sortedJobs = (jobRes.data || []).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
          setRecommendedJobs(sortedJobs);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold backdrop-blur-sm text-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" /> Student Placement Portal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Good day, {user?.name ? user.name.split(' ')[0] : 'Student'} 👋
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Welcome to your placement portal. Track your submitted applications, explore high-match jobs, and manage your technical skills.
          </p>
        </div>

        <Link to="/student/profile">
          <Button variant="secondary" size="md">
            Manage Profile & Skills
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Recommended Jobs & Applications */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recommended Jobs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Recommended Opportunities For You
              </h3>
              <Link to="/jobs" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendedJobs.slice(0, 4).map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </div>

          {/* Recent Applications Section */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Recent Applications ({applications.length})
              </h3>
              <Link to="/student/applications" className="text-xs font-bold text-blue-600 hover:underline">
                View History
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <p className="text-slate-500 text-sm">You haven't submitted any job applications yet.</p>
                <Link to="/jobs">
                  <Button variant="primary" size="sm">
                    Explore Jobs Now
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.slice(0, 3).map((app) => (
                  <div key={app._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{app.job?.title}</h4>
                        <p className="text-xs font-medium text-slate-500">{app.job?.company?.name}</p>
                      </div>
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                        {app.matchScore}% Match
                      </span>
                    </div>

                    {/* Progress step timeline */}
                    <ApplicationProgress status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Profile Completion & Quick Stats */}
        <div className="space-y-6 sticky top-24">
          <ProfileCompletionBar completionPercentage={profile?.profileCompletion || 0} />

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
            <h4 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">Your Skills Profile</h4>
            <div className="flex flex-wrap gap-1.5">
              {profile?.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400">No skills added yet.</p>
              )}
            </div>
            <Link to="/student/profile">
              <Button variant="outline" size="sm" className="w-full mt-2">
                Edit Technical Skills
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
