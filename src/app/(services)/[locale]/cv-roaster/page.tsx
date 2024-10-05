"use client";

import useSWR, { mutate } from "swr";
import UploadFile from "@/components/UploadFile";
import { useState } from "react";
import AsideServices from "@/components/Aside";

interface RoasterResponse {
  content: string;
  status: number;
}

export default function CVRoaster() {
  const [file, setFile] = useState<File | null>(null);

  const { data, error } = useSWR<RoasterResponse>(
    file ? "/api/services/cv-roaster" : null,
    null
  );

  const handleFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/services/cv-roaster", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process file");
      }

      const responseData = await response.json();

      // Update the SWR cache with the new data
      mutate("/api/services/cv-roaster", responseData, false);
    } catch (error) {
      console.error("Error processing file: ", error);
    }
  };

  return (
    <>
      <title>CV Roaster</title>
      <main className="prose-sm text-justify min-h-screen max-w-3xl mx-10 md:mx-auto md:mt-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-5">CV Roaster</h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nobis
            reiciendis rem mollitia tenetur vitae facere earum nemo, veritatis
            culpa magnam?
          </p>
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iusto,
            recusandae.
          </p>
        </div>
        <UploadFile
          acceptedFile=".pdf"
          handleSubmit={handleFile}
          file={file}
          setFile={setFile}
          needPoints="70"
          isPDF
        />

        {error && <p className="text-red-500">Error: {error.message}</p>}
        {data && <div className="mt-4">{data.content}</div>}
      </main>
    </>
  );
}
