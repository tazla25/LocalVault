import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 bg-slate-950/60 border border-slate-700/50 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 text-sm transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
