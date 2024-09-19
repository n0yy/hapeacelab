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
    const email = formData.get("email") as string;

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

    const prompt = `First thing is analyze the file is a material given by the lecturer or not, if not give a response that the file is not a material given by the lecturer. Imagine your are a Professor. Create summary. Use Feynman Technique. create 5 related questions to sharpen insight. generate in ${language} for the output.
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

    // Store History
    await saveHistory(email, "lecturer-brief", {
      generated: text,
      language,
      file: uploadResponse.file,
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
