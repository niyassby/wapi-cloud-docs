"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { docsNav } from "@/lib/modules";

export function DocsSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-8 pb-16">
      {docsNav.map((group) => (
        <div key={group.group}>
          <p className="mb-2.5 px-3 font-mono text-[11px] uppercase tracking-wider text-paper-300/50">
            {group.group}
          </p>
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={clsx(
                      "block rounded-md px-3 py-1.5 text-[13.5px] transition",
                      active
                        ? "bg-signal-deep/40 font-medium text-signal"
                        : "text-paper-300 hover:bg-ink-800 hover:text-paper-100"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
