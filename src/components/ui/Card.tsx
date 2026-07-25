import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
}

export function Card({ children, glass = true, className, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          "rounded-2xl p-6 transition-all duration-200",
          glass
            ? "bg-slate-900/60 backdrop-blur-xl border border-slate-700/30 shadow-xl"
            : "bg-slate-900 border border-slate-800",
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
