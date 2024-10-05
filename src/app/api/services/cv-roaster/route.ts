import { NextRequest, NextResponse } from "next/server";
import formidable, { Files, Fields } from "formidable";
import fs from "fs";
import pdfParse from "pdf-parse";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { join } from "path";
import os from "os";
import { writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({
        status: 400,
        message: "No file uploaded",
      });
    }

    const mimeType = file.type;
    if (mimeType !== "application/pdf") {
      return NextResponse.json({
        status: 400,
        message: "Only PDF files are supported",
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    tempFilePath = join(os.tmpdir(), file.name);
    await writeFile(tempFilePath, buffer);

    const fileBuffer = fs.readFileSync(tempFilePath);
    const data = await pdfParse(fileBuffer);
    const extractedText = data.text;

    const google = createGoogleGenerativeAI({
      apiKey: process.env.FINE_TUNED_API_KEY,
    });

    const model = google("tunedModels/cvroaster003-z387o9vncddi", {
      safetySettings: [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      ],
    });

    const { text } = await generateText({
      model,
      prompt: extractedText,
    });

    return NextResponse.json({
      status: 200,
      content: text,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
