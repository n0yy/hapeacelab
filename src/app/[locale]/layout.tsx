import { Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import SessionWrapper from "@/components/SessionWrapper";
import "../globals.css";
import Navbar from "@/components/Navbar";
import { routing } from "@/i18n/routing";
import { unstable_setRequestLocale } from "next-intl/server";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-poppins",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  unstable_setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body className={`${poppins.className} bg-primary min-h-screen`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SessionWrapper>
            <Navbar />
            {children}
          </SessionWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}