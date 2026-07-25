"use client";

import { useEffect, useState } from "react";
import { FileText, Eye } from "lucide-react";

interface PdfPreviewProps {
  pdfBytes: ArrayBuffer | null;
  pageCount?: number;
}

export function PdfPreview({ pdfBytes, pageCount }: PdfPreviewProps) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!pdfBytes) {
      setObjectUrl(null);
      return;
    }

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setObjectUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [pdfBytes]);

  if (!objectUrl) {
    return (
      <div className="h-64 border border-slate-800 rounded-xl bg-slate-900/30 flex flex-col items-center justify-center text-slate-500 p-6 text-center">
        <FileText className="w-12 h-12 mb-2 opacity-40" />
        <p className="text-sm font-medium">No document loaded</p>
        <p className="text-xs text-slate-600 mt-1">Upload a PDF to view preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <Eye className="w-3.5 h-3.5 text-emerald-400" />
          Live Document Preview
        </span>
        {pageCount && <span>{pageCount} Page(s)</span>}
      </div>
      <div className="h-[450px] border border-slate-700/40 rounded-xl overflow-hidden bg-slate-950">
        <iframe
          src={`${objectUrl}#toolbar=0&navpanes=0`}
          className="w-full h-full border-none"
          title="PDF Preview"
        />
      </div>
    </div>
  );
}
