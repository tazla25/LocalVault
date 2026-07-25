"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { PrivacyBadge } from "./PrivacyBadge";
import { TOOL_REGISTRY } from "@/lib/tools";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-colors">
            <Lock className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            LocalVault
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          {TOOL_REGISTRY.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="hover:text-slate-200 transition-colors"
            >
              {tool.name.replace("PDF ", "").replace("PDF & Image ", "").replace("PII ", "PII ")}
            </Link>
          ))}
          <Link
            href="/pricing"
            className="hover:text-slate-200 transition-colors"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <PrivacyBadge />
        </div>
      </div>
    </header>
  );
}
