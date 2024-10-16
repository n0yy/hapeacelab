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

    const prompt = `Anda adalah seorang Konsultan Penelitian ahli. Tugas Anda adalah membuat ringkasan penelitian menggunakan Teknik Feynman. Gunakan bahasa Indonesia yang mudah dipahami untuk ringkasan. Gunakan ${language} untuk output akhir.

Instruksi:
1. Buat ringkasan penelitian menggunakan Teknik Feynman (jelaskan seolah-olah kepada anak berusia 12 tahun)
2. Identifikasi kata kunci dan wawasan utama
3. Tambahkan emoji yang sesuai untuk setiap kata kunci dan wawasan utama
4. Cari artikel atau makalah serupa yang tersedia online

Format Output (dalam Markdown):

# [Judul ringkas dan deskriptif dalam bahasa Inggris]

## Summary (in ${language})

[Ringkasan penelitian menggunakan Teknik Feynman, dalam bahasa yang mudah dipahami]

## Keywords

- [Kata kunci dalam bahasa Inggris]: [Arti dalam ${language}] 🔑
- [Kata kunci dalam bahasa Inggris]: [Arti dalam ${language}] 🔑
- [Lanjutkan sesuai kebutuhan]

## Key Insights

- [Wawasan utama dalam bahasa Inggris]: [Arti dalam ${language}] 💡
- [Wawasan utama dalam bahasa Inggris]: [Arti dalam ${language}] 💡
- [Lanjutkan sesuai kebutuhan]

## Similar Articles or Papers
contoh outputnya harus seperti: **[Judul artikel/makalah 1](Link)**
- [Judul artikel/makalah 1](Link)
- [Judul artikel/makalah 2](Link)
- [Judul artikel/makalah 3](Link)
- [Judul artikel/makalah N](Link)

Catatan: Pastikan semua artikel atau makalah yang disebutkan tersedia online dan berikan tautan langsung ke sumbernya. Semua output harus dalam format Markdown untuk dirender menggunakan react-markdown.`;

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
