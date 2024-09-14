"use client";

import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import Services from "@/components/Services";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <main>
        <Navbar />
        <section
          className="relative min-h-screen flex items-center justify-center"
          id="heroes"
        >
          <div className="relative text-center max-w-3xl mx-auto">
            <p className="mb-3 mx-auto text-slate-50 bg-slate-900 py-2 px-5 max-w-max text-sm animate-bounce">
              Experimental
            </p>
            {session && session.user && (
              <p className="text-slate-500 mb-4 text-lg">
                Hi{" "}
                <span className="text-slate-800 underline">
                  {session?.user.name?.split(" ")[0]}
                </span>
                ✌️ how can we help you?
              </p>
            )}

            <h1 className="text-4xl font-bold mb-2 text-slate-900 px-5 md:px-0">
              AI-Powered Tools to Simplify Your Work.
            </h1>
            <p className="mb-6 text-slate-700 tracking-wider text-sm md:text-base px-8 md:px-0">
              Simplify your workflow with our AI-powered tools. Let us handle
              the heavy lifting, so you can focus on what matters most.
            </p>

            {!session && (
              <Link
                href="/login"
                className="bg-primary shadow-neo px-8 py-2 rounded-md font-medium cursor-pointer"
              >
                Try it Now!
              </Link>
            )}
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
              desc="Summarize papers instantly, providing clear and concise insights in just seconds."
              url="/services/condense-it"
            />
            <Services
              urlIcon="/listingin.png"
              title="DescribeIt"
              desc="Create product descriptions instantly from an image, making it effortless for sellers to generate clear content."
              url="/services/describe-it"
            />
            {/* <Services
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
            */}
            <Services
              urlIcon="/lecturer-summarizer.png"
              width={32}
              height={32}
              title="LectureBrief"
              desc="Summarize lectures instantly, providing clear and concise insights to help students quickly grasp key points."
              url="/services/lecturer-brief"
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

        {/* Pricing */}
        <section id="pricing" className="mt-32 mx-10 md:mx-56">
          <header className="mb-10 text-center">
            <h3 className="text-2xl font-semibold ">
              Choose a plan that’s right for you
            </h3>
            <h4 className="text-sm md:text-base">
              Try our free plan to get 350 point. Switch plan if you want more
              point.
            </h4>
          </header>
          <div className="flex flex-wrap justify-center gap-10">
            <Pricing
              title="Free"
              list={[
                "Lorem ipsum dolor sit amet consectetur.",
                "Sollicitudin gravida tellus id nullam cum.",
                "Potensionality",
                "Get 350 point when you registered.",
              ]}
              price="Start free trial"
            />
            <Pricing
              title="Lower"
              list={[
                "Lorem ipsum dolor sit amet consectetur.",
                "Sollicitudin gravida tellus id nullam cum.",
                "Potensionality",
                "Get 550 point",
                "Speech-to-Text",
                "CondenseIt",
              ]}
              price="Rp 25.999"
            />
            <Pricing
              title="Upper"
              list={[
                "Lorem ipsum dolor sit amet consectetur.",
                "Sollicitudin gravida tellus id nullam cum.",
                "Get 1150 points",
                "All Services",
              ]}
              price="Rp 49.500"
            />
          </div>
        </section>
        {/* End Pricing */}

        {/* Footer */}
        <footer className="mt-40 mb-5 text-xs text-center text-slate-600">
          @ 2024 Hapeacelab
        </footer>
        {/* End Footer */}
      </main>
    </>
  );
}
