import { join } from "path";
import os from "os";
import { writeFile, unlink } from "fs/promises";
import PDFParser from "pdf2json";

export default async function parsePDF(
  buffer: Buffer,
  filename: string
): Promise<string> {
  const tempFilePath = join(os.tmpdir(), `${Date.now()}-${filename}`);
  await writeFile(tempFilePath, buffer);

  const pdfParser = new PDFParser(null, true);

  try {
    const extractedText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfParser.getRawTextContent();
        resolve(text);
      });

      pdfParser.on("pdfParser_dataError", (errData) => {
        const errorMessage =
          errData.parserError?.toString() || "PDF parsing failed";
        reject(new Error(errorMessage));
      });

      pdfParser.loadPDF(tempFilePath);
    });

    return extractedText;
  } finally {
    // Clean up: delete the temporary file
    await unlink(tempFilePath);
  }
}
