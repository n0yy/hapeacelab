"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Avvvatars from "avvvatars-react";
import { LuCoins } from "react-icons/lu";
import { Dropdown } from "flowbite-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { sendFeedback } from "@/lib/actions/feedback";
import { RxCross2 } from "react-icons/rx";
import { useTranslations } from "next-intl";

interface User {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  points?: number;
}

export default function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFeedback, setShowFeedBack] = useState(false);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);

  const t = useTranslations("Navbar");

  const handleAvatar = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const feedbackHandler = () => {
    setShowFeedBack((prev) => !prev);
  };

  const feedBackSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const data = {
      name: form.get("name")?.toString() || "Anonymous",
      message: form.get("message")?.toString() || "",
      email: form.get("email")?.toString() || "",
    };

    try {
      const result = await sendFeedback(data);
      if (result) {
        setIsFeedbackSent(true);
      } else {
        console.log("Something went wrong!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (showFeedback) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [showFeedback]);

  return (
    <>
      <nav
        className={`fixed top-0 py-4 w-full z-50 flex items-center justify-between lg:justify-evenly px-10 lg:px-0 transition-all duration-300 ${
          isScrolled
            ? "bg-primary bg-opacity-25 backdrop-blur-md z-50"
            : "bg-transparent"
        }`}
      >
        <Link href="/">
          <Image
            src="/logo.png"
            width={82}
            height={40}
            alt="Logo Hapeace Lab"
            className="scale-90 md:scale-100"
          />
        </Link>
        <div className="space-x-8 text-slate-600 hidden lg:block text-sm">
          <Link href="/">{t("home")}</Link>
          <Link href="#services">{t("services")}</Link>
          {session && (
            <span className="cursor-pointer" onClick={feedbackHandler}>
              {t("feedback")}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3 md:space-x-10">
          {session ? (
            <span className="cursor-pointer" onClick={handleAvatar}>
              <Dropdown
                arrowIcon={false}
                inline={true}
                className="w-64 text-sm"
                label={
                  <Avvvatars value={session.user?.email as string} size={36} />
                }
              >
                <Dropdown.Item className="block md:hidden text-start">
                  <Link href="/">{t("home")}</Link>
                </Dropdown.Item>
                <Dropdown.Item className="block md:hidden text-start">
                  <Link href="#services">{t("services")}</Link>
                </Dropdown.Item>
                <Dropdown.Item className="block md:hidden text-start">
                  <span className="cursor-pointer" onClick={feedbackHandler}>
                    {t("feedback")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => signOut()}>Logout</Dropdown.Item>
                <Dropdown.Item className="hover:bg-white mt-7 md:mt-0">
                  <LanguageSwitcher />
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <div className="space-x-2 flex items-center">
                    <LuCoins />
                    <span>{(session.user as User).points} pts.</span>
                  </div>
                </Dropdown.Item>
              </Dropdown>
            </span>
          ) : (
            <Link
              href="/login"
              className="border border-slate-800 px-8 py-1.5 rounded-md font-medium scale-90 hover:bg-black hover:text-white transition-all duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {showFeedback && (
        <div className="z-50 min-h-screen flex items-center justify-center bg-transparent">
          {isFeedbackSent ? (
            <div className="flex flex-col items-center justify-center">
              <p className="text-center text-xl font-semibold mb-3">
                {t("isSendFeedback")}
              </p>
              <RxCross2
                onClick={() => {
                  setIsFeedbackSent(false);
                  setShowFeedBack(false);
                }}
                className="w-6 h-6 cursor-pointer hover:scale-110 transition-all duration-100"
              />
            </div>
          ) : (
            <form
              className="flex flex-col w-1/2 md:w-1/4"
              onSubmit={feedBackSubmitHandler}
            >
              <h1 className="mb-5 font-semibold text-xl">
                {t("titleFeedback")}
              </h1>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                className="py-1.5 rounded border-none text-sm mb-3 read-only:cursor-not-allowed"
                value={session?.user?.name ?? ""}
                readOnly
              />
              <input
                type="hidden"
                name="email"
                id="email"
                value={session?.user?.email ?? ""}
                readOnly
              />
              <textarea
                name="message"
                id="message"
                placeholder="Feedback"
                className="py-1.5 rounded border-none text-sm mb-7"
                rows={5}
              ></textarea>
              <button
                type="submit"
                className="bg-black text-white py-1.5 rounded text-sm"
              >
                Send
              </button>
              <span
                className="block text-center underline mt-5 cursor-pointer"
                onClick={() => setShowFeedBack(false)}
              >
                {t("back")}
              </span>
            </form>
          )}
        </div>
      )}
    </>
  );
}
