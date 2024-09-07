import describeIt from "@/lib/services/describe-it";
import { writeFile, mkdir, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid request method",
      },
      { status: 405 }
    );
  }

  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;
  const name: string | null = data.get("name") as unknown as string;
  const language: string | null = data.get("language") as unknown as string;

  if (!file) {
    return NextResponse.json({ success: false, error: "No file uploaded" });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const fileName = file.name;
    const extension = fileName.split(".").pop() ?? "";
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, buffer);
    const content = await describeIt(filePath, extension, name, language);

    await unlink(filePath);
    return NextResponse.json({ success: true, text: content });
  } catch (error) {
    console.error("Error processing file:", error);
    return NextResponse.json({
      success: false,
      error: "Error processing file",
    });
  }
}
