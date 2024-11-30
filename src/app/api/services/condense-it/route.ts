import { NextRequest, NextResponse } from "next/server";
import { model, fileManager } from "@/utils/genai";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";
import { saveHistory } from "@/utils/firebase/history";

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const language = formData.get("language") as string;
    const userEmail = formData.get("userEmail") as string;

    if (!file) {
      throw new Error("No file uploaded");
    }

    const mimeType = file.type;
    if (mimeType !== "application/pdf") {
      throw new Error("Only PDF files are supported");
    }

    // Create a temporary file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    tempFilePath = join(os.tmpdir(), file.name);
    await writeFile(tempFilePath, buffer);

    // Upload the file to Google File Manager
    const uploadResponse = await fileManager.uploadFile(tempFilePath, {
      mimeType: mimeType,
      displayName: file.name,
    });

    const prompt = `Anda adalah seorang Konsultan Penelitian ahli. Tugas Anda adalah membuat ringkasan penelitian dalam bahasa ${language}.

Instruksi:
1. Buat ringkasan penelitian dalam bahasa ${language}:
   - Rumusan masalah yang diteliti
   - Tujuan penelitian
   - Metode yang digunakan untuk menyelesaikan masalah
   - Hasil penelitian
2. Identifikasi kata kunci dan wawasan utama dalam bahasa ${language}
3. Tambahkan emoji yang sesuai untuk setiap kata kunci dan wawasan utama
4. Cari artikel atau makalah serupa yang tersedia online

Format Output (dalam Markdown):
# [Judul ringkas dan deskriptif penelitian]

### 🤔 Rumusan Masalah
[Jelaskan masalah yang diteliti dengan bahasa ${language} yang sederhana dan mudah dipahami]

### 🎯 Tujuan Penelitian
[Jelaskan tujuan penelitian dengan bahasa ${language} yang jelas dan langsung]

### 🔬 Metode Penelitian
[Jelaskan metode yang digunakan dengan bahasa ${language} yang sistematis]

### ✨ Hasil Penelitian
[Paparkan hasil penelitian dengan bahasa ${language} yang mudah dimengerti]

## Kata Kunci
- [Kata kunci dalam bahasa Inggris]: [Arti dalam bahasa ${language}] 🔑
- [Lanjutkan sesuai kebutuhan]

## Wawasan Utama
- [Wawasan utama dalam bahasa Inggris]: [Arti dalam bahasa ${language}] 💡
- [Lanjutkan sesuai kebutuhan]

## Artikel atau Makalah Serupa
- [Judul artikel/makalah 1](Link)
- [Lanjutkan sesuai kebutuhan]

Catatan Penting:
- Seluruh output menggunakan bahasa ${language}
- Gunakan bahasa yang sederhana dan mudah dipahami, seolah menjelaskan kepada anak usia 12 tahun
- Pastikan artikel/makalah yang disebutkan tersedia online dengan tautan langsung
- Format dalam Markdown untuk rendering react-markdown
`;

    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri,
        },
      },
      { text: prompt },
    ]);

    const text = result.response.text();

    // Store the result in Firestore
    await saveHistory(userEmail, "condense-it", {
      content: text,
      language,
      fileName: file.name,
      title: text.match(/#\s*(.*?)\n/)?.[1] || "Untitled",
    });

    return NextResponse.json({ success: true, text });
  } catch (error: any) {
    if (error.message.includes("SAFETY")) {
      return NextResponse.json({
        success: false,
        error:
          "File content was blocked due to SAFETY. Please try again or try to another file.",
      });
    } else {
      return NextResponse.json({
        success: false,
        error: "Error processing file",
      });
    }
  } finally {
    // Clean up: delete the temporary file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (unlinkError) {
        console.error("Error deleting temporary file:", unlinkError);
      }
    }
  }
}
