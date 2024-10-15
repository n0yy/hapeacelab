"use client";

import useSWR, { mutate } from "swr";
import UploadFile from "@/components/UploadFile";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import AsideServices from "@/components/Aside";
import { useSession } from "next-auth/react";
import StreamingText from "@/components/StreamingText";
import { EosIconsThreeDotsLoading } from "@/components/Loading";
import { v4 as uuid } from "uuid";
import { updatePoints } from "@/lib/services/firebase/users";
import { FaPaperPlane } from "react-icons/fa";

export default function CVRoaster() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);
  const [additionalPrompt, setAdditionalPrompt] = useState<string>("");
  const [isLoadingEnhance, setIsLoadingEnhance] = useState<boolean>(false);
  const [displayedContent, setDisplayedContent] = useState<string | null>(null);
  const [isStreamingFinished, setIsStreamingFinished] =
    useState<boolean>(false);
  const [isEnhanced, setIsEnhanced] = useState<boolean>(false);
  const { data: session } = useSession();
  const t = useTranslations("CVRoaster");
  const tAside = useTranslations("Aside");

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

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }

    if ((session.user as any).points < 70) {
      alert("You do not have enough points to use this service.");
      return;
    }

    setId(uuid());

    const formData = new FormData();
    formData.append("file", file);
    formData.append("userEmail", session.user.email);
    if (id) {
      formData.append("uuid", id);
    }

    try {
      setDisplayedContent(null);
      setIsLoading(true);
      const response = await fetch("/api/services/cv-roaster", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to process file: ${response.statusText}`);
      }

      const responseData = await response.json();
      setIsStreamingFinished(false);
      setDisplayedContent(responseData.content);
      setIsEnhanced(false);
      mutate("/api/services/cv-roaster", responseData, false);
    } catch (error) {
      console.error("Error processing file: ", error);
      alert("Failed to process file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamingFinished = useCallback(() => {
    setIsStreamingFinished(true);
  }, []);

  const handleEnhancePrompt = () => {
    setShowPrompt(true);
  };

  const handleEnhanceCV = async () => {
    if (!displayedContent) {
      alert("No CV content to enhance. Please roast a CV first.");
      return;
    }

    if (!additionalPrompt.trim()) {
      alert("Please provide additional instructions for enhancing the CV.");
      return;
    }

    try {
      setDisplayedContent(null);
      setIsLoadingEnhance(true);
      setIsStreamingFinished(false);

      const response = await fetch("/api/services/enhance-cv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roastedText: displayedContent,
          additionalPrompt: additionalPrompt,
          uuid: id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to enhance CV: ${response.statusText}`);
      }

      const enhancedCV = await response.json();

      if (session?.user?.email) {
        await updatePoints(session.user.email, 70);
      }

      setDisplayedContent(enhancedCV.content);
      setIsEnhanced(true);
      setShowPrompt(false);
      mutate("/api/services/enhance-cv", enhancedCV, false);
    } catch (error) {
      console.error("Error enhancing CV: ", error);
      alert(`Failed to enhance CV: ${error}`);
    } finally {
      setIsLoadingEnhance(false);
      setIsStreamingFinished(true);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [additionalPrompt]);

  return (
    <>
      <title>CV Roaster</title>
      <AsideServices tAside={tAside} />
      <main className="prose-sm md:prose text-justify min-h-screen max-w-3xl mx-10 md:mx-auto md:mt-10 mb-10">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-5">{t("title")}</h1>
          <p>{t("description")}</p>
        </div>
        <UploadFile
          acceptedFile=".pdf"
          handleSubmit={handleFile}
          file={file}
          setFile={setFile}
          needPoints={t("points")}
          isPDF
        />

        {(isLoading || isLoadingEnhance) && (
          <div className="text-center my-10 flex items-center justify-center space-x-1">
            <span>{isLoadingEnhance ? "Bentar, mikir dulu" : "Hhmmm"}</span>
            <EosIconsThreeDotsLoading />
          </div>
        )}

        {displayedContent && (
          <div className="mt-6">
            <StreamingText
              content={displayedContent}
              onStreamingComplete={handleStreamingFinished}
            />
          </div>
        )}

        {isStreamingFinished && !isEnhanced && (
          <div className="mt-4">
            {!showPrompt ? (
              <button
                className="text-black underline"
                onClick={handleEnhancePrompt}
              >
                Sini gua bantuin..
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  className="w-full px-4 py-2 min-h-[40px] max-h-[200px] border-gray-600 focus:outline-none focus:border-gray-500 pr-12 rounded-lg"
                  placeholder="Apa yang mau ditambahin bree?"
                  value={additionalPrompt}
                  onChange={(e) => {
                    setAdditionalPrompt(e.target.value);
                    if (textareaRef.current) {
                      textareaRef.current.style.height = "auto";
                      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                    }
                  }}
                ></textarea>
                <button
                  className="bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg p-2.5 text-white hover:text-white "
                  onClick={handleEnhanceCV}
                >
                  <FaPaperPlane size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
