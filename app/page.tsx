import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  PackageCheck,
  Webhook,
  Repeat,
  Feather,
  ShieldOff,
  Terminal,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { DeliveryMock } from "@/components/DeliveryMock";
import { CodeShowcase } from "@/components/CodeShowcase";
import { CodeBlock } from "@/components/CodeBlock";
import { modules } from "@/lib/modules";

const features = [
  {
    icon: ShieldCheck,
    title: "Fully typed",
    body: "First-class TypeScript support end to end. Error checks narrow the result type correctly, no `as` required.",
  },
  {
    icon: ShieldOff,
    title: "Never throws",
    body: "Every call resolves to a consistent { data, error } result, Supabase-style. No try/catch for expected API failures.",
  },
  {
    icon: PackageCheck,
    title: "Batteries included",
    body: "Messages, templates, media, contacts, catalogs, products, commerce settings, flows, QR codes, analytics, and embedded signup.",
  },
  {
    icon: Webhook,
    title: "Webhook helpers",
    body: "Signature verification, event parsing, and an Express one-liner so you can stop hand-rolling HMAC checks.",
  },
  {
    icon: Repeat,
    title: "Auto-pagination",
    body: "`for await` over any list endpoint. wapi-cloud walks the cursor for you, page by page.",
  },
  {
    icon: Feather,
    title: "Tree-shakeable",
    body: "Ships as ESM + CJS with .d.ts via tsup. Import only the modules you call.",
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-ink-950">
      <div className="pointer-events-none absolute inset-0 bg-grid-glow" />
      <SiteNav />

      {/* HERO */}
      <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-16 sm:pt-24 my-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/60 px-3 py-1 font-mono text-[11px] text-signal">
              <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-signal" />
              v1 · MIT licensed · open source
            </div>
            <h1 className="text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight text-paper-50 sm:text-6xl">
              WhatsApp messaging,
              <br />
              without the{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-signal">try/catch</span>
                <span className="absolute inset-x-0 bottom-1 h-3 -skew-x-6 bg-signal-deep/70" />
              </span>
              .
            </h1>
            <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-paper-300">
              <span className="font-mono text-paper-100">wapi-cloud</span> is a
              promise-based, fully-typed Node.js wrapper for the WhatsApp
              Cloud API. Every call resolves to{" "}
              <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-sm text-signal-soft">
                {"{ data, error }"}
              </code>{" "}
              — never throws, never surprises.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/docs"
                className="group flex items-center justify-center gap-2 rounded-lg bg-signal px-5 py-3 font-medium text-ink-950 transition hover:bg-signal-soft"
              >
                Read the docs
                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <div className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 font-mono text-sm text-paper-200">
                <Terminal className="h-4 w-4 text-signal" />
                npm install wapi-cloud
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs text-paper-300/70">
              <span>ESM + CJS</span>
              <span className="h-1 w-1 rounded-full bg-paper-300/30" />
              <span>Zero runtime dependencies*</span>
              <span className="h-1 w-1 rounded-full bg-paper-300/30" />
              <span>Node.js 18+</span>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <DeliveryMock />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-signal">
            why wapi-cloud
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-paper-50">
            Built like the SDK you wish Meta shipped.
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl border border-ink-800 bg-ink-800 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative bg-ink-950 p-7 transition hover:bg-ink-900"
            >
              <f.icon className="h-5 w-5 text-signal" strokeWidth={1.75} />
              <h3 className="mt-4 font-display text-base font-semibold text-paper-50">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-paper-300">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CODE SHOWCASE */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-signal">
            the api
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-paper-50">
            Reads like the message it sends.
          </h2>
          <p className="mt-3 text-paper-300">
            One client, every endpoint. Switch tabs to see messages,
            templates, interactive buttons and webhooks side by side.
          </p>
        </div>
        <CodeShowcase />
      </section>

      {/* DATA / ERROR SPOTLIGHT */}
      <section className="relative border-y border-ink-800 bg-ink-900/40 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-signal">
              error handling
            </p>
            <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-paper-50">
              Every call is a result, not a risk.
            </h2>
            <p className="mt-4 text-paper-300">
              <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-sm text-signal-soft">
                data
              </code>{" "}
              and{" "}
              <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-sm text-signal-soft">
                error
              </code>{" "}
              are mutually exclusive, so TypeScript narrows correctly the
              moment you check{" "}
              <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-sm text-signal-soft">
                error
              </code>
              . Every response also carries{" "}
              <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-sm text-signal-soft">
                status
              </code>
              ,{" "}
              <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-sm text-signal-soft">
                statusText
              </code>{" "}
              and{" "}
              <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-sm text-signal-soft">
                raw
              </code>{" "}
              — the untouched Graph API JSON — as an escape hatch.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-paper-300">
              <li className="flex gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                Config-only failures (like a missing{" "}
                <code className="text-signal-soft">businessAccountId</code>)
                also come back as{" "}
                <code className="text-signal-soft">{"{ data: null, error }"}</code>
                , never a thrown exception.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                <code className="text-signal-soft">error.isRetryable</code>{" "}
                tells you whether it&apos;s safe to retry the exact same call.
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                <code className="text-signal-soft">error.fbtraceId</code> is
                ready to hand to Meta support, no digging through logs.
              </li>
            </ul>
          </div>
          <CodeBlock
            filename="templates.ts"
            lang="ts"
            code={`const { data: templates, error } = await whatsapp.templates.list();

if (error) {
  console.error(error.code, error.type, error.message);
  // error.isRetryable, error.raw, error.fbtraceId also available
} else {
  console.log(templates.items);
}`}
          />
        </div>
      </section>

      {/* MODULE SURFACE */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-signal">
            module surface
          </p>
          <h2 className="mt-3 text-balance font-display text-3xl font-semibold tracking-tight text-paper-50">
            The whole Graph API, namespaced.
          </h2>
          <p className="mt-3 text-paper-300">
            One <code className="text-signal-soft">Whatsapp</code> instance,
            14 focused modules. Each maps to a corner of the Cloud API so your
            imports read like your intent.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.key}
              href={m.href}
              className="group rounded-xl border border-ink-800 bg-ink-900/50 p-5 transition hover:border-signal/40 hover:bg-ink-900"
            >
              <div className="flex items-center justify-between">
                <code className="font-mono text-sm text-signal">
                  whatsapp.{m.name}
                </code>
                <ArrowUpRight className="h-3.5 w-3.5 text-paper-300/40 transition group-hover:text-signal" />
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-paper-300">
                {m.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-ink-800 bg-gradient-to-br from-ink-900 to-ink-850 px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-grid-glow" />
          <h2 className="relative text-balance font-display text-3xl font-semibold tracking-tight text-paper-50 sm:text-4xl">
            Ship your first message in under five minutes.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-paper-300">
            Install the package, drop in your access token, and send. The
            docs walk through everything else.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/docs/quick-start"
              className="flex items-center gap-2 rounded-lg bg-signal px-5 py-3 font-medium text-ink-950 transition hover:bg-signal-soft"
            >
              Get started <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/niyassby/wapi-cloud"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-lg border border-ink-700 px-5 py-3 font-medium text-paper-100 transition hover:border-signal/40 hover:text-signal"
            >
              View source
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
