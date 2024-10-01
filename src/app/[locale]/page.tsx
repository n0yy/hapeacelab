"use client";

import Pricing from "@/components/Pricing";
import Services from "@/components/Services";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { data: session } = useSession();
  const t = useTranslations("Home");
  const locale = useLocale();
  return (
    <>
      <title>HLab AI</title>
      <Navbar />
      <main>
        <section
          className="relative min-h-screen flex items-center justify-center"
          id="heroes"
        >
          <div className="relative text-center max-w-3xl mx-auto">
            <p className="mb-3 mx-auto text-slate-50 bg-slate-900 py-2 px-5 max-w-max text-sm animate-bounce">
              {t("experimental")}
            </p>
            {session && session.user && (
              <p className="text-slate-500 mb-4 text-lg w-3/4 mx-auto">
                {t("greeting", { name: session?.user.name?.split(" ")[0] })}
              </p>
            )}

            <h1 className="text-4xl font-bold mb-2 text-slate-900 px-5 md:px-0">
              {t("title")}
            </h1>
            <p className="mb-6 text-slate-700 tracking-wider text-sm md:text-base px-8 md:px-0">
              {t("description")}
            </p>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mt-32 mx-10 md:mx-56">
          <header className="mb-10 text-center">
            <h3 className="text-2xl font-semibold ">{t("services.title")}</h3>
            <h4 className="text-sm md:text-base">{t("services.subtitle")}</h4>
          </header>

          <div className="flex flex-wrap justify-center">
            <Services
              urlIcon="/rangkumin.png"
              title={t("services.condenseIt.title")}
              desc={t("services.condenseIt.description")}
              url={`${locale}/condense-it`}
            />
            <Services
              urlIcon="/listingin.png"
              title={t("services.describeIt.title")}
              desc={t("services.describeIt.description")}
              url={`${locale}/describe-it`}
            />
            <Services
              urlIcon="/lecturer-summarizer.png"
              width={32}
              height={32}
              title={t("services.lectureBrief.title")}
              desc={t("services.lectureBrief.description")}
              url={`${locale}/lecturer-brief`}
            />
            <Services
              urlIcon="/potensionality.png"
              title={t("services.potensionality.title")}
              desc={t("services.potensionality.description")}
              url={`${locale}/potensionality`}
              isUpcoming={true}
            />
          </div>
        </section>
        {/* End Services */}

        {/* Pricing */}
        {/* <section id="pricing" className="mt-32 mx-10 md:mx-56">
          <header className="mb-10 text-center">
            <h3 className="text-2xl font-semibold ">{t("pricing.title")}</h3>
            <h4 className="text-sm md:text-base">{t("pricing.subtitle")}</h4>
          </header>
          <div className="flex flex-wrap justify-center gap-10">
            {!session && (
              <Pricing
                title={t("pricing.free.title")}
                list={t.raw("pricing.free.features")}
                price={t("pricing.free.price")}
              />
            )}
            <Pricing
              title={t("pricing.lower.title")}
              list={t.raw("pricing.lower.features")}
              price={t("pricing.lower.price")}
            />
            <Pricing
              title={t("pricing.upper.title")}
              list={t.raw("pricing.upper.features")}
              price={t("pricing.upper.price")}
            />
          </div>
        </section> */}
        {/* End Pricing */}

        {/* Footer */}
        <footer className="mt-40 mb-5 text-xs text-center text-slate-600">
          {t("footer")}
        </footer>
        {/* End Footer */}
      </main>
    </>
  );
}
