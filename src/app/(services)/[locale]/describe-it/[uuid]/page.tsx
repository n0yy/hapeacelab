"use client";

import AsideServices from "@/components/Aside";
import { getHistory } from "@/utils/firebase/history";
import { ClipboardWithIcon, ClipboardWithIconText } from "flowbite-react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function HistoryDetail({
  params: { uuid },
}: {
  params: { uuid: string };
}) {
  const [history, setHistory] = useState<any>(null);
  const { data: session, status } = useSession();
  const tAside = useTranslations("Aside");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchHistory = async () => {
        try {
          const historyData = await getHistory(
            session?.user?.email ?? "",
            "describe-it",
            uuid
          );
          setHistory(historyData);
        } catch (error) {
          console.error("Error fetching history:", error);
          setHistory(null);
        }
      };

      fetchHistory();
    }
  }, [session, uuid, status]);

  return (
    <>
      <title>{history?.title ? "HLab - " + history.title : "HLab"}</title>
      <AsideServices tAside={tAside} />
      <div className=" flex flex-col items-center justify-center min-h-screen mt-16 my-16 mx-10 md:mx-0">
        {history ? (
          <div className="flex flex-col">
            <ReactMarkdown className="prose-sm md:prose flex flex-col mx-auto text-justify">
              {history.content}
            </ReactMarkdown>
          </div>
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
    </>
  );
}
