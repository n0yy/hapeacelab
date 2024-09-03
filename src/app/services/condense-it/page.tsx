"use client";

import { useState } from "react";
import GeneratedCard from "@/components/GeneratedCard";

interface Content {
  text: string;
}

export default function CondenseIt() {
  const [file, setFile] = useState<File>();
  const [content, setContent] = useState<Content | null>(null);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!file) {
        throw new Error("No file uploaded");
      }

      const data = new FormData();
      data.set("file", file);

      setLoadingContent(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to upload file");
      } else {
        setContent(await res.json());
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoadingContent(false);
    }
  };

  return (
    <>
      <title>CondenseIt</title>
      <main className="min-h-screen max-w-3xl mx-10 md:mx-auto mt-20 md:mt-32">
        <h1 className="text-3xl font-semibold underline mb-2">CondenseIt</h1>
        <p>
          Quickly distill the essential points from any paper. CondenseIt
          simplifies the process of summarizing long-form content, making it
          ideal for students, researchers, and professionals who need concise,
          clear summaries in seconds.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center w-full mt-5"
        >
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-[1px] border-gray-500 rounded-lg cursor-pointer"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-700"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-700">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-700">
                {file ? file.name : "PDF, DOCX Only"}
              </p>
            </div>
            <input
              id="dropzone-file"
              name="file"
              type="file"
              accept=".pdf,.docx"
              className="hidden"
              required
              onChange={(e) => setFile(e.target.files?.[0])}
            />
          </label>
          <input
            className="block w-40 mx-auto py-2 bg-slate-800 text-white rounded mt-5 hover:bg-primary hover:border border-slate-700 hover:text-slate-700 transition-all duration-200"
            type="submit"
            value="Go!"
          />
        </form>
      </main>
      {loadingContent && <div className="text-center mb-10">Loading ...</div>}
      {content && <GeneratedCard markdown={content?.text} />}
    </>
  );
}
