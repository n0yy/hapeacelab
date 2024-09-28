"use client";

import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Avvvatars from "avvvatars-react";
import { LuCoins } from "react-icons/lu";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { useState } from "react";
import { useLocale } from "next-intl";
import ActiveLink from "./ActiveLink";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

interface User {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  points?: number;
}

interface History {
  id: string;
  title: string;
}

interface HistoryData {
  histories: History[];
}

export default function AsideServices({ tAside }: { tAside: any }) {
  const [showAside, setShowAside] = useState<boolean>(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const locale = useLocale();
  const serviceName = pathname?.split("/")[2];

  const { data: historyData, error: historyError } = useSWR<HistoryData>(
    session && serviceName
      ? `/api/services/histories/${serviceName}/${session.user?.email}`
      : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  const histories = historyData?.histories || [];

  const handleAside = () => {
    setShowAside((prev) => !prev);

    // Stop scroll on body
    if (!showAside) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-between px-10 py-4 bg-white/10 backdrop-blur fixed top-0 w-full md:hidden ${
          showAside ? "min-h-screen bg-white" : "z-0"
        }`}
      >
        <Image src="/logo.png" width={82} alt="Logo" height={64} />
        {showAside ? (
          <IoMdClose
            size={32}
            className="absolute top-11 right-8 cursor-pointer md:hidden"
            onClick={handleAside}
          />
        ) : (
          <IoMdMenu
            size={32}
            className="cursor-pointer md:hidden"
            onClick={handleAside}
          />
        )}
      </div>

      <aside
        className={`${
          showAside ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed top-0 md:left-0 max-w-72 lg:max-w-sm h-screen overflow-y-auto p-10 bg-primary flex flex-col shadow-lg transition-all duration-200`}
      >
        <div>
          <div className="flex items-end justify-between">
            <Image src="/logo.png" width={82} alt="Logo" height={64} />
            {session && (
              <span className="flex items-center text-sm text-center mt-3">
                <LuCoins /> {(session?.user as User).points}
              </span>
            )}
          </div>
          <div className="mt-7 flex flex-col space-y-1">
            <Link href="/">{tAside("homeText")}</Link>
            <Link href="/#services">{tAside("servicesText")}</Link>
            {/* <Link href="/#pricing">{tAside("pricingText")}</Link> */}
          </div>
          <div className="mt-5 max-w-64">
            <h3 className="text-lg mb-1 font-semibold text-slate-800">
              {tAside("historiesText")}
            </h3>
            {historyError && (
              <div className="text-sm text-slate-400">
                Failed to load histories
              </div>
            )}
            {!historyData && <div>Loading...</div>}
            {histories.length > 0 ? (
              <div className="space-y-0 max-h-64 overflow-y-auto">
                {histories.map((item: History) => (
                  <ActiveLink
                    key={item.id}
                    href={`/${locale}/${serviceName}/${item.id}`}
                    className="text-slate-600 block overflow-hidden text-ellipsis whitespace-nowrap text-sm hover:bg-slate-300 p-1.5 rounded"
                  >
                    {"> " + item.title || `History ${item.id}`}
                  </ActiveLink>
                ))}
              </div>
            ) : (
              !historyError && (
                <div className="text-sm text-slate-400">
                  No histories available
                </div>
              )
            )}
          </div>
        </div>
        <div className="mt-auto border-slate-300">
          {session ? (
            <>
              <div className="flex items-center">
                <Avvvatars value={session.user?.email as string} size={36} />
                <div className="ml-2 -space-y-1">
                  <p className="text-sm lg:text-base">{session?.user?.name}</p>
                  <p className="text-slate-500 text-xs lg:text-sm">
                    {session?.user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="w-full text-end underline mt-2"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="border border-slate-800 px-8 py-1.5 rounded-md font-medium scale-90 hover:bg-black hover:text-white transition-all duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
