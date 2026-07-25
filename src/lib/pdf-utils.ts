import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { WatermarkOptions, CompressionOptions } from "@/types";

export async function addWatermarkToPdf(
  pdfBytes: ArrayBuffer,
  options: WatermarkOptions
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const {
    text,
    opacity,
    rotation,
    color,
    fontSize = 48,
    repeat = false,
  } = options;

  pages.forEach((page) => {
    const { width, height } = page.getSize();

    if (repeat) {
      const cols = 3;
      const rows = 4;
      const cellW = width / cols;
      const cellH = height / rows;
      const textW = font.widthOfTextAtSize(text, fontSize);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = c * cellW + cellW / 2 - textW / 2;
          const cy = r * cellH + cellH / 2;
          page.drawText(text, {
            x: cx,
            y: cy,
            size: fontSize,
            font,
            color: rgb(color.r / 255, color.g / 255, color.b / 255),
            opacity,
            rotate: degrees(rotation),
          });
        }
      }
    } else {
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(color.r / 255, color.g / 255, color.b / 255),
        opacity,
        rotate: degrees(rotation),
      });
    }
  });

  return await pdfDoc.save();
}

export async function compressPdf(
  pdfBytes: ArrayBuffer,
  options: CompressionOptions = {}
): Promise<Uint8Array> {
  const { removeMetadata = true } = options;

  const pdfDoc = await PDFDocument.load(pdfBytes, {
    updateMetadata: !removeMetadata,
  });

  if (removeMetadata) {
    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("");
    pdfDoc.setCreator("LocalVault");
  }

  return await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });
}

export async function getPdfInfo(pdfBytes: ArrayBuffer) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  return {
    pageCount: pages.length,
    width,
    height,
    title: pdfDoc.getTitle() || "Untitled",
    author: pdfDoc.getAuthor() || "Unknown",
    creationDate: pdfDoc.getCreationDate(),
    modificationDate: pdfDoc.getModificationDate(),
  };
}

export async function mergePdfs(pdfBytesArray: ArrayBuffer[]): Promise<Uint8Array> {
  const mergedPdf = await PDFDocument.create();

  for (const bytes of pdfBytesArray) {
    const pdf = await PDFDocument.load(bytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  return await mergedPdf.save();
}

export async function splitPdf(
  pdfBytes: ArrayBuffer,
  pageRanges: { start: number; end: number }[]
): Promise<Uint8Array[]> {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const results: Uint8Array[] = [];

  for (const range of pageRanges) {
    const newPdf = await PDFDocument.create();
    const pages = await newPdf.copyPages(
      pdfDoc,
      Array.from(
        { length: range.end - range.start + 1 },
        (_, i) => range.start + i
      )
    );
    pages.forEach((page) => newPdf.addPage(page));
    results.push(await newPdf.save());
  }

  return results;
}
