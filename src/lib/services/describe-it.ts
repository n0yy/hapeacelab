import { model, fileManager } from "@/utils/genai";

export default async function describeIt(
  filePath: string,
  extension: string,
  nameProduct: string,
  language: string
) {
  const uploadRes = await fileManager.uploadFile(filePath, {
    mimeType: `image/${extension}`,
    displayName: `${nameProduct}.${extension}`,
  });

  const prompt = `Nama produk: ${nameProduct}. buatkan deskripsi produk berdasarkan informasi yang ada dan buatkan detail produk berdasarkan gambar. Buatkan deskripsi yang friendly dan baik untuk SEO. Gunakan bahasa ${language} dan gunakan gaya bahasa sehari-hari agar lebih friendly. tambahkan emoji agar terlihat lucu`;

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadRes.file.mimeType,
        fileUri: uploadRes.file.uri,
      },
    },
    {
      text: prompt,
    },
  ]);

  return result.response.text();
}
