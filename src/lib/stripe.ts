import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2024-04-10",
});

export interface PlanLimit {
  maxFileSizeMB: number;
  maxPagesPerPdf: number;
  tools: string[];
  dailyConversions: number;
  batchProcessing: boolean;
  prioritySupport: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string | null;
  billing: "monthly" | "lifetime";
  limits: PlanLimit;
  features: string[];
  popular?: boolean;
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: "free",
    name: "Free",
    description: "For occasional personal use",
    price: 0,
    priceId: null,
    billing: "monthly",
    limits: {
      maxFileSizeMB: 10,
      maxPagesPerPdf: 5,
      tools: ["watermark"],
      dailyConversions: 3,
      batchProcessing: false,
      prioritySupport: false,
    },
    features: [
      "PDF Watermarking",
      "Max 10MB files",
      "Max 5 pages per PDF",
      "3 conversions/day",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For freelancers & small teams",
    price: 7,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_pro_default",
    billing: "monthly",
    limits: {
      maxFileSizeMB: 100,
      maxPagesPerPdf: 500,
      tools: ["watermark", "compress", "ocr", "redact", "merge", "split"],
      dailyConversions: Infinity,
      batchProcessing: true,
      prioritySupport: true,
    },
    features: [
      "All PDF tools",
      "OCR (Text Recognition)",
      "PII Redaction",
      "Batch Processing",
      "Max 100MB files",
      "Max 500 pages per PDF",
      "Unlimited conversions",
      "Priority email support",
    ],
    popular: true,
  },
  lifetime: {
    id: "lifetime",
    name: "Lifetime",
    description: "One-time payment, forever access",
    price: 49,
    priceId: process.env.NEXT_PUBLIC_STRIPE_LIFETIME_PRICE_ID || "price_lifetime_default",
    billing: "lifetime",
    limits: {
      maxFileSizeMB: 500,
      maxPagesPerPdf: Infinity,
      tools: ["all"],
      dailyConversions: Infinity,
      batchProcessing: true,
      prioritySupport: true,
    },
    features: [
      "Everything in Pro",
      "Max 500MB files",
      "Unlimited pages",
      "Lifetime updates",
      "Early access to new tools",
    ],
  },
};

export function getPlan(planId: string): Plan {
  return PLANS[planId] || PLANS.free;
}

export function checkLimit(
  plan: Plan,
  fileSizeMB: number,
  pageCount: number,
  toolId: string
): { allowed: boolean; reason?: string } {
  if (fileSizeMB > plan.limits.maxFileSizeMB) {
    return {
      allowed: false,
      reason: `File size exceeds ${plan.limits.maxFileSizeMB}MB limit for your plan.`,
    };
  }

  if (pageCount > plan.limits.maxPagesPerPdf) {
    return {
      allowed: false,
      reason: `Page count exceeds ${plan.limits.maxPagesPerPdf} limit for your plan.`,
    };
  }

  if (
    !plan.limits.tools.includes("all") &&
    !plan.limits.tools.includes(toolId)
  ) {
    return {
      allowed: false,
      reason: `The "${toolId}" tool is not available on your plan.`,
    };
  }

  return { allowed: true };
}
