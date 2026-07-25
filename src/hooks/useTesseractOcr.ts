"use client";

import { useState, useCallback, useRef } from "react";
import { createWorker } from "tesseract.js";
import { OcrProgress, OcrResult } from "@/types";

export function useTesseractOcr() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<OcrProgress | null>(null);
  const [result, setResult] = useState<OcrResult | null>(null);
  const workerRef = useRef<any>(null);

  const processImage = useCallback(
    async (imageFile: File): Promise<OcrResult> => {
      setIsProcessing(true);
      setProgress({
        status: "Initializing OCR engine...",
        progress: 0,
      });
      setResult(null);

      try {
        const worker = await createWorker("eng", 1, {
          logger: (m) => {
            if ("progress" in m) {
              setProgress({
                status: m.status,
                progress: Math.round(m.progress * 100),
              });
            }
          },
          workerPath:
            "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js",
          langPath:
            "https://tessdata.projectnaptha.com/4.0.0_best",
          corePath:
            "https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js",
        });

        workerRef.current = worker;

        const {
          data: { text, confidence, words },
        } = await worker.recognize(imageFile);

        await worker.terminate();

        const ocrResult: OcrResult = {
          text,
          confidence,
          words: words.map((w: any) => ({
            text: w.text,
            confidence: w.confidence,
            bbox: w.bbox,
          })),
        };

        setResult(ocrResult);
        return ocrResult;
      } catch (error) {
        console.error("OCR Error:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "OCR processing failed"
        );
      } finally {
        setIsProcessing(false);
      }
    },
    []
  );

  const processPdfPage = useCallback(
    async (
      canvas: HTMLCanvasElement
    ): Promise<OcrResult> => {
      return new Promise((resolve, reject) => {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            reject(
              new Error("Canvas to blob conversion failed")
            );
            return;
          }
          const file = new File([blob], "page.png", {
            type: "image/png",
          });
          try {
            const res = await processImage(file);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        }, "image/png");
      });
    },
    [processImage]
  );

  const cancel = useCallback(async () => {
    if (workerRef.current) {
      await workerRef.current.terminate();
      workerRef.current = null;
    }
    setIsProcessing(false);
    setProgress(null);
  }, []);

  return {
    isProcessing,
    progress,
    result,
    processImage,
    processPdfPage,
    cancel,
  };
}
