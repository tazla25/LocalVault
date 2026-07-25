import { PlanDefinition } from "@/types";

export const PLANS: PlanDefinition[] = [
  {
    id: "free",
    name: "Free",
    description: "For personal use & quick tasks",
    price: 0,
    paymentUrl: null,
    limits: {
      maxFileSizeMB: 10,
      maxPagesPerPdf: 5,
      tools: ["pdf-watermark"],
      dailyConversions: 3,
      batchProcessing: false,
    },
    features: [
      "PDF Watermarking",
      "Max 10MB file size",
      "Max 5 pages per document",
      "3 conversions per day",
      "100% Client-side processing",
    ],
    cta: "Current Plan",
  },
  {
    id: "pro",
    name: "Pro Monthly",
    description: "For freelancers & professionals",
    price: 7,
    period: "/month",
    paymentUrl: process.env.NEXT_PUBLIC_STRIPE_PRO_LINK || null,
    limits: {
      maxFileSizeMB: 100,
      maxPagesPerPdf: 500,
      tools: ["all"],
      dailyConversions: Infinity,
      batchProcessing: true,
    },
    features: [
      "All PDF Tools (Watermark, Compress, OCR, PII)",
      "Max 100MB file size",
      "Max 500 pages per document",
      "Unlimited daily conversions",
      "Batch processing",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "lifetime",
    name: "Lifetime Access",
    description: "Pay once, keep forever",
    price: 49,
    period: "one-time",
    paymentUrl: process.env.NEXT_PUBLIC_STRIPE_LIFETIME_LINK || null,
    limits: {
      maxFileSizeMB: 500,
      maxPagesPerPdf: Infinity,
      tools: ["all"],
      dailyConversions: Infinity,
      batchProcessing: true,
    },
    features: [
      "Everything in Pro Plan",
      "Max 500MB file size",
      "Unlimited document pages",
      "Lifetime feature updates",
      "Early access to new tools",
    ],
    cta: "Get Lifetime Pass",
  },
];

export function getPlan(planId: string): PlanDefinition {
  return PLANS.find((p) => p.id === planId) || PLANS[0];
}

export function checkLimit(
  plan: PlanDefinition,
  fileSizeMB: number,
  pageCount: number,
  toolId: string
): { allowed: boolean; reason?: string } {
  if (fileSizeMB > plan.limits.maxFileSizeMB) {
    return { allowed: false, reason: `File size exceeds ${plan.limits.maxFileSizeMB}MB limit.` };
  }
  if (pageCount > plan.limits.maxPagesPerPdf) {
    return { allowed: false, reason: `Page count exceeds ${plan.limits.maxPagesPerPdf} limit.` };
  }
  const tools = plan.limits.tools as string[];
  if (!tools.includes("all") && !tools.includes(toolId)) {
    return { allowed: false, reason: `The "${toolId}" tool requires a Pro plan.` };
  }
  return { allowed: true };
}
