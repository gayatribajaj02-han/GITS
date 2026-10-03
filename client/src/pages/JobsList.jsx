import React, { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import JobCard from '../components/jobs/JobCard';
import JobFilter from '../components/jobs/JobFilter';
import { JobCardSkeleton } from '../components/common/Skeleton';
import Button from '../components/common/Button';
import { Briefcase, Frown, RefreshCw, Zap } from 'lucide-react';
import { syncMarketJobsApi } from '../services/jobService';

export default function JobsList() {
  const { jobs, loading, error, pagination, filters, updateFilters, resetFilters, refreshJobs } = useJobs();
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState('');

  const handleSyncMarketJobs = async () => {
    setSyncing(true);
    setSyncSuccess('');
    try {
      const res = await syncMarketJobsApi();
      if (res.success) {
        setSyncSuccess(res.message || 'Market jobs synced successfully!');
        await refreshJobs();
      }
    } catch (err) {
      console.error('Market job sync failed:', err);
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncSuccess(''), 5000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Placement Opportunities</h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover internships and full-time tech roles matching your skills & eligibility.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <Button
            variant="primary"
            size="sm"
            icon={syncing ? RefreshCw : Zap}
            disabled={syncing}
            onClick={handleSyncMarketJobs}
            className={`${syncing ? 'animate-pulse' : ''} bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20`}
          >
            {syncing ? 'Syncing Live Market...' : '⚡ Sync Live Market Jobs'}
          </Button>

          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
            Showing <span className="text-slate-900 font-bold">{jobs.length}</span> of{' '}
            <span className="text-slate-900 font-bold">{pagination.total || jobs.length}</span> openings
          </div>
        </div>
      </div>

      {syncSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span>{syncSuccess}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 sticky top-24">
          <JobFilter />
        </div>

        {/* Jobs List Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
              <JobCardSkeleton />
            </div>
          ) : error ? (
            <div className="p-8 bg-rose-50 border border-rose-200 text-rose-700 rounded-3xl text-center space-y-3">
              <p className="font-bold text-sm">Failed to load jobs</p>
              <p className="text-xs">{error}</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Frown className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">No Job Openings Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                We couldn't find any job opportunities matching your current search filters. Click sync live market jobs or clear search filters.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="secondary" onClick={resetFilters}>
                  Clear Search Filters
                </Button>
                <Button variant="primary" icon={Zap} onClick={handleSyncMarketJobs}>
                  Sync Live Market Jobs
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => updateFilters({ page: pagination.page - 1 })}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => updateFilters({ page: pagination.page + 1 })}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
