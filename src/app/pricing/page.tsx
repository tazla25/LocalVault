"use client";

import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";

export default function PricingPage() {
  const handleUpgrade = (paymentUrl: string | null) => {
    if (paymentUrl) {
      window.open(paymentUrl, "_blank");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
          Simple, Transparent Pricing
        </h1>
        <p className="text-sm text-slate-400">
          Zero server costs mean we pass maximum value to you. All plans run 100%
          client-side.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`p-8 rounded-2xl space-y-6 flex flex-col justify-between transition-all ${
              plan.popular
                ? "bg-slate-900 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/10 relative"
                : "bg-slate-900/60 border border-slate-700/30"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-6 px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-full uppercase tracking-wider">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200">{plan.name}</h3>
              <p className="text-xs text-slate-400">{plan.description}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-100">
                  ${plan.price}
                </span>
                {plan.period && (
                  <span className="text-xs text-slate-400">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleUpgrade(plan.paymentUrl)}
              disabled={!plan.paymentUrl}
              className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                plan.popular
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : plan.paymentUrl
                  ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  : "bg-slate-800/50 text-slate-500 border border-slate-800 cursor-default"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
