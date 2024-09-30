"use client";

import AsideServices from "@/components/Aside";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getHistory } from "@/utils/firebase/history";
import ReactMarkdown from "react-markdown";

export default function DetailHistory({ params }: any) {
  const serviceName = params.serviceUUID[0];
  const uuid = params.serviceUUID[1];

  const [history, setHistory] = useState<any>(null);
  const { data: session, status } = useSession();

  const tAside = useTranslations("Aside");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchHistory = async () => {
        try {
          const historyData = await getHistory(
            session?.user?.email ?? "",
            serviceName,
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
      <title>{history?.title}</title>

      <AsideServices tAside={tAside} />
      <article className="prose text-justify min-h-screen max-w-3xl mx-10 md:mx-auto my-10">
        <ReactMarkdown>{history?.content}</ReactMarkdown>
      </article>
    </>
  );
}
