import Link from "next/link";
import { Github, Package } from "lucide-react";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink-800/80 bg-ink-950/40 backdrop-blur-md">
      <div className="mx-auto flex h-20 md:h-24 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          {/* <Logo className="h-6 w-6" />
          <span className="font-display text-[15px] font-semibold tracking-tight text-paper-50">
            wapi-cloud
          </span> */}
          <img className="w-full h-10 md:h-14" src="./wapi-cloud-logo.svg" alt="logo" />
        </Link>

        <nav className="hidden items-center gap-8 font-mono text-[15px] text-paper-300 md:flex">
          <Link href="/docs" className="transition hover:text-signal">
            Docs
          </Link>
          <Link
            href="/docs/messages"
            className="transition hover:text-signal"
          >
            API reference
          </Link>
          <Link href="/docs/examples" className="transition hover:text-signal">
            Examples
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://www.npmjs.com/package/wapi-cloud"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-ink-700 px-3 py-1.5 font-mono text-xs text-paper-200 transition hover:border-signal/40 hover:text-signal sm:flex"
          >
            <Package className="h-3.5 w-3.5" /> npm
          </a>
          <a
            href="https://github.com/niyassby/wapi-cloud"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md bg-paper-50 px-3 py-1.5 font-mono text-xs font-medium text-ink-950 transition hover:bg-signal"
          >
            <Github className="h-3.5 w-3.5" /> GitHub
          </a>
        </div>
      </div>
    </header>
  );
}
