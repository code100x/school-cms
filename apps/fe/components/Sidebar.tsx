"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";


export default function Sidebar({ courseId }: { courseId: string }) {
  const pathname = usePathname();
  const r = useRouter();

  const items = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: `/calendar/${courseId}`, label: "Calendar", icon: "🗓️" },
    { href: "/wallet", label: "Wallet", icon: "👛" }
  ];
  

  function signOut() {
    localStorage.removeItem("token");
    r.replace("/signin");
  }

  return (
    <div className="flex h-full flex-col gap-4">
      
      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            className={clsx(
              "sidebar-link",
              pathname === it.href && "sidebar-link-active"
            )}
          >
            <span className="text-lg">{it.icon}</span>
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <button onClick={signOut} className="btn btn-outline w-full">Sign out</button>
      </div>

      <div className="text-xs text-gray-500">v1.0</div>
    </div>
  );
}
