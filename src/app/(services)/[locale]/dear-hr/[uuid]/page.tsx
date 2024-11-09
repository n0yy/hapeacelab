"use client";

import AsideServices from "@/components/Aside";
import CoverLetterDisplay from "@/components/CoverLetterSection";
import CoverLetterSkeleton from "@/components/CoverLetterSkeleton";
import { getHistory } from "@/utils/firebase/history";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import React, { use } from "react";

export default function DetailCoverLetter(props: any) {
  const params: { uuid: string } = use(props.params);
  const uuid = params.uuid;

  const [history, setHistory] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { data: session, status } = useSession();

  const tAside = useTranslations("Aside");

  React.useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const fetchHistory = async () => {
        try {
          setLoading(true);
          const historyData = await getHistory(
            session?.user?.email ?? "",
            "dear-hr",
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
  }, [session?.user?.email, status, uuid]);
  return (
    <>
      <title>{history?.title}</title>

      <AsideServices tAside={tAside} />
      <article className="prose-sm lg:prose text-start max-w-3xl mx-10 md:mx-auto my-10 mt-20">
        {loading && <CoverLetterSkeleton />}
        <CoverLetterDisplay content={history?.content} />
      </article>
    </>
  );
}
