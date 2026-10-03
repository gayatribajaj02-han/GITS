import React from 'react';
import { CheckCircle2, Clock, XCircle, ChevronRight } from 'lucide-react';

const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

export default function ApplicationProgress({ status = 'Applied' }) {
  const isRejected = status === 'Rejected';
  const currentStageIndex = isRejected ? -1 : STAGES.indexOf(status);

  return (
    <div className="w-full py-4">
      {isRejected ? (
        <div className="flex items-center gap-3 p-4 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
          <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Application Status: Rejected</h4>
            <p className="text-xs text-rose-600 mt-0.5">
              Thank you for your interest. Unfortunately, the recruiter has decided not to proceed with your application at this time.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Progress Bar Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 rounded-full z-0">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{
                width: `${(Math.max(0, currentStageIndex) / (STAGES.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {/* Progress Steps */}
          <div className="relative z-10 flex justify-between">
            {STAGES.map((stage, idx) => {
              const isCompleted = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={stage} className="flex flex-col items-center group">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                      isCompleted
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : isCurrent
                        ? 'bg-white text-blue-600 ring-4 ring-blue-600 border-2 border-blue-600 shadow-md'
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <Clock className="w-4 h-4 animate-spin text-blue-600" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium transition-colors ${
                      isCurrent
                        ? 'text-blue-600 font-bold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {stage}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
