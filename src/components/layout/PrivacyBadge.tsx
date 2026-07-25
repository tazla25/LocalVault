"use client";

import { Shield } from "lucide-react";

export function PrivacyBadge() {
  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
      <Shield className="w-4 h-4 text-emerald-400" />
      <span className="text-sm font-semibold text-emerald-400">
        Privacy Verified
      </span>
      <span className="text-xs text-emerald-500/70 hidden sm:inline">
        &mdash; No Network Upload
      </span>
    </div>
  );
}
