"use client";

import Services from "@/components/Services";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
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
    <>
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
        <section
          className="relative min-h-screen flex items-center justify-center"
          id="heroes"
        >
          <div className="relative text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-slate-900 px-5 md:px-0">
              AI-Powered Tools to Simplify Your Work.
            </h1>
            <p className="mb-6 text-slate-700 tracking-wider text-sm md:text-base px-8 md:px-0">
              Simplify your workflow with our AI-powered tools, from
              Speech-to-Text, paper summarization, to key point extraction from
              YouTube videos, and much more. Let us handle the heavy lifting, so
              you can focus on what matters most.
            </p>
            <button className="bg-primary shadow-neo px-8 py-2 rounded-md font-medium">
              Try it Now!
            </button>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mt-32 mx-10 md:mx-56">
          <header className="mb-10 text-center">
            <h3 className="text-2xl font-semibold ">
              Our services built by strong model.
            </h3>
            <h4 className="text-sm md:text-base">
              With the strong model we can get what we need.
            </h4>
          </header>

          <div className="flex flex-wrap justify-center">
            <Services
              urlIcon="/rangkumin.png"
              title="CondenseIt"
              desc="Summarize articles and papers instantly, providing clear and concise insights in just seconds."
              url="/services/condense-it"
            />
            <Services
              urlIcon="/listingin.png"
              title="DescribeIt"
              desc="Create product descriptions instantly from an image, making it effortless for sellers to generate clear content."
              url="/services/listingin"
            />
            <Services
              urlIcon="/speech-to-text.png"
              width={32}
              height={32}
              title="VoiceBrief"
              desc="Summarize spoken content instantly, providing clear and concise insights from any audio recording in seconds."
              url="/services/speech-to-text"
            />
            <Services
              urlIcon="/yt-summarizer.png"
              width={32}
              height={32}
              title="TubeBrief"
              desc="Summarize YouTube videos instantly, delivering clear and concise insights without needing to watch the full video."
              url="/services/youtube-summerizer"
            />
            <Services
              urlIcon="/lecturer-summarizer.png"
              width={32}
              height={32}
              title="LectureBrief"
              desc="Summarize lectures instantly, providing clear and concise insights to help students quickly grasp key points."
              url="/services/lecturer-docs-summarizer"
            />
            <Services
              urlIcon="/potensionality.png"
              title="Potensionality"
              desc="Lorem ipsum dolor sit amet consectetur. Sollicitudin gravida tellus id nullam cum."
              url="/services/potensinality"
              isUpcoming={true}
            />
          </div>
        </section>
        {/* End Services */}
      </main>
    </>
  );
}
