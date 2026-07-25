"use client";

import { Activity, CheckCircle, XCircle } from "lucide-react";
import { usePrivacy } from "@/lib/privacy-context";

export function NetworkMonitor() {
  const { events, blockedCount, isActive } = usePrivacy();

  return (
    <div className="rounded-xl bg-black/40 border border-slate-700/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-emerald-400 font-mono">
            Privacy Monitor
          </h3>
        </div>
        {isActive && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Active
          </span>
        )}
      </div>
      <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-xs">
        {/* Always show engine status */}
        <div className="flex items-start gap-2 text-emerald-400">
          <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>LocalVault privacy engine initialized</span>
        </div>
        <div className="flex items-start gap-2 text-emerald-400">
          <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
          <span>
            Network interceptor active &mdash; blocking external uploads
          </span>
        </div>

        {/* Live network events */}
        {events.map((event, idx) => (
          <div
            key={`${event.timestamp}-${idx}`}
            className={`flex items-start gap-2 ${
              event.blocked ? "text-red-400" : "text-slate-400"
            }`}
          >
            {event.blocked ? (
              <XCircle className="w-3 h-3 mt-0.5 shrink-0" />
            ) : (
              <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" />
            )}
            <span className="truncate">
              {event.blocked ? "BLOCKED" : "OK"}: {event.type.toUpperCase()}{" "}
              {new URL(event.url, "http://localhost").pathname.slice(0, 40)}
            </span>
          </div>
        ))}

        {blockedCount > 0 && (
          <div className="flex items-start gap-2 text-red-400 font-bold pt-1">
            <XCircle className="w-3 h-3 mt-0.5 shrink-0" />
            <span>{blockedCount} external request(s) blocked</span>
          </div>
        )}
      </div>
    </div>
  );
}
