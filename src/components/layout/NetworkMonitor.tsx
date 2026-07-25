"use client";

import { useEffect, useState } from "react";
import { Activity, CheckCircle, XCircle } from "lucide-react";

interface LogEntry {
  id: number;
  message: string;
  type: "safe" | "blocked" | "info";
  timestamp: Date;
}

export function NetworkMonitor() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      message: "LocalVault privacy engine initialized",
      type: "info",
      timestamp: new Date(),
    },
    {
      id: 2,
      message: "Network interceptor active — blocking external uploads",
      type: "safe",
      timestamp: new Date(),
    },
  ]);

  useEffect(() => {
    const handleLog = (e: CustomEvent) => {
      const newLog: LogEntry = {
        id: Date.now(),
        message: e.detail.message,
        type: e.detail.type,
        timestamp: new Date(),
      };
      setLogs((prev) => [...prev.slice(-20), newLog]);
    };

    window.addEventListener("localvault-log" as any, handleLog);
    return () => window.removeEventListener("localvault-log" as any, handleLog);
  }, []);

  return (
    <div className="rounded-xl bg-black/40 border border-slate-700/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-emerald-400" />
        <h3 className="text-sm font-bold text-emerald-400 font-mono">
          Privacy Monitor
        </h3>
      </div>
      <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-xs">
        {logs.map((log) => (
          <div
            key={log.id}
            className={`flex items-start gap-2 ${
              log.type === "safe"
                ? "text-emerald-400"
                : log.type === "blocked"
                ? "text-red-400"
                : "text-slate-400"
            }`}
          >
            {log.type === "safe" ? (
              <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
            ) : log.type === "blocked" ? (
              <XCircle className="w-3 h-3 mt-0.5 shrink-0" />
            ) : (
              <span className="w-3 h-3 mt-0.5 shrink-0">&bull;</span>
            )}
            <span>{log.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
