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
    prompt: `${roastedText}\n Anggaplah kamu adalah orang tersebut. Tugas kamu adalah membuat ulang CV tersebut yang sangat baik dan bisa mencapai score ATS-nya 90++. kamu dibolehkan mengisi data dummy yang relevan untuk membuat CV tersebut. jika terdapat beberapa bidang fokuskan kesalah satu bidang saja. CV dalam bahasa Inggris dan sisanya gunakan Bahasa Indonesia dengan gaya bahasa sehari-hari (lu, gue, gk, dll).`,
  });

  return NextResponse.json({ content: text }, { status: 200 });
}
