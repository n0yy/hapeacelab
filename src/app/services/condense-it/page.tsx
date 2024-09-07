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

  const {
    data: user,
    error,
    mutate,
  } = useSWR<User | any>(
    session?.user?.email ? `/api/users/${session.user.email}` : null,
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

    if (user?.user?.points < 30) {
      console.log(`User ${session?.user?.email} does not have enough points`);
      setShowAlert(true);
      return;
    }

    try {
      setContent(null);
      setLoadingContent(true);
      window.scrollTo({ top: 200, behavior: "smooth" });

      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/condense-it", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to upload file");
      }

      const jsonResponse = await res.json();
      setContent(jsonResponse.text);

      // Update points only if successful
      if (session.user?.email) {
        await updatePoints(session.user.email, 30);
        // Update local user data to reflect point change
        mutate(
          (prevUser: User | null) =>
            prevUser ? { ...prevUser, points: prevUser.points - 30 } : null,
          false
        );
      }
    } catch (error: any) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoadingContent(false);
    }
  };

  if (error) return <div>Failed to load user data</div>;

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

        <UploadFile
          acceptedFile=".pdf"
          handleSubmit={handleSubmit}
          file={file}
          setFile={setFile}
          needPoints={30}
          isMultiple={false}
        />
        {showAlert && <AlertPoints />}
        {loadingContent && (
          <div className="text-center my-10">
            Thinking <EosIconsThreeDotsLoading />{" "}
          </div>
        )}
        {content && <GeneratedCard markdown={content} />}
      </main>
    </>
  );
}
