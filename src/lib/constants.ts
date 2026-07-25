import { ToolMeta } from "@/types";

export const APP_NAME = "LocalVault";
export const APP_DESCRIPTION = "100% Browser-Based Client-Side Privacy Tools";

export const TOOLS: ToolMeta[] = [
  {
    id: "pdf-watermark",
    name: "PDF Watermark",
    description: "Add custom text or repeating watermarks to your PDF pages without uploading.",
    icon: "Stamp",
    href: "/tools/pdf-watermark",
    badge: "Popular",
  },
  {
    id: "pdf-compress",
    name: "PDF Compress",
    description: "Strip metadata and optimize PDF streams directly in your browser.",
    icon: "FileArchive",
    href: "/tools/pdf-compress",
  },
  {
    id: "pdf-ocr",
    name: "PDF & Image OCR",
    description: "Extract editable text from scanned documents using WebAssembly Tesseract.",
    icon: "FileText",
    href: "/tools/pdf-ocr",
    badge: "WASM",
  },
  {
    id: "pii-redact",
    name: "PII Redaction",
    description: "Automatically scan & redact SSNs, Credit Cards, Emails, and Phone Numbers.",
    icon: "EyeOff",
    href: "/tools/pii-redact",
    badge: "Security",
  },
];
