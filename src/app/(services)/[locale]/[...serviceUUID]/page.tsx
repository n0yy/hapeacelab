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

  console.log(serviceName, uuid);

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
      <article className="prose text-justify py-20 -mt-10 md:mt-0 ml-0 md:ml-40 px-10 lg:mx-0">
        <ReactMarkdown>{history?.content}</ReactMarkdown>
      </article>
    </>
  );
}
