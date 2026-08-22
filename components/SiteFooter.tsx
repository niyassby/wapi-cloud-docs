import Link from "next/link";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Docs",
    links: [
      { label: "Introduction", href: "/docs" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Quick start", href: "/docs/quick-start" },
      { label: "Error handling", href: "/docs/error-handling" },
    ],
  },
  {
    title: "API reference",
    links: [
      { label: "Messages", href: "/docs/messages" },
      { label: "Templates", href: "/docs/templates" },
      { label: "Webhooks", href: "/docs/webhooks" },
      { label: "Types", href: "/docs/types" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: "https://github.com/niyassby/wapi-cloud" },
      { label: "npm", href: "https://www.npmjs.com/package/wapi-cloud" },
      {
        label: "Examples",
        href: "https://github.com/niyassby/wapi-cloud/blob/master/examples",
      },
      {
        label: "MIT License",
        href: "https://github.com/niyassby/wapi-cloud/blob/master/LICENSE",
      },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-800 bg-ink-950">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Logo className="h-6 w-6" />
              <span className="font-display text-sm font-semibold text-paper-50">
                wapi-cloud
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper-300">
              A promise-based, fully-typed Node.js wrapper for the WhatsApp
              Cloud API. Never throws. Always resolves.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-wider text-paper-300/60">
                {col.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-paper-200 transition hover:text-signal"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-ink-800 pt-6 text-xs text-paper-300/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} wapi-cloud contributors. MIT Licensed.</p>
          <p className="font-mono">
            built for developers integrating WhatsApp into their products
          </p>
        </div>
      </div>
    </footer>
  );
}
