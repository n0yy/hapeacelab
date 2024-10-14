import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { unlink } from "fs/promises";
import { updatePoints } from "@/lib/services/firebase/users";
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
        ],
      }),
      prompt: `${extractedText}

      Instruksi:
      1. Roasting CV tersebut dengan gaya bahasa:
         - Menyinggung dan kasar
         - Gaul (contoh: lu, gue, gk, kaga, dll)
         - Gunakan emojis untuk memperkuat pesan 😈🔥💀
      
      2. Berikan skor ATS (Applicant Tracking System) secara objektif (skala 1-100)
      
      3. Buat judul/title dengan awalan "##" yang mencerminkan isi roasting
      
      4. Format output:
         ##[Judul Roasting]
      
         [Isi roasting]
      
         Skor ATS: [Nilai]/100 🤖
      
         Saran (Advice):
         - [Poin perbaikan 1]
         - [Poin perbaikan 2]
         - [Poin perbaikan 3]
      
      5. Seluruh output dalam Bahasa Indonesia`,
    });

    await updatePoints(userEmail, 70);
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
