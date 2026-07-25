"use client";

import { Shield, ShieldAlert } from "lucide-react";
import { usePrivacy } from "@/lib/privacy-context";

export function PrivacyBadge() {
  const { isActive, blockedCount } = usePrivacy();

  const hasBlocked = blockedCount > 0;

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border ${
        hasBlocked
          ? "bg-red-500/10 border-red-500/20"
          : "bg-emerald-500/10 border-emerald-500/20"
      }`}
    >
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            hasBlocked ? "bg-red-400" : "bg-emerald-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
            hasBlocked ? "bg-red-500" : "bg-emerald-500"
          }`}
        />
      </span>
      {hasBlocked ? (
        <ShieldAlert className="w-4 h-4 text-red-400" />
      ) : (
        <Shield className="w-4 h-4 text-emerald-400" />
      )}
      <span
        className={`text-sm font-semibold ${
          hasBlocked ? "text-red-400" : "text-emerald-400"
        }`}
      >
        {hasBlocked
          ? `${blockedCount} Blocked`
          : isActive
          ? "Privacy Verified"
          : "Initializing..."}
      </span>
      {!hasBlocked && (
        <span className="text-xs text-emerald-500/70 hidden sm:inline">
          &mdash; No Network Upload
        </span>
      )}
    </div>
  );
}
