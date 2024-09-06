"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import Avvvatars from "avvvatars-react";
import { Dropdown } from "flowbite-react";
import { LuCoins } from "react-icons/lu";

interface User {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  points?: number; // add the points property
}

export default function Navbar() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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
  return (
    <nav
      className={`fixed top-0 py-4 w-full z-30 flex items-center justify-between lg:justify-evenly px-10 lg:px-0 transition-all duration-300 ${
        isScrolled
          ? "bg-primary bg-opacity-25 backdrop-blur-md"
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
      <div className="space-x-8 text-slat-600 font-light hidden lg:block">
        <Link href="/">Home</Link>
        <Link href="#services">Services</Link>
        <Link href="#pricing">Pricing</Link>
      </div>
      {session ? (
        <span className="cursor-pointer" onClick={handleAvatar}>
          <Dropdown
            arrowIcon={false}
            inline={true}
            label={
              <Avvvatars value={session.user?.email as string} size={36} />
            }
          >
            <Dropdown.Item onClick={() => signOut()}>Logout</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>
              <div className="space-x-2 flex items-center">
                <LuCoins />
                <span>{(session.user as User).points} Points</span>
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
    </nav>
  );
}
