"use client";

import { useCallback, useState } from "react";
import { Upload, File, X, AlertCircle } from "lucide-react";

interface FileDropzoneProps {
  accept?: string;
  maxSizeMB?: number;
  onFileSelect: (file: File, arrayBuffer: ArrayBuffer) => void;
  onError?: (msg: string) => void;
}

export function FileDropzone({
  accept = ".pdf",
  maxSizeMB = 50,
  onFileSelect,
  onError,
}: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateAndProcess = useCallback(
    async (file: File) => {
      setErrorMsg(null);

      if (file.size > maxSizeMB * 1024 * 1024) {
        const msg = `File too large. Maximum ${maxSizeMB}MB allowed.`;
        setErrorMsg(msg);
        onError?.(msg);
        return;
      }

      if (accept === ".pdf") {
        const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
        const isPdf = header[0] === 0x25 && header[1] === 0x50;
        if (!isPdf) {
          const msg = "Invalid PDF file. Please upload a valid PDF.";
          setErrorMsg(msg);
          onError?.(msg);
          return;
        }
      }

      setSelectedFile(file);
      const arrayBuffer = await file.arrayBuffer();
      onFileSelect(file, arrayBuffer);
    },
    [maxSizeMB, accept, onFileSelect, onError]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) validateAndProcess(file);
    },
    [validateAndProcess]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndProcess(file);
    },
    [validateAndProcess]
  );

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setErrorMsg(null);
  }, []);

  if (selectedFile) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <File className="w-8 h-8 text-emerald-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-slate-400">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={clearFile}
            className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input")?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
          transition-all duration-300
          ${
            isDragOver
              ? "border-emerald-400 bg-emerald-500/5 scale-[1.02]"
              : "border-slate-600 hover:border-slate-500 bg-slate-800/20 hover:bg-slate-800/30"
          }
        `}
      >
        <Upload
          className={`w-10 h-10 mx-auto mb-3 transition-colors ${
            isDragOver ? "text-emerald-400" : "text-slate-500"
          }`}
        />
        <p className="text-sm text-slate-300 font-medium">
          Drop your PDF here or{" "}
          <span className="text-emerald-400">browse</span>
        </p>
        <p className="text-xs text-slate-500 mt-1.5">
          Maximum {maxSizeMB}MB &bull; 100% client-side processing
        </p>
        <input
          id="file-input"
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInput}
        />
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
