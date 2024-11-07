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
import describeIt from "@/lib/services/describe-it";
import { useTranslations } from "next-intl";
import AsideServices from "@/components/Aside";

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
  const [file, setFile] = useState<File | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [productName, setProductName] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [loadingContent, setLoadingContent] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const t = useTranslations("DescribeIt");
  const tAside = useTranslations("Aside");

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

    if (user?.user?.points < 10) {
      console.log(`User ${session?.user?.email} does not have enough points`);
      setShowAlert(true);
      return;
    }

    try {
      setContent(null);
      setLoadingContent(true);
      window.scrollTo({ top: 200, behavior: "smooth" });

      // Call describeIt with the file object directly
      if (session?.user?.email) {
        const res = await describeIt(
          file,
          productName,
          selectedLanguage,
          session?.user?.email
        );
        setContent(res);
      } else {
        alert("An error occurred. Please try again.");
      }

      // Update points only if successful
      if (session?.user?.email) {
        await updatePoints(session.user.email, 10);
        // Update local user data to reflect point change
        mutate(
          (prevUser: User | null) =>
            prevUser ? { ...prevUser, points: prevUser.points - 10 } : null,
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
      <title>DescribeIt</title>
      <AsideServices tAside={tAside} />
      <main className="prose text-justify min-h-screen max-w-3xl mx-10 md:mx-auto mt-10">
        {!content && (
          <>
            <h1 className="text-3xl font-semibold underline mb-2">
              {t("title")}
            </h1>
            <p>{t("description")}</p>
            <h5 className="text-lg mt-3">{t("warning.title")}</h5>
            <ul className="list-disc text-sm">
              <li>{t("warning.first")}</li>
              <li>{t("warning.second")}</li>
            </ul>
            <input
              type="text"
              name="name"
              id="name"
              placeholder={t("productName")}
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
              required
            >
              <option value="">{t("language")}</option>
              <option value="english">English</option>
              <option value="indonesian">Indonesian</option>
            </select>
            <UploadFile
              acceptedFile=".png,.jpeg,.webp,.heic,.heif"
              handleSubmit={handleSubmit}
              file={file}
              setFile={setFile}
              needPoints={t("points")}
              isPDF={false}
            />
          </>
        )}

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
