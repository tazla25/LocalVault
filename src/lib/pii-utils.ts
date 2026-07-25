import { PiiMatch, PiiScanResult } from "@/types";

export const PII_PATTERNS = {
  ssn: {
    pattern: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
    label: "SSN",
    severity: "critical",
  },
  email: {
    pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    label: "Email",
    severity: "high",
  },
  phone: {
    pattern: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    label: "Phone",
    severity: "medium",
  },
  creditCard: {
    pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    label: "Credit Card",
    severity: "critical",
  },
  passport: {
    pattern: /\b[A-Z]{1,2}\d{6,9}\b/g,
    label: "Passport",
    severity: "critical",
  },
  bankAccount: {
    pattern: /\b\d{8,17}\b/g,
    label: "Bank Account",
    severity: "high",
  },
  tin: {
    pattern: /\b\d{2}[-\s]?\d{7}\b/g,
    label: "TIN/EIN",
    severity: "high",
  },
};

export function detectPii(text: string): PiiScanResult {
  const matches: PiiMatch[] = [];

  Object.entries(PII_PATTERNS).forEach(([type, config]) => {
    const typeMatches = Array.from(text.matchAll(config.pattern));
    for (const match of typeMatches) {
      matches.push({
        type: type,
        label: config.label,
        value: match[0],
        index: match.index!,
        severity: config.severity,
      });
    }
  });

  const sorted = matches.sort((a, b) => a.index - b.index);

  const severityCounts: Record<string, number> = {};
  sorted.forEach((m) => {
    severityCounts[m.severity] = (severityCounts[m.severity] || 0) + 1;
  });

  return {
    matches: sorted,
    totalCount: sorted.length,
    severityCounts,
  };
}

export function maskPii(text: string, matches: PiiMatch[]): string {
  let masked = text;
  const sorted = [...matches].sort((a, b) => b.index - a.index);

  sorted.forEach((match) => {
    const maskChar = "█";
    const mask = maskChar.repeat(match.value.length);
    masked =
      masked.slice(0, match.index) +
      mask +
      masked.slice(match.index + match.value.length);
  });

  return masked;
}

export function maskPiiInPdfText(
  text: string,
  matches: PiiMatch[]
): { maskedText: string; redactionMap: Array<{ original: string; masked: string; index: number }> } {
  const redactionMap: Array<{ original: string; masked: string; index: number }> = [];
  let masked = text;
  const sorted = [...matches].sort((a, b) => b.index - a.index);

  sorted.forEach((match) => {
    const mask = "█".repeat(match.value.length);
    redactionMap.push({
      original: match.value,
      masked: mask,
      index: match.index,
    });
    masked =
      masked.slice(0, match.index) +
      mask +
      masked.slice(match.index + match.value.length);
  });

  return { maskedText: masked, redactionMap };
}

export function isValidSSN(ssn: string): boolean {
  const cleaned = ssn.replace(/[-\s]/g, "");
  if (cleaned.length !== 9) return false;
  if (/^000|^666|^[9]\d{2}/.test(cleaned)) return false;
  if (/^\d{3}00/.test(cleaned)) return false;
  if (/^\d{5}0000/.test(cleaned)) return false;
  return true;
}

export function isValidCreditCard(cc: string): boolean {
  const cleaned = cc.replace(/[-\s]/g, "");
  if (!/^\d{13,19}$/.test(cleaned)) return false;

  let sum = 0;
  let isEven = false;
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}
