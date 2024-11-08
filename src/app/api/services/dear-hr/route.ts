import { NextRequest, NextResponse } from "next/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { unlink, writeFile } from "fs/promises";
import { saveHistory } from "@/utils/firebase/history";
import { readFile, readFileSync } from "fs";
import os from "os";
import { join } from "path";

export async function POST(req: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const formData = await req.formData();
    const fileResume = formData.get("file") as File;
    const jobDesc = formData.get("jobDesc") as string;
    const userEmail = formData.get("userEmail") as string;

    // Validation 1
    if (!fileResume) {
      return NextResponse.json({
        message: "No file uploaded",
        status: 400,
      });
    }

    // Validation 2
    const mimeType = fileResume.type;
    if (mimeType !== "application/pdf") {
      return NextResponse.json({
        message: "Only PDF files are supported",
        status: 400,
      });
    }

    const arrayBuffer = await fileResume.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    tempFilePath = join(os.tmpdir(), fileResume.name);
    await writeFile(tempFilePath, buffer);

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const preamble = `You are a professional cover letter writer with expertise in both English and Bahasa Indonesia. Your task is to:
    1. Carefully analyze the provided resume and job description
    2. Create personalized cover letters that align candidate's experience with the specific job requirements
    3. Maintain professional tone while showing genuine interest
    4. Ensure proper formatting and language accuracy
    5. Demonstrate clear understanding of the company's needs and position requirements
    
    Guidelines for cover letter creation:
    - Keep length between 300-400 words
    - Include specific achievements from resume that match job requirements
    - Maintain formal business letter tone
    - Ensure proper grammar and punctuation
    - Focus on relevancy between candidate's experience and job description`;

    const prompt = `
    ${preamble}

    Using the provided resume and following job description:

    ${jobDesc}

    Create two versions of a personalized cover letter in the following JSON format:

    {{
        "indonesia": {{
            "subject": "Surat Lamaran untuk Posisi [Extract position from job desc]",
            "salutation": "",
            "opening_paragraph": "",
            "body_paragraphs": [],
            "closing_paragraph": "",
            "signature": ""
        }},
        "english": {{
            "subject": "Application for [Extract position from job desc] Position",
            "salutation": "",
            "opening_paragraph": "",
            "body_paragraphs": [],
            "closing_paragraph": "",
            "signature": ""
        }}
    }}

    Ensure each cover letter:
    1. References specific requirements and qualifications from the provided job description
    2. Aligns candidate's experience with the company's stated needs
    3. Shows understanding of the company's mission as described in the job posting
    4. Highlights relevant achievements and skills from the resume that match the job requirements`;

    const { text } = await generateText({
      model: google("gemini-1.5-flash-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "file",
              data: readFileSync(tempFilePath),
              mimeType: "application/pdf",
            },
          ],
        },
      ],
    });

    // await saveHistory(userEmail, "dear-hr", {
    //     content: text,
    //     title: JSON.stringify({

    //     }),
    //     type: "dear-hr"
    // })
    return NextResponse.json({
      content: text.replace(/```json\n|\n```/g, "").trim(),
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (error) {
        console.error("Error deleting temporary file:", error);
      }
    }
  }
}
