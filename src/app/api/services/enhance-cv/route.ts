import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { roastedText, additionalPrompt, id } = body;

  const google = createGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const basePrompt = `
Kamu adalah seorang expert CV writer dengan pengalaman 15 tahun dalam berbagai industri.
Berikut ini adalah CV yang perlu dioptimalkan:

${roastedText}

Tugas:
1. Analisis CV ini dan fokuskan pada satu bidang yang paling menonjol
2. Buat ulang CV tersebut dalam bahasa Inggris dengan standar ATS-friendly yang bisa mencapai skor 90+
3. Berikan penjelasan perubahan dalam Bahasa Indonesia dengan gaya santai (pakai: lu, gue, gk, dll)

Panduan format:
1. Mulai dengan "💼 ENHANCED CV:" diikuti CV yang sudah dioptimalkan
2. Kemudian "🔍 PENJELASAN PERBAIKAN:" diikuti analisis santai tentang apa yang lu ubah dan kenapa

Informasi tambahan dari user: ${additionalPrompt}

Pastikan:
- Pakai action verbs yang impactful di setiap bullet point
- Setiap pengalaman ada metrics/achievement yang kuantitatif
- Skills yang disebutkan match dengan job descriptions di industri tersebut
- Formatting konsisten dan mudah dibaca
`;

  const { text } = await generateText({
    model: google("gemini-1.5-pro"),
    prompt: basePrompt,
  });

  return NextResponse.json({ content: text }, { status: 200 });
}
