"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Menu } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DocsSidebarContent } from "@/components/DocsSidebar";
import { MobileDocsNav } from "@/components/MobileDocsNav";
import { DocsSearch } from "@/components/DocsSearch";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed w-full inset-0 h-screen bg-ink-950">
      <header className="relative z-40 border-b border-ink-800 bg-ink-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden flex items-center gap-2 rounded-md border border-ink-700 px-3 py-1.5 font-mono text-xs text-paper-200"
            >
              <Menu className="h-3.5 w-3.5" /> menu
            </button>
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-6 w-6" />
              <span className="font-display text-[15px] font-semibold text-paper-50">
                wapi-cloud
              </span>
              <span className="hidden rounded-full border border-ink-700 px-2 py-0.5 font-mono text-[10px] text-paper-300 sm:inline">
                docs
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <DocsSearch />

            <a
              href="https://github.com/niyassby/wapi-cloud"
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-md border border-ink-700 px-3 py-1.5 font-mono text-xs text-paper-200 transition hover:border-signal/40 hover:text-signal sm:flex"
            >
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </div>
        </div>
      </header>
      <MobileDocsNav open={open} setOpen={setOpen} />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 h-full z-10 relative">
        <div className="grid lg:grid-cols-[240px_1fr] h-full">
          <aside className="hidden border-r border-ink-800 pr-6 py-8 lg:block overflow-y-auto">
            <div className="">
              <DocsSidebarContent />
            </div>
          </aside>
          <main className="min-w-0 py-10 pb-20 lg:pl-10 overflow-y-auto ">
            <div className="prose-doc mx-auto max-w-3xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
