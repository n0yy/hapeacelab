"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Layout({ children }: any) {
  const [isScrolled, setIsScrolled] = useState(false);

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
    <main>
      <nav
        className={`fixed top-0 py-4 w-full z-50 flex items-center justify-between lg:justify-evenly px-10 lg:px-0 transition-all duration-300 ${
          isScrolled
            ? "bg-primary bg-opacity-25 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <Image
          src="/logo.png"
          width={82}
          height={40}
          alt="Logo Hapeace Lab"
          className="scale-90 md:scale-100"
        />
        <div className="space-x-8 text-slat-600 font-light hidden lg:block">
          <Link href="/">Home</Link>
          <Link href="#services">Services</Link>
          <Link href="#pricing">Pricing</Link>
        </div>
        <button className="border border-slate-800 px-8 py-1.5 rounded-md font-medium scale-90 hover:bg-black hover:text-white transition-all duration-200">
          Login
        </button>
      </nav>
      {children}
    </main>
  );
}
