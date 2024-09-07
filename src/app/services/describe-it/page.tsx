"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
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

export default function DescribeIt() {
  const router = useRouter();
  const { data: session } = useSession();
  const [file, setFile] = useState<File>();
  const [content, setContent] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
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

    if (user?.user?.points < 10) {
      console.log(`User ${session?.user?.email} does not have enough points`);
      setShowAlert(true);
      return;
    }

    try {
      setContent(null);
      setLoadingContent(true);
      window.scrollTo({ top: 200, behavior: "smooth" });

      const data = new FormData();
      data.append("file", file);
      data.append("name", productName);
      data.append("language", selectedLanguage);

      const res = await fetch("/api/describe-it", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        throw new Error("Failed to upload file");
      }

      const jsonResponse = await res.json();
      setContent(jsonResponse.text);

      // Update points only if successful
      if (session?.user?.email) {
        await updatePoints(session.user.email, 10);
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
  console.log(`Content: ${content}`);
  return (
    <>
      <title>DescribeIt</title>
      <main className="prose text-justify min-h-screen max-w-3xl mx-10 md:mx-auto mt-32">
        <h1 className="text-3xl font-semibold underline mb-2">DescribeIt</h1>
        <p>
          Effortlessly generate product descriptions by simply uploading an
          image. DescribeIt streamlines the process for online sellers, making
          it easy to create compelling and accurate product descriptions in
          seconds.
        </p>
        <h5 className="text-lg mt-3">For best results:</h5>
        <ul className="list-disc ml-4 text-sm">
          <li>Rotate images to the correct orientation before uploading.</li>
          <li>Avoid blurry images.</li>
        </ul>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="rounded-lg w-full mt-10 bg-primary"
        />
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
          acceptedFile=".png,.jpeg,.webp,.heic,.heif"
          handleSubmit={handleSubmit}
          file={file}
          setFile={setFile}
          needPoints={10}
          isMultiple={true}
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
