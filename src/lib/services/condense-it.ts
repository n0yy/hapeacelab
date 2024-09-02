import { model, fileManager } from "@/utils/genai";

export default async function condenseIt(filePath: string) {
  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: "application/pdf",
    displayName: "file.pdf",
  });

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    {
      text: `Buatkan rangkuman dari file tersebut tambahkan keywords dan key insights jika memungkinkan. Jika file berhubungan dengan ilmu matematika atau bidang yang berkaitan dengan hitung-hitungan, tambahkan rumus yang ada di file tersebut ke dalam rangkuman (latex), tambahkan pula penjelasan rumusnya. Tambahkan Emoji untuk setiap keywords dan key insights. generate dalam bahasa Indonesia dan gunakan gaya bahasa yang mudah dimengerti. 
    Output:
    - Judul (Gunakan judul asli)
    - Rangkuman
    - Keywords (jika keywords berbahasa inggris gunakan langsung jangan gunakan bahasa lain.)
    - Key Insights (jika keywords berbahasa inggris gunakan langsung jangan gunakan bahasa lain.)
    - Similar Articles or Paper (berisi artikel atau paper yang mirip dengan file tambahkan pula link url agar bisa dikunjungi.)
    `,
    },
  ]);

  return result.response.text();
}
