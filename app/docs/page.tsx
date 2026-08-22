import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader, Callout } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";
import { modules } from "@/lib/modules";

export const metadata = { title: "Introduction — wapi-cloud docs" };

export default function DocsIntro() {
  return (
    <>
      <PageHeader
        eyebrow="Getting started"
        title="Introduction"
        description="wapi-cloud is a promise-based, fully-typed Node.js wrapper for integrating the WhatsApp Cloud API (Meta Graph API) into your applications."
      />

      <p>
        Most Graph API wrappers hand you raw HTTP responses and let you
        figure out the rest — inconsistent error shapes, no types, and a
        pagination scheme you re-implement in every project. wapi-cloud
        wraps the full{" "}
        <a
          href="https://developers.facebook.com/documentation/business-messaging/whatsapp/overview"
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp Cloud API
        </a>{" "}
        surface — messages, templates, media, contacts, catalogs, products,
        commerce settings, flows, QR codes, analytics, embedded signup, and
        account management — behind a single typed client that never throws.
      </p>

      <h2>Why wapi-cloud</h2>
      <ul>
        <li>
          <strong>Fully typed.</strong> First-class TypeScript support, with
          error checks that narrow the response type correctly without type casts.
        </li>
        <li>
          <strong>Never throws.</strong> Every call resolves to a consistent{" "}
          <code>{"{ data, error }"}</code> result, Supabase-style.
        </li>
        <li>
          <strong>Batteries included.</strong> Messages, templates, media,
          contacts, catalogs, products, commerce settings, flows, QR codes,
          analytics, embedded signup, and webhooks in one unified client.
        </li>
        <li>
          <strong>Webhook helpers.</strong> Signature verification, event
          parsing, typed event dispatchers, and an Express one-liner.
        </li>
        <li>
          <strong>Auto-pagination.</strong> <code>for await</code> over any
          list endpoint.
        </li>
        <li>
          <strong>Tree-shakeable.</strong> Ships as ESM + CJS with{" "}
          <code>.d.ts</code> via <code>tsup</code>.
        </li>
      </ul>

      <h2>A 30-second look</h2>
      <CodeBlock
        filename="index.ts"
        lang="ts"
        code={`import { Whatsapp } from "wapi-cloud";

const whatsapp = new Whatsapp({
  accessToken: process.env.WA_TOKEN!,
  phoneNumberId: process.env.WA_PHONE_ID!,
  businessAccountId: process.env.WA_WABA_ID!, // for templates/flows/analytics
  appSecret: process.env.WA_APP_SECRET!,      // for webhook signatures
});

const { data, error } = await whatsapp.messages.sendText(
  "15551234567",
  { body: "Hello from wapi-cloud!" }
);

if (error) {
  console.error(error.code, error.type, error.message);
} else {
  console.log("Sent message ID:", data.messageId);
  console.log("Recipient WA ID:", data.waId);
}`}
      />

      <Callout>
        wapi-cloud is a thin, typed layer over Meta&apos;s Graph API — it
        does not proxy or replace it. You&apos;ll still need a WhatsApp
        Business Account, a phone number ID, and an access token from{" "}
        <a
          href="https://developers.facebook.com/"
          target="_blank"
          rel="noreferrer"
        >
          Meta for Developers
        </a>
        .
      </Callout>

      <h2>Module Surface</h2>
      <p>
        The SDK exposes 14 dedicated sub-modules organized cleanly by functionality:
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {modules.map((m) => (
          <Link
            key={m.key}
            href={m.href}
            className="not-prose group flex items-center justify-between rounded-xl border border-ink-800 bg-ink-900/50 px-4 py-3.5 transition hover:border-signal/40"
          >
            <div>
              <code className="font-mono text-sm text-signal">
                whatsapp.{m.name}
              </code>
              <p className="mt-1 text-xs text-paper-300">{m.description}</p>
            </div>
            <ArrowUpRight className="h-4 w-4 shrink-0 text-paper-300/40 transition group-hover:text-signal" />
          </Link>
        ))}
      </div>

      <h2>Where to go next</h2>
      <p>
        Head to <Link href="/docs/installation">Installation</Link> to add the
        package, then <Link href="/docs/quick-start">Quick start</Link> to
        send your first message in a few minutes.
      </p>
    </>
  );
}
