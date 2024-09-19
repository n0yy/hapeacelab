"use client";

import { useState } from "react";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GeneratedCard from "@/components/GeneratedCard";
import { updatePoints } from "@/lib/services/firebase/users";
import UploadFile from "@/components/UploadFile";
import AlertPoints from "@/components/AlertPoints";
import { EosIconsThreeDotsLoading } from "@/components/Loading";

interface User {
  fullName: string;
  email: string;
  type: string;
  points: number;
  createdAt: Date;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CondenseIt() {
  const router = useRouter();
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  const {
    data: user,
    error,
    mutate,
  } = useSWR<User | any>(
    session?.user?.email
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/users/${session.user.email}`
      : null,
    fetcher
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session) {
      router.push("/login");
      return;
    }

    if (!file) {
      alert("No File Uploaded");
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    if (user?.user?.points < 30) {
      console.log(`User ${session?.user?.email} does not have enough points`);
      setShowAlert(true);
      return;
    }

    try {
      setContent(null);
      setLoadingContent(true);
      window.scrollTo({ top: 200, behavior: "smooth" });

      // Create FormData
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", selectedLanguage);
      formData.append("userEmail", session?.user?.email ?? "");

      // Send file directly to API route
      const response = await fetch("/api/services/condense-it", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setContent(result.text);

      // Update points only if successful
      if (session?.user?.email) {
        await updatePoints(session?.user?.email, 30);
        mutate(
          (prevUser: User | null) =>
            prevUser ? { ...prevUser, points: prevUser.points - 30 } : null,
          false
        );
      }
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "An unknown error occurred. Please try again."
      );
    } finally {
      setLoadingContent(false);
    }
  };

  if (error) return <div>Failed to load user data</div>;
  console.log(`Content: ${content}`);
  return (
    <>
      <title>CondenseIt</title>
      <main className="prose text-justify min-h-screen max-w-3xl mx-10 md:mx-auto mt-10">
        <h1 className="text-3xl font-semibold underline mb-2">CondenseIt</h1>
        <p>
          Quickly distill the essential points from any paper. CondenseIt
          simplifies the process of summarizing long-form content, making it
          ideal for students, researchers, and professionals who need concise,
          clear summaries in seconds.
        </p>
        <select
          name="language"
          id="language"
          className="w-full rounded-lg mt-3 bg-primary text-slate-800"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          <option value="">Select output language</option>
          <option value="english">English</option>
          <option value="indonesian">Indonesian</option>
          <option value="korean">Korean</option>
          <option value="japanese">Japanese</option>
          <option value="Sundanese">Sunda</option>
          <option value="Javanese">Wa jawa ettt jawa</option>
        </select>
        <UploadFile
          acceptedFile=".pdf"
          handleSubmit={handleSubmit}
          file={file}
          setFile={setFile}
          needPoints={30}
          isPDF={true}
        />

        {showAlert && <AlertPoints />}
        {loadingContent && (
          <div className="text-center my-10 flex items-center space-x-1">
            <span>Thinking</span> <EosIconsThreeDotsLoading />
          </div>
        )}
        {content && <GeneratedCard markdown={content} />}
      </main>
    </>
  );
}
