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

  const prompt = `Produk Name: ${nameProduct}. You are a marketing expert, especially in copywriting, to create attractive product descriptions. you have task: Analyze first whether the image is a product or not. If yes, create a product description based on existing information and create product details based on images. If not, give a warning that the image is not a product. Create a description that is friendly and good for SEO. Use ${language} for the outputs and use daily language to make it more friendly. add emoji to make it look cute`;

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
