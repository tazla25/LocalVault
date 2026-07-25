export interface WatermarkOptions {
  text: string;
  opacity: number;
  rotation: number;
  color: { r: number; g: number; b: number };
  fontSize?: number;
  repeat?: boolean;
}

export interface CompressionOptions {
  quality?: "low" | "medium" | "high";
  removeMetadata?: boolean;
}

export interface PdfInfo {
  pageCount: number;
  width: number;
  height: number;
  title: string;
  author: string;
  creationDate?: Date;
  modificationDate?: Date;
}

export interface PiiMatch {
  type: string;
  label: string;
  value: string;
  index: number;
  severity: string;
}

export interface PiiScanResult {
  matches: PiiMatch[];
  totalCount: number;
  severityCounts: Record<string, number>;
}

export interface OcrProgress {
  status: string;
  progress: number;
}

export interface OcrResult {
  text: string;
  confidence: number;
  words: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
}

export type ToolId = "pdf-watermark" | "pdf-compress" | "pdf-ocr" | "pii-redact";

export interface ToolDefinition {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
  href: string;
  badge?: string;
  tier: "free" | "pro";
}

export interface PlanLimits {
  maxFileSizeMB: number;
  maxPagesPerPdf: number;
  tools: ToolId[] | ["all"];
  dailyConversions: number;
  batchProcessing: boolean;
}

export interface PlanDefinition {
  id: string;
  name: string;
  description: string;
  price: number;
  period?: string;
  paymentUrl: string | null;
  limits: PlanLimits;
  features: string[];
  popular?: boolean;
  cta: string;
}

export type ProcessingStatus = "idle" | "loading" | "processing" | "done" | "error";

export interface PrivacyEvent {
  type: "fetch" | "xhr";
  url: string;
  blocked: boolean;
  timestamp: number;
}
