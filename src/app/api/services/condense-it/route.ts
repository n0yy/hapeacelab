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

    const prompt = `Anda adalah seorang Konsultan Penelitian ahli. Tugas Anda adalah membuat ringkasan penelitian. Gunakan bahasa Indonesia yang mudah dipahami untuk ringkasan. Gunakan ${language} untuk output akhir.

Instruksi:
1. Buat ringkasan penelitian:
   - Rumusan masalah yang diteliti
   - Tujuan penelitian
   - Metode yang digunakan untuk menyelesaikan masalah
   - Hasil penelitian
2. Identifikasi kata kunci dan wawasan utama
3. Tambahkan emoji yang sesuai untuk setiap kata kunci dan wawasan utama
4. Cari artikel atau makalah serupa yang tersedia online

Format Output (dalam Markdown):
# [Judul ringkas dan deskriptif penelitian]

### 🤔 Rumusan Masalah [gunakan bahasa ${language}]
[Jelaskan masalah yang diteliti dengan bahasa sederhana. gunakan  bahasa ${language}] 

### 🎯 Tujuan Penelitian [gunakan bahasa ${language}]
[Jelaskan tujuan penelitian dengan bahasa sederhana. gunakan  bahasa ${language}]

### 🔬 Metode Penelitian [gunakan bahasa ${language}]
[Jelaskan metode yang digunakan dengan bahasa sederhana. gunakan  bahasa ${language}]

### ✨ Hasil Penelitian [gunakan bahasa ${language}]
[Jelaskan hasil penelitian dengan bahasa sederhana. gunakan  bahasa ${language}]

## Keywords
- [Kata kunci dalam bahasa Inggris]: [Arti dalam ${language}] 🔑
- [Kata kunci dalam bahasa Inggris]: [Arti dalam ${language}] 🔑
- [Lanjutkan sesuai kebutuhan]

## Key Insights
- [Wawasan utama dalam bahasa Inggris]: [Arti dalam ${language}] 💡
- [Wawasan utama dalam bahasa Inggris]: [Arti dalam ${language}] 💡
- [Lanjutkan sesuai kebutuhan]

## Similar Articles or Papers
- [Judul artikel/makalah 1](Link)
- [Judul artikel/makalah 2](Link)
- [Judul artikel/makalah 3](Link)
- [Judul artikel/makalah N](Link)

Catatan: 
- Pastikan semua artikel atau makalah yang disebutkan tersedia online dan berikan tautan langsung ke sumbernya
- Semua output harus dalam format Markdown untuk dirender menggunakan react-markdown
- Gunakan bahasa yang mudah dipahami seperti menjelaskan kepada anak usia 12 tahun
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
