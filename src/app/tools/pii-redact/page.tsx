"use client";

import { useState } from "react";
import { PiiScanner } from "@/components/tools/PiiScanner";
import { detectPii, maskPii } from "@/lib/pii-utils";
import { PiiScanResult } from "@/types";

export default function PiiRedactPage() {
  const [text, setText] = useState("");
  const [scanResult, setScanResult] = useState<PiiScanResult | null>(null);
  const [redactedText, setRedactedText] = useState("");

  const handleTextChange = (value: string) => {
    setText(value);
    if (value.trim()) {
      const res = detectPii(value);
      setScanResult(res);
      setRedactedText("");
    } else {
      setScanResult(null);
      setRedactedText("");
    }
  };

  const handlePdfScan = (extractedText: string) => {
    setText(extractedText);
    const res = detectPii(extractedText);
    setScanResult(res);
    setRedactedText("");
  };

  const handleRedact = () => {
    if (!scanResult) return;
    const masked = maskPii(text, scanResult.matches);
    setRedactedText(masked);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          PII Detection & Redaction Tool
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Scan text, PDFs, and images for SSNs, Credit Cards, Emails, and
          Passports — 100% client-side.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Input Document / Text Content
          </label>
          <textarea
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Paste text or document contents here to scan for PII..."
            rows={10}
            className="w-full p-4 bg-slate-950/80 border border-slate-700/50 rounded-2xl text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />

          <PiiScanner
            scanResult={scanResult}
            onRedact={handleRedact}
            onPdfScan={handlePdfScan}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Redacted Document Preview
          </label>
          <textarea
            readOnly
            value={
              redactedText ||
              "Redacted document text will appear here after scanning & redacting."
            }
            rows={16}
            className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-mono text-slate-400 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
