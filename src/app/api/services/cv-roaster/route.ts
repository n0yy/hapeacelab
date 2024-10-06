import { NextRequest, NextResponse } from "next/server";
import PDFParser from "pdf2json";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { join } from "path";
import os from "os";
import { writeFile, unlink } from "fs/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PDFParserError {
  parserError: unknown;
  // tambahkan properti lain yang mungkin ada di error object
}

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    const mimeType = file.type;
    if (mimeType !== "application/pdf") {
      return NextResponse.json(
        { message: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create a unique temporary file name
    const uniqueFilename = `${Date.now()}-${file.name}`;
    tempFilePath = join(os.tmpdir(), uniqueFilename);

    await writeFile(tempFilePath, buffer);

    const pdfParser = new PDFParser(null, true);

    const extractedText = await new Promise<string>((resolve, reject) => {
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfParser.getRawTextContent();
        resolve(text);
      });

      pdfParser.on("pdfParser_dataError", (errData: PDFParserError) => {
        const errorMessage =
          errData.parserError?.toString() || "PDF parsing failed";
        reject(new Error(errorMessage));
      });

      if (tempFilePath !== null) {
        pdfParser.loadPDF(tempFilePath);
      } else {
        throw new Error("Temporary file path is null");
      }
    });

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const { text } = await generateText({
      model: google("gemini-1.5-pro-002", {
        safetySettings: [
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE",
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE",
          },
        ],
      }),
      prompt: `${extractedText}\nRoasting cv tersebut menggunakan bahasa yang menyinggung, kasar dan gaul (lu, gue, gk, kaga dll), tambahin kira kira dapet skor ATS berapa (secara objektif)? tambahin juga emoji biar makin kena mental. bikin judul/title contohnya (# Danang Si Paling ML Engineer 😌) output dalam bahasa Indonesia. diakhir tambahin Saran (Advice) apa aja yang harus diperbaiki`,
    });

    return NextResponse.json({ content: text }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    // Clean up: delete the temporary file if it was created
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (error) {
        console.error("Error deleting temporary file:", error);
      }
    }
  }
}
