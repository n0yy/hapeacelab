import condenseIt from "@/lib/services/condense-it";
import { writeFile, mkdir, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get("file") as unknown as File;

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
    const filePath = join(uploadsDir, fileName);

    await writeFile(filePath, buffer);
    console.log(`File saved at: ${filePath}`);
    const content = await condenseIt(filePath);
    console.log(content);

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
