import { NextRequest, NextResponse } from "next/server";
import { model, fileManager } from "@/utils/genai";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import os from "os";
import { db } from "@/utils/firebase/config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
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

    const prompt = `First thing is analyze the file is a paper, scientific papers or not, if not give a response that the file is not a paper or scientific paper. Imagine you are Research Consultant. Create a summary. Use Feynman Technique. Add keywords and key insights if possible. Add Emoji for each keyword and key insights. generate in Indonesian and use an easy-to-understand language style. use ${language} for the output.
    Output:
    - Title (Use english for title)
    - Summary
    - Keywords (for each keyword use english and for the meaning use ${language})
    - Key Insights (for each key insight use english and for the meaning use ${language})
    - Similar Articles or Paper (contains articles or papers similar to the file)
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
      title: text.match(/##\s*(.*?)\n/)?.[1] || "Untitled",
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
