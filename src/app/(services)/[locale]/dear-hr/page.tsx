"use client";

import AsideServices from "@/components/Aside";
import UploadFile from "@/components/UploadFile";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import AlertPoints from "@/components/AlertPoints";
import { updatePoints } from "@/lib/services/firebase/users";
import { mutate } from "swr";
import CoverLetterDisplay from "@/components/CoverLetterSection";
import Loading from "../loading";
import GeneratedCard from "@/components/GeneratedCard";
import CoverLetterSkeleton from "@/components/CoverLetterSkeleton";

export default function DearHR() {
  const tAside = useTranslations("Aside");
  const [showSection, setShowSection] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState<string | null>(null);
  const [displayedContent, setDisplayedContent] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [id, setId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session } = useSession();

  const handleFile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      alert("Please upload a file before submitting.");
      return;
    }

    if (!session?.user?.email) {
      alert("Please sign in to use this service.");
      return;
    }

    if ((session.user as any).points < 50) {
      setShowAlert(true);
      setFile(null);
      return;
    }

    const newId = uuid();
    setId(newId);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDesc", jobDesc || "");
    formData.append("userEmail", session.user.email);
    formData.append("uuid", newId);

    try {
      setDisplayedContent(null);
      setIsLoading(true);
      setShowSection(false);

      const response = await fetch("/api/services/dear-hr", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      if (!responseData.error) {
        await updatePoints(session.user.email, 50);
      }
      setDisplayedContent(responseData.content);
      mutate("/api/services/dear-hr", responseData, false);
    } catch (error) {
      console.error("Error processing file: ", error);
      setError("Failed to process file. Please try again.");
      setShowSection(true); // Show the upload section again on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowSection(true);
    setDisplayedContent(null);
    setError(null);
    setFile(null);
    setJobDesc(null);
  };

  return (
    <>
      <title>Dear HR</title>
      <AsideServices tAside={tAside} />
      <main className="prose text-justify min-h-screen max-w-3xl mx-10 md:mx-auto md:mt-10 mb-10">
        {showSection && (
          <>
            <h1>Dear HR</h1>
            <p className="-mt-5 mb-10">
              Dear HR adalah fitur dari HLab yang bikin cover letter jadi
              gampang banget. Lu tinggal masukin{" "}
              <span className="font-semibold underline">
                Job Description sama CV (Resume)
              </span>{" "}
              lu, dan fitur ini{" "}
              <span className="font-semibold underline">
                bakal nyusun cover letter yang sesuai
              </span>
              , biar cocok sama posisi yang lu incar. Nggak perlu pusing mikirin
              kata-kata formal lagi, Dear HR bantu lu dapet kesan pertama yang
              profesional dan tepat sasaran!
            </p>
            <div>
              <textarea
                name="jobDesc"
                id="jobDesc"
                className="bg-primary rounded-lg border border-slate-400 p-2 text-sm w-full block"
                placeholder="Job Description..."
                onChange={(e) => setJobDesc(e.target.value)}
                value={jobDesc || ""}
              />
              <UploadFile
                acceptedFile=".pdf"
                needPoints="Lu butuh 50 poin"
                isPDF
                handleSubmit={handleFile}
                file={file}
                setFile={setFile}
              />
            </div>
          </>
        )}

        {showAlert && <AlertPoints />}
        {isLoading && <CoverLetterSkeleton />}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mt-4">
            {error}
            <button
              onClick={handleReset}
              className="ml-4 text-sm underline hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {displayedContent && !error && (
          <CoverLetterDisplay content={displayedContent} />
        )}
      </main>
    </>
  );
}
