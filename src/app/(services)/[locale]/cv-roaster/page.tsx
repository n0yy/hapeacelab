"use client";

import useSWR, { mutate } from "swr";
import UploadFile from "@/components/UploadFile";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslations } from "next-intl";
import AsideServices from "@/components/Aside";
import { useSession } from "next-auth/react";
import StreamingText from "@/components/StreamingText";
import { EosIconsThreeDotsLoading } from "@/components/Loading";

interface RoasterResponse {
  content: string;
  status: number;
}

interface EnhancedResponse {
  content: string;
  status: number;
}

export default function CVRoaster() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreamingFinished, setIsStreamingFinished] =
    useState<boolean>(false);
  const [isEnhancedStreamingFinished, setIsEnhancedStreamingFinished] =
    useState<boolean>(false);
  const { data: session } = useSession();
  const t = useTranslations("CVRoaster");
  const tAside = useTranslations("Aside");

  const { data, error } = useSWR<RoasterResponse>(
    file ? "/api/services/cv-roaster" : null
  );

  const { data: enhancedData, error: enhancedError } = useSWR<EnhancedResponse>(
    file ? "/api/services/enhance-cv" : null
  );

  const handleFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a file before submitting.");
      return;
    }

    if (!session?.user?.email) {
      alert("Please sign in to use this service.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userEmail", session.user.email);

    try {
      setIsLoading(true);
      const response = await fetch("/api/services/cv-roaster", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to process file: ${response.statusText}`);
      }

      const responseData = await response.json();
      mutate("/api/services/cv-roaster", responseData, false);
    } catch (error) {
      console.error("Error processing file: ", error);
      alert("Failed to process file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamingFinished = () => {
    setIsStreamingFinished(true);
  };

  const handleEnhancedStreamingFinished = () => {
    setIsEnhancedStreamingFinished(true);
  };

  const handleEnhanceCV = async () => {
    if (!data?.content) {
      alert("No CV content to enhance.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/services/enhance-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roastedText: data.content }),
      });

      if (!response.ok) {
        throw new Error(`Failed to enhance CV: ${response.statusText}`);
      }

      const enhancedCV = await response.json();
      mutate("/api/services/enhance-cv", enhancedCV, false);
    } catch (error) {
      console.error("Error enhancing CV: ", error);
      alert("Failed to enhance CV. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <title>CV Roaster</title>
      <AsideServices tAside={tAside} />
      <main className="prose-sm text-justify min-h-screen max-w-3xl mx-10 md:mx-auto md:mt-10 mb-10">
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
        {enhancedError && (
          <p className="text-red-500">
            Error enhancing CV: {enhancedError.message}
          </p>
        )}

        {isLoading && (
          <div className="text-center my-10 flex items-center justify-center space-x-1">
            <span>Processing</span> <EosIconsThreeDotsLoading />
          </div>
        )}

        {data && (
          <div className="mt-6">
            <StreamingText
              content={data.content}
              onStreamingComplete={handleStreamingFinished}
            />
          </div>
        )}

        {isStreamingFinished && !enhancedData && (
          <button
            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900 transition-colors"
            onClick={handleEnhanceCV}
          >
            Sini gua bantuin..
          </button>
        )}

        {enhancedData && (
          <div className="mt-6">
            <StreamingText
              content={enhancedData.content}
              onStreamingComplete={handleEnhancedStreamingFinished}
            />
          </div>
        )}
      </main>
    </>
  );
}
