"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { PdfInfo } from "@/types";

export function useClientSidePdf() {
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pdfInfo, setPdfInfo] = useState<PdfInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPdf = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const header = new Uint8Array(await file.slice(0, 5).arrayBuffer());
      const isPdf = header[0] === 0x25 && header[1] === 0x50;

      if (!isPdf) {
        throw new Error("Invalid PDF file. Please upload a valid PDF.");
      }

      const arrayBuffer = await file.arrayBuffer();
      setPdfBytes(arrayBuffer);

      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        updateMetadata: false,
      });
      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      setPdfInfo({
        pageCount: pages.length,
        width,
        height,
        title: pdfDoc.getTitle() || "Untitled",
        author: pdfDoc.getAuthor() || "Unknown",
      });

      return arrayBuffer;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load PDF";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setPdfBytes(null);
    setPdfInfo(null);
    setError(null);
  }, []);

  return { pdfBytes, pdfInfo, isLoading, error, loadPdf, reset };
}
