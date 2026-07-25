"use client";

import { PiiScanResult } from "@/types";
import { ShieldAlert, ShieldCheck, Lock } from "lucide-react";

interface PiiScannerProps {
  scanResult: PiiScanResult | null;
  onRedact: () => void;
  isRedacting?: boolean;
}

export function PiiScanner({ scanResult, onRedact, isRedacting }: PiiScannerProps) {
  if (!scanResult) return null;

  const { totalCount, matches, severityCounts } = scanResult;

  return (
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {totalCount > 0 ? (
            <ShieldAlert className="w-5 h-5 text-amber-400" />
          ) : (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          )}
          <h3 className="font-semibold text-slate-200 text-sm">
            PII Scan Results
          </h3>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-medium ${
          totalCount > 0 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        }`}>
          {totalCount} PII Found
        </span>
      </div>

      {totalCount > 0 ? (
        <>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="font-bold text-red-400">{severityCounts.critical || 0}</div>
              <div className="text-slate-400">Critical</div>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="font-bold text-amber-400">{severityCounts.high || 0}</div>
              <div className="text-slate-400">High</div>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="font-bold text-blue-400">{severityCounts.medium || 0}</div>
              <div className="text-slate-400">Medium</div>
            </div>
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
            {matches.map((m, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800"
              >
                <span className="text-slate-300 font-medium">{m.label}</span>
                <span className="text-slate-500 truncate max-w-[150px]">{m.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onRedact}
            disabled={isRedacting}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Lock className="w-4 h-4" />
            Redact All PII (Client-Side)
          </button>
        </>
      ) : (
        <p className="text-xs text-slate-400">
          No sensitive PII patterns (SSN, Credit Cards, Emails, Passports) detected in this document.
        </p>
      )}
    </div>
  );
}
