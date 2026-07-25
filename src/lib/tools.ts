import { ToolDefinition } from "@/types";

export const TOOL_REGISTRY: ToolDefinition[] = [
  {
    id: "pdf-watermark",
    name: "PDF Watermark",
    description: "Stamp single or repeating text watermarks onto PDF pages with full style control.",
    icon: "Stamp",
    href: "/tools/pdf-watermark",
    badge: "Popular",
    tier: "free",
  },
  {
    id: "pdf-compress",
    name: "PDF Compress",
    description: "Strip hidden metadata and compress page content directly in client-side memory.",
    icon: "FileArchive",
    href: "/tools/pdf-compress",
    badge: "Fast",
    tier: "pro",
  },
  {
    id: "pdf-ocr",
    name: "PDF & Image OCR",
    description: "Extract text from scanned PDFs & images using WebAssembly Tesseract.js.",
    icon: "FileText",
    href: "/tools/pdf-ocr",
    badge: "WASM",
    tier: "pro",
  },
  {
    id: "pii-redact",
    name: "PII Redaction",
    description: "Detect and mask SSNs, Credit Cards, Emails, and Phone Numbers automatically.",
    icon: "EyeOff",
    href: "/tools/pii-redact",
    badge: "Security",
    tier: "pro",
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOL_REGISTRY.find((t) => t.id === id);
}

export function getToolsByTier(tier: "free" | "pro"): ToolDefinition[] {
  if (tier === "pro") return TOOL_REGISTRY;
  return TOOL_REGISTRY.filter((t) => t.tier === "free");
}
