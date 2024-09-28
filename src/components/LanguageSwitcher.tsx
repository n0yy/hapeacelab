"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { LuGlobe } from "react-icons/lu";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (newLocale: string) => {
    // Remove the current locale from the pathname
    const newPathname = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${newPathname}`);
  };

  const languages = [
    { code: "en", label: "EN" },
    { code: "id", label: "ID" },
  ];

  return (
    <div className="flex items-center space-x-2 justify-between w-full">
      <LuGlobe size={24} className="text-slate-700" />
      <div className="space-x-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`px-2 py-1 text-sm font-medium rounded-md transition-colors ${
              locale === lang.code
                ? "bg-black text-white"
                : "outline outline-[1px] hover:bg-black hover:text-white"
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
