import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { unlink } from "fs/promises";
import { saveHistory } from "@/utils/firebase/history";
import parsePDF from "@/utils/parsePdf";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userEmail = formData.get("userEmail") as string;

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

    const extractedText = await parsePDF(buffer, file.name);

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
      prompt: `${extractedText}\nRoasting cv tersebut menggunakan bahasa yang menyinggung, kasar dan gaul (lu, gue, gk, kaga dll), tambahin kira kira dapet skor ATS berapa (secara objektif)? tambahin juga emoji biar makin kena mental. bikin judul/title dengan prefix ##. output dalam bahasa Indonesia. diakhir tambahin Saran (Advice) apa aja yang harus diperbaiki`,
    });

    await saveHistory(userEmail, "cv-roaster", {
      content: text,
      title: text.match(/##\s*(.*?)\n/)?.[1] || "Untitled",
      createdAt: Date.now(),
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
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (error) {
        console.error("Error deleting temporary file:", error);
      }
    }
  }
}
