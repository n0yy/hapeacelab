import { routing } from "@/i18n/routing";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Poppins } from "next/font/google";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-poppins",
});

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  let messages;
  try {
    messages = (await import(`../../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  unstable_setRequestLocale(locale);

  return (
    <body className={`${poppins.className} bg-primary min-h-screen`}>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <div className="mt-20 md:mt-0 ml-0 md:ml-72 flex-grow">{children}</div>
      </NextIntlClientProvider>
    </body>
  );
}
