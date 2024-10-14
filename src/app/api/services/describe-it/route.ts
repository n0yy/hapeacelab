import { saveHistory } from "@/utils/firebase/history";
import { model } from "@/utils/genai";
import { NextRequest, NextResponse } from "next/server";
import { title } from "process";

function fileToGenerativePart(base64Data: string, mimeType: string) {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileData, mimeType, productName, language, userEmail } = body;

    const prompt = `Anda adalah seorang ahli pemasaran dengan keahlian khusus dalam copywriting untuk deskripsi produk yang menarik. 

Produk: ${productName}

Tugas Anda:
1. Analisis gambar yang diberikan:
   - Tentukan apakah gambar tersebut menampilkan sebuah produk atau bukan.

2. Jika gambar menampilkan produk:
   a. Buat deskripsi produk berdasarkan informasi yang ada.
   b. Rincikan detail produk berdasarkan apa yang terlihat dalam gambar.
   c. Pastikan deskripsi ramah pengguna dan optimal untuk SEO.
   d. Gunakan bahasa sehari-hari yang mudah dipahami.
   e. Sisipkan emoji yang sesuai untuk memberi kesan lucu dan menarik.

3. Jika gambar bukan produk:
   - Berikan peringatan bahwa gambar tersebut bukan produk.

Format Output (dalam ${language}):

Jika gambar adalah produk:
🏷️ Nama Produk: [Nama Produk]

📸 Analisis Gambar:
[Deskripsi singkat tentang apa yang terlihat dalam gambar]

✨ Deskripsi Produk:
[Deskripsi produk yang menarik, ramah pengguna, dan optimal untuk SEO]

🔍 Detail Produk:
- [Detail 1] 📌
- [Detail 2] 📌
- [Detail 3] 📌
[Tambahkan detail lain sesuai kebutuhan]

💡 Keunggulan Produk:
- [Keunggulan 1] 🌟
- [Keunggulan 2] 🌟
- [Keunggulan 3] 🌟
[Tambahkan keunggulan lain sesuai kebutuhan]

Jika gambar bukan produk:
⚠️ Peringatan: Gambar yang diunggah bukan merupakan gambar produk. 
[Tambahkan deskripsi singkat tentang apa yang terlihat dalam gambar]

Catatan: Gunakan bahasa ${language} untuk seluruh output. Pastikan untuk menggunakan bahasa sehari-hari yang ramah dan mudah dipahami.`;

    const imagePart = fileToGenerativePart(fileData, mimeType);

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    const cleanText = text.replace(/^[\s\S]*?(?=##)/, "");

    await saveHistory(userEmail, "describe-it", {
      content: cleanText,
      language,
      title: productName,
    });

    return NextResponse.json({ success: true, cleanText });
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
  }
}
