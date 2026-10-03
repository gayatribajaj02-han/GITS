import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Calendar, Sparkles, Building2 } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function JobCard({ job }) {
  const {
    _id,
    title,
    company,
    location,
    workMode,
    jobType,
    salary,
    requiredSkills = [],
    deadline,
    matchScore,
    matchedSkills = [],
    missingSkills = [],
  } = job;

  const isHighMatch = matchScore !== undefined && matchScore >= 75;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 hover:shadow-lg transition-all duration-200 p-6 flex flex-col justify-between group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-lg overflow-hidden shrink-0 group-hover:border-blue-400 transition-colors">
              {company?.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                <Link to={`/jobs/${_id}`}>{title}</Link>
              </h3>
              <p className="text-sm font-medium text-slate-500">{company?.name || 'Company'}</p>
            </div>
          </div>

          {/* Skill Match Badge */}
          {matchScore !== undefined && (
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ring-1 ring-inset ${
                isHighMatch
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/30'
                  : matchScore >= 50
                  ? 'bg-amber-50 text-amber-700 ring-amber-600/30'
                  : 'bg-slate-100 text-slate-700 ring-slate-400/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{matchScore}% Match</span>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mt-4 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {location}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            {workMode} • {jobType}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg font-semibold text-slate-800">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            {salary}
          </span>
        </div>

        {/* Skills preview */}
        <div className="mt-4">
          <p className="text-xs text-slate-400 mb-1.5 font-medium">Required Skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.slice(0, 5).map((skill) => {
              const isMatched = matchedSkills.includes(skill);
              return (
                <Badge
                  key={skill}
                  variant={isMatched ? 'emerald' : 'slate'}
                  className={isMatched ? 'font-bold' : ''}
                >
                  {isMatched ? `✓ ${skill}` : skill}
                </Badge>
              );
            })}
            {requiredSkills.length > 5 && (
              <span className="text-xs text-slate-400 self-center">
                +{requiredSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          Apply by {new Date(deadline).toLocaleDateString()}
        </span>

        <Link to={`/jobs/${_id}`}>
          <Button variant="primary" size="sm">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}
