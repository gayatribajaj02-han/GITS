import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { useJobs } from '../../hooks/useJobs';

export default function JobFilter() {
  const { filters, updateFilters, resetFilters } = useJobs();

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Filter className="w-5 h-5 text-blue-400" />
          Filter Opportunities
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Search Keywords</label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Role, title, or skills..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
        <input
          type="text"
          placeholder="e.g. Bengaluru, Pune, Remote"
          value={filters.location}
          onChange={(e) => updateFilters({ location: e.target.value })}
          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
        />
      </div>

      {/* Work Mode */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Work Mode</label>
        <select
          value={filters.workMode}
          onChange={(e) => updateFilters({ workMode: e.target.value })}
          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500 transition-all"
        >
          <option value="">All Work Modes</option>
          <option value="On-site">On-site</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {/* Job Type */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Job Type</label>
        <select
          value={filters.jobType}
          onChange={(e) => updateFilters({ jobType: e.target.value })}
          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500 transition-all"
        >
          <option value="">All Types</option>
          <option value="Full Time">Full Time</option>
          <option value="Internship">Internship</option>
          <option value="Part Time">Part Time</option>
        </select>
      </div>

      {/* Sort By */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">Sort By</label>
        <select
          value={filters.sort}
          onChange={(e) => updateFilters({ sort: e.target.value })}
          className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white font-medium focus:outline-none focus:border-blue-500 transition-all"
        >
          <option value="latest">Latest First</option>
          <option value="deadline">Approaching Deadline</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>
    </div>
  );
}
