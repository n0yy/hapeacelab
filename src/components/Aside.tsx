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
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
          showAside ? "min-h-screen bg-white" : "z-50"
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
          showAside ? "translate-x-0 z-30" : "-translate-x-full"
        } md:translate-x-0 fixed top-0 left-0 h-screen w-64 bg-primary shadow-lg transition-all duration-200`}
      >
        {/* Main container */}
        <div className="flex flex-col h-full">
          {/* Top Section with padding */}
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">HLab.</div>
              <div className="flex items-center gap-2">
                {session && (
                  <span className="flex items-center text-xs">
                    <LuCoins className="w-4 h-4" />
                    {(session?.user as User).points}
                  </span>
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-4 space-y-1 text-sm">
              <Link href="/" className="block">
                Beranda
              </Link>
              <Link href="/#services" className="block">
                Layanan
              </Link>
            </div>
          </div>

          {/* History Section */}
          <div className="flex-1 flex flex-col min-h-0 px-5">
            <h3 className="text-sm font-medium mb-2">Riwayat</h3>

            {/* "Lagi" Button */}
            <button
              onClick={() =>
                (window.location.href = `/${locale}/${serviceName}`)
              }
              className="w-full py-1.5 px-2 text-xs border border-slate-400 border-dashed rounded mb-2 hover:bg-slate-100 transition-colors"
            >
              ⚡ Lagi ⚡
            </button>

            {/* Scrollable History List */}
            <div className="flex-1 overflow-y-auto">
              {historyError ? (
                <div className="text-xs text-slate-400">
                  Failed to load histories
                </div>
              ) : histories.length > 0 ? (
                <div className="space-y-0.5">
                  {histories.map((item: History) => (
                    <ActiveLink
                      key={item.id}
                      href={`/${locale}/${serviceName}/${item.id}`}
                      className="text-xs block py-1 px-2 hover:bg-slate-100 rounded truncate"
                    >
                      {"> " + item.title || `History ${item.id}`}
                    </ActiveLink>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400">
                  No histories available
                </div>
              )}
            </div>
          </div>

          {/* Footer Section - Profile & Logout */}
          <div className="p-4 border-t border-slate-200">
            {session ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Avvvatars value={session.user?.email as string} size={24} />
                  <div>
                    <p className="text-xs font-medium">{session?.user?.name}</p>
                    <p className="text-xs text-slate-500">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-xs text-slate-600 hover:underline w-full text-left"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs block text-center border border-slate-800 px-4 py-1 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
