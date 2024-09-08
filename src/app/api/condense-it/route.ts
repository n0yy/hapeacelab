import { model } from "@/utils/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileData, language, mimeType, fileName } = body;

    if (mimeType !== "application/pdf") {
      throw new Error("Only PDF files are supported");
    }

    const decodedFileData = Buffer.from(fileData, "base64").toString("utf-8");

    const prompt = `Let's think step-by-step. Create an easy-to-understand summary with a thesis statement or the results of the research wrapped in a span tag with className="bg-pink-300". Add keywords and key insights if possible. Add Emoji for each keyword and key insights. generate in Indonesian and use an easy-to-understand language style.
    Output:
    - Title (Use the original title)
    - Summary
    - Keywords (if keywords are in English, use them directly, don't use other languages.)
    - Key Insights (if keywords are in English, use them directly, don't use other languages.)
    - Similar Articles or Paper (contains articles or papers similar to the file)

    outputs in ${language}

    The content of the PDF file "${fileName}" is as follows:

    ${decodedFileData}
    `;

    const result = await model.generateContent([prompt]);
    const text = result.response.text();
    return NextResponse.json({ success: true, text });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error processing file",
      },
      { status: 500 }
    );
  }
}
