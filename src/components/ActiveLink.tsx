import Link from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({
  href,
  children,
  className = "",
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${className} ${
        isActive ? "bg-slate-200" : "text-slate-600 hover:text-slate-800"
      }`}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;
