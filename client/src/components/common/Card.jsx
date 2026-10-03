import React from 'react';

export default function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 transition-all duration-200 ${
        hover ? 'hover:shadow-md hover:border-blue-300 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
