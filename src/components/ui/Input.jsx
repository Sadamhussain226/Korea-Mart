import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, helperText, className = '', ...props }, ref) => {
  return (
    <div className="w-full mb-3 text-left rtl:text-right">
      {label && (
        <label className="block text-xs font-bold text-slate-800 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
          error ? 'border-red-500 focus:border-red-500' : 'border-slate-300 focus:border-red-600'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 mt-1 font-semibold">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
