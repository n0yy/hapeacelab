import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { roastedText } = body;

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const { text } = await generateText({
    model: google("gemini-1.5-pro"),
    prompt: `${roastedText}\n dari Informasi yang kamu dapatkan dari Text Roasting tersebut buatkan cv yang baik, benar, dan ATS score-nya bisa tembus 90/100. output berupa CV nya saja.`,
  });

  return NextResponse.json({ content: text }, { status: 200 });
}
