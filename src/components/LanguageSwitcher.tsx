"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { LuGlobe } from "react-icons/lu";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value;
    // Remove the current locale from the pathname
    const newPathname = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${newPathname}`);
  };

  return (
    <div className="flex scale-90 items-center space-x-0">
      <label htmlFor="language">
        <LuGlobe size={24} className="text-slate-700" />
      </label>
      <select
        name="language"
        id="language"
        className="-ml-5 bg-transparent border-none focus:outline-none focus:ring-0"
        onChange={handleChange}
        value={locale}
      >
        <option value="en">English</option>
        <option value="id">Indonesia</option>
      </select>
    </div>
  );
}
