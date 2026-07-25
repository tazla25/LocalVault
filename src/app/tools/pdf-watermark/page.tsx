"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { PdfPreview } from "@/components/tools/PdfPreview";
import { WatermarkSettings } from "@/components/tools/WatermarkSettings";
import { WatermarkOptions } from "@/types";
import { addWatermarkToPdf } from "@/lib/pdf-utils";
import { useDocumentProcessor } from "@/hooks/useDocumentProcessor";
import { Download, Loader2 } from "lucide-react";

export default function PdfWatermarkPage() {
  const { pdfBytes, result, status, loadFile, processDocument, download: downloadFile } = useDocumentProcessor();

  const [options, setOptions] = useState<WatermarkOptions>({
    text: "CONFIDENTIAL",
    opacity: 0.3,
    rotation: -45,
    color: { r: 128, g: 128, b: 128 },
    fontSize: 48,
    repeat: false,
  });

  const handleFileSelect = (file: File, _buffer: ArrayBuffer) => {
    loadFile(file).catch(console.error);
  };

  const handleApplyWatermark = async () => {
    try {
      await processDocument((bytes) => addWatermarkToPdf(bytes, options));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (result) downloadFile(result, "watermarked");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">PDF Watermarking Tool</h1>
        <p className="text-xs text-slate-400 mt-1">
          Add custom watermarks directly in your browser. No files uploaded.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <FileDropzone onFileSelect={handleFileSelect} />

          {pdfBytes && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/50 space-y-6">
              <h3 className="font-semibold text-slate-200 text-sm">
                Watermark Settings
              </h3>
              <WatermarkSettings options={options} onChange={setOptions} />

              <button
                onClick={handleApplyWatermark}
                disabled={status === "processing"}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                {status === "processing" && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Apply Watermark
              </button>

              {result && (
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Watermarked PDF
                </button>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <PdfPreview pdfBytes={(result ? (result.buffer as ArrayBuffer) : pdfBytes)} />
        </div>
      </div>
    </div>
  );
}
