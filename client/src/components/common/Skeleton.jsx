import React from 'react';

export function JobCardSkeleton() {
  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700/60 p-6 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
          <div className="space-y-2">
            <div className="w-48 h-4 bg-slate-700 rounded"></div>
            <div className="w-32 h-3 bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="w-20 h-6 bg-slate-700 rounded-full"></div>
      </div>
      <div className="space-y-2">
        <div className="w-full h-3 bg-slate-700 rounded"></div>
        <div className="w-3/4 h-3 bg-slate-700 rounded"></div>
      </div>
      <div className="flex gap-2 pt-2">
        <div className="w-16 h-6 bg-slate-700 rounded-lg"></div>
        <div className="w-16 h-6 bg-slate-700 rounded-lg"></div>
        <div className="w-16 h-6 bg-slate-700 rounded-lg"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-800 rounded-xl w-full"></div>
      ))}
    </div>
  );
}

export default function Skeleton({ type = 'card', count = 1, className = '' }) {
  if (type === 'line') {
    return (
      <div className={`space-y-3 animate-pulse ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-800 rounded-lg w-full"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}
