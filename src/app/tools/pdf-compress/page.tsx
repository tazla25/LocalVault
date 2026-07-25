"use client";

import { useState } from "react";
import { FileDropzone } from "@/components/tools/FileDropzone";
import { PdfPreview } from "@/components/tools/PdfPreview";
import { compressPdf } from "@/lib/pdf-utils";
import { Download, Loader2, FileArchive } from "lucide-react";

export default function PdfCompressPage() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [compressedPdf, setCompressedPdf] = useState<Uint8Array | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState("document.pdf");
  const [removeMetadata, setRemoveMetadata] = useState(true);

  const handleFileSelect = (file: File, buffer: ArrayBuffer) => {
    setPdfBytes(buffer);
    setFileName(file.name);
    setCompressedPdf(null);
  };

  const handleCompress = async () => {
    if (!pdfBytes) return;
    setIsProcessing(true);
    try {
      const result = await compressPdf(pdfBytes, { removeMetadata });
      setCompressedPdf(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedPdf) return;
    const blob = new Blob([compressedPdf as BlobPart], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compressed_${fileName}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">PDF Compression & Metadata Removal</h1>
        <p className="text-xs text-slate-400 mt-1">
          Optimize object streams and strip author/title metadata client-side.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <FileDropzone onFileSelect={handleFileSelect} />

          {pdfBytes && (
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-700/50 space-y-6">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span>Strip Metadata (Privacy)</span>
                <input
                  type="checkbox"
                  checked={removeMetadata}
                  onChange={(e) => setRemoveMetadata(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 focus:ring-0"
                />
              </div>

              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileArchive className="w-4 h-4" />}
                Compress PDF
              </button>

              {compressedPdf && (
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Compressed PDF
                </button>
              )}
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <PdfPreview pdfBytes={(compressedPdf?.buffer as ArrayBuffer) || pdfBytes} />
        </div>
      </div>
    </div>
  );
}
