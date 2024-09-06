import { model, fileManager } from "@/utils/genai";

export default async function condenseIt(filePath: string) {
  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: "application/pdf",
    displayName: "file.pdf",
  });
  const prompt = `Let's think step-by-step. Buatkan rangkuman yang mudah dipahami disertai pernyataan tesis atau hasil dari penelitian tersebut yang dibungkus oleh tag span dengan className="bg-pink-300". Tambahkan keywords dan key insights jika memungkinkan. Tambahkan Emoji untuk setiap keywords dan key insights. generate dalam bahasa Indonesia dan gunakan gaya bahasa yang mudah dimengerti.
    Output:
    - Judul (Gunakan judul asli)
    - Rangkuman 
    - Keywords (jika keywords berbahasa inggris gunakan langsung jangan gunakan bahasa lain.)
    - Key Insights (jika keywords berbahasa inggris gunakan langsung jangan gunakan bahasa lain.)
    - Similar Articles or Paper (berisi artikel atau paper yang mirip dengan file)

    `;
  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    {
      text: prompt,
    },
  ]);
  return result.response.text();
}
