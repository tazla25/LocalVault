import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-emerald-500/50";

  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 active:scale-[0.98]",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50 active:scale-[0.98]",
    outline: "border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 active:scale-[0.98]",
    danger: "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 active:scale-[0.98]",
    ghost: "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
}
