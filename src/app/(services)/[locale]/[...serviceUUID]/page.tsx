"use client";

import AsideServices from "@/components/Aside";
import { useTranslations } from "next-intl";
import { useEffect, useState, use } from "react";
import { useSession } from "next-auth/react";
import { getHistory } from "@/utils/firebase/history";
import Markdown from "react-markdown";
import SkeletonLoading from "@/components/SkeletonLoading";

export default function DetailHistory(props: any) {
  const params: { serviceUUID: string[] } = use(props.params);
  const serviceName = params.serviceUUID[0];
  const uuid = params.serviceUUID[1];

  const [history, setHistory] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();

  const tAside = useTranslations("Aside");

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchHistory = async () => {
        try {
          setLoading(true);
          const historyData = await getHistory(
            session?.user?.email ?? "",
            serviceName,
            uuid
          );
          setHistory(historyData);
        } catch (error) {
          console.error("Error fetching history:", error);
          setHistory(null);
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }
  }, [serviceName, session?.user?.email, status, uuid]);

  return (
    <>
      <title>{history?.title}</title>

      <AsideServices tAside={tAside} />
      <article className="prose-sm lg:prose text-start max-w-3xl mx-10 md:mx-auto my-10 mt-20">
        {loading && <SkeletonLoading />}
        <Markdown>{history?.content}</Markdown>
      </article>
    </>
  );
}
