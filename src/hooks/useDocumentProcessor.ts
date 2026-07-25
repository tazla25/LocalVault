"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfInfo, ProcessingStatus } from "@/types";

interface ProcessorState {
  file: File | null;
  fileName: string;
  pdfBytes: ArrayBuffer | null;
  pdfInfo: PdfInfo | null;
  result: Uint8Array | null;
  status: ProcessingStatus;
  error: string | null;
}

interface UseDocumentProcessorOptions {
  maxSizeMB?: number;
}

export function useDocumentProcessor(options: UseDocumentProcessorOptions = {}) {
  const { maxSizeMB = 50 } = options;

  const [state, setState] = useState<ProcessorState>({
    file: null,
    fileName: "document.pdf",
    pdfBytes: null,
    pdfInfo: null,
    result: null,
    status: "idle",
    error: null,
  });

  const loadFile = useCallback(
    async (file: File): Promise<ArrayBuffer> => {
      setState((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        result: null,
        error: null,
        status: "loading",
      }));

      try {
        if (file.size > maxSizeMB * 1024 * 1024) {
          throw new Error(`File too large. Maximum ${maxSizeMB}MB allowed.`);
        }

        if (file.name.toLowerCase().endsWith(".pdf")) {
          const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
          if (header[0] !== 0x25 || header[1] !== 0x50) {
            throw new Error("Invalid PDF file. Please upload a valid PDF.");
          }
        }

        const arrayBuffer = await file.arrayBuffer();

        let pdfInfo: PdfInfo | null = null;
        if (file.name.toLowerCase().endsWith(".pdf")) {
          try {
            const pdfDoc = await PDFDocument.load(arrayBuffer, {
              updateMetadata: false,
            });
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];
            const { width, height } = firstPage.getSize();
            pdfInfo = {
              pageCount: pages.length,
              width,
              height,
              title: pdfDoc.getTitle() || "Untitled",
              author: pdfDoc.getAuthor() || "Unknown",
            };
          } catch {
            // PDF info extraction failed, continue
          }
        }

        setState((prev) => ({
          ...prev,
          pdfBytes: arrayBuffer,
          pdfInfo,
          status: "idle",
        }));

        return arrayBuffer;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load file";
        setState((prev) => ({ ...prev, error: message, status: "error" }));
        throw err;
      }
    },
    [maxSizeMB]
  );

  const processDocument = useCallback(
    async <T>(processFn: (bytes: ArrayBuffer) => Promise<T>): Promise<T> => {
      if (!state.pdfBytes) throw new Error("No file loaded");

      setState((prev) => ({ ...prev, status: "processing", error: null }));

      try {
        const result = await processFn(state.pdfBytes);

        setState((prev) => ({
          ...prev,
          result: result instanceof Uint8Array ? result : null,
          status: "done",
        }));

        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Processing failed";
        setState((prev) => ({ ...prev, error: message, status: "error" }));
        throw err;
      }
    },
    [state.pdfBytes]
  );

  const download = useCallback(
    (data: Uint8Array, prefix: string = "processed") => {
      const blob = new Blob([data as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${prefix}_${state.fileName}`;
      a.click();
      URL.revokeObjectURL(url);
    },
    [state.fileName]
  );

  const reset = useCallback(() => {
    setState({
      file: null,
      fileName: "document.pdf",
      pdfBytes: null,
      pdfInfo: null,
      result: null,
      status: "idle",
      error: null,
    });
  }, []);

  return {
    ...state,
    loadFile,
    processDocument,
    download,
    reset,
  };
}
