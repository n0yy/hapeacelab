import { model } from "@/utils/genai";
import { NextRequest, NextResponse } from "next/server";

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
    const { fileData, mimeType, productName, language } = body;

    const prompt = `Product Name: ${productName}. You are a marketing expert, especially in copywriting, to create attractive product descriptions. Your task: Analyze first whether the image is a product or not. If yes, create a product description based on existing information and create product details based on images. If not, give a warning that the image is not a product. Create a description that is friendly and good for SEO. Use ${language} for the outputs and use daily language to make it more friendly. Add emoji to make it look cute`;

    const imagePart = fileToGenerativePart(fileData, mimeType);

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
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
  }
}
