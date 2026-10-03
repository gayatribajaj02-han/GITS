import React from 'react';

const variantClasses = {
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  amber: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  rose: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
  slate: 'bg-slate-100 text-slate-700 ring-slate-500/20',
  purple: 'bg-purple-50 text-purple-700 ring-purple-600/20',
};

export default function Badge({ children, variant = 'blue', className = '' }) {
  const colorStyle = variantClasses[variant] || variantClasses.blue;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${colorStyle} ${className}`}>
      {children}
    </span>
  );
}
