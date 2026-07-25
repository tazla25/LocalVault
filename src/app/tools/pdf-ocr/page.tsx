"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { useTesseractOcr } from "@/hooks/useTesseractOcr";
import { ProcessingProgress } from "@/components/tools/ProcessingProgress";
import { Copy, Check, FileText } from "lucide-react";

export default function PdfOcrPage() {
  const { isProcessing, progress, result, processImage } = useTesseractOcr();
  const [copied, setCopied] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      await processImage(file);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = () => {
    if (!result?.text) return;
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Client-Side OCR (Text Recognition)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Extract text from scanned documents using WebAssembly Tesseract.
        </p>
      </div>

      <FileDropzone
        accept="image/*,.pdf"
        onFileSelect={(file) => handleFileSelect(file)}
      />

      <ProcessingProgress
        isProcessing={isProcessing}
        status={progress?.status || "Processing..."}
        progress={progress?.progress}
      />

      {result && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <FileText className="w-4 h-4 text-emerald-400" />
              Extracted Text ({Math.round(result.confidence)}% Confidence)
            </div>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-emerald-400 flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? "Copied" : "Copy Text"}
            </button>
          </div>

          <textarea
            readOnly
            value={result.text}
            rows={12}
            className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
