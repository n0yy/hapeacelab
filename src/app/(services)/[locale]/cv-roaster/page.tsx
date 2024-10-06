"use client";

import useSWR, { mutate } from "swr";
import UploadFile from "@/components/UploadFile";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Loading from "../loading";
import { useTranslations } from "next-intl";
import AsideServices from "@/components/Aside";

interface RoasterResponse {
  content: string;
  status: number;
}

export default function CVRoaster() {
  const [file, setFile] = useState<File | null>(null);
  const t = useTranslations("CVRoaster");
  const tAside = useTranslations("Aside");
  const { data, isLoading, error } = useSWR<RoasterResponse>(
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
      <AsideServices tAside={tAside} />
      <main className="prose-sm text-justify min-h-screen max-w-3xl mx-10 md:mx-auto md:mt-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-5">{t("title")}</h1>
          <ReactMarkdown>{t("description")}</ReactMarkdown>
        </div>
        <UploadFile
          acceptedFile=".pdf"
          handleSubmit={handleFile}
          file={file}
          setFile={setFile}
          needPoints={t("points")}
          isPDF
        />

        {error && <p className="text-red-500">Error: {error.message}</p>}

        {isLoading && <Loading />}
        {data && <ReactMarkdown>{data.content}</ReactMarkdown>}
      </main>
    </>
  );
}
