export async function renderPdfPageToCanvas(
  pdfBytes: ArrayBuffer,
  pageIndex: number = 0,
  scale: number = 2
): Promise<HTMLCanvasElement> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";

  const pdf = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
  const page = await pdf.getPage(pageIndex + 1);

  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvasContext: context, viewport }).promise;
  return canvas;
}
