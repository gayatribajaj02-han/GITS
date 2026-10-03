import React from 'react';
import { Award, AlertCircle } from 'lucide-react';

export default function ProfileCompletionBar({ completionPercentage = 0 }) {
  const getProgressColor = () => {
    if (completionPercentage >= 80) return 'bg-emerald-500';
    if (completionPercentage >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-slate-900 text-sm">Profile Completion</h4>
        </div>
        <span className="font-extrabold text-sm text-slate-900">{completionPercentage}%</span>
      </div>

      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${getProgressColor()}`}
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      {completionPercentage < 80 && (
        <div className="mt-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Complete your profile to at least 80% to maximize job compatibility scores and recruiter visibility.</span>
        </div>
      )}
    </div>
  );
}
