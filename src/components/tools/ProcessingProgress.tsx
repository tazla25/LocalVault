"use client";

import { Loader2, CheckCircle2 } from "lucide-react";

interface ProcessingProgressProps {
  isProcessing: boolean;
  status: string;
  progress?: number;
  completed?: boolean;
}

export function ProcessingProgress({
  isProcessing,
  status,
  progress,
  completed,
}: ProcessingProgressProps) {
  if (!isProcessing && !completed) return null;

  return (
    <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/50 space-y-2">
      <div className="flex items-center justify-between text-sm font-medium">
        <div className="flex items-center gap-2">
          {completed ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
          )}
          <span className={completed ? "text-emerald-400" : "text-slate-200"}>
            {status}
          </span>
        </div>
        {typeof progress === "number" && (
          <span className="text-xs font-mono text-emerald-400">{progress}%</span>
        )}
      </div>

      {typeof progress === "number" && (
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
