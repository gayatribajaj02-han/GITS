import React from 'react';

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm focus-visible:outline-blue-600',
  secondary: 'bg-white hover:bg-slate-50 text-slate-900 ring-1 ring-slate-300 shadow-sm',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus-visible:outline-rose-600',
  outline: 'bg-transparent text-blue-600 border border-blue-600 hover:bg-blue-50',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-base rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className={`w-4 h-4 mr-2 ${size === 'sm' ? 'w-3.5 h-3.5 mr-1.5' : ''}`} />
      ) : null}
      {children}
    </button>
  );
}
