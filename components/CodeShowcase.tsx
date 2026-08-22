"use client";

import { useState } from "react";
import clsx from "clsx";
import { CodeBlock } from "./CodeBlock";

const TABS = [
  {
    id: "send",
    label: "send.ts",
    code: `import { Whatsapp } from "wapi-cloud";

const whatsapp = new Whatsapp({
  accessToken: process.env.WA_TOKEN!,
  phoneNumberId: process.env.WA_PHONE_ID!,
});

const { data, error } = await whatsapp.messages.sendText(
  "15551234567",
  { body: "Hello from wapi-cloud!" }
);

if (error) throw new Error(error.message);
console.log("Sent message ID:", data.messageId);`,
  },
  {
    id: "template",
    label: "template.ts",
    code: `const { data, error } = await whatsapp.messages.sendTemplate(
  "15551234567",
  {
    name: "order_confirmation",
    language: "en_US",
    components: [
      {
        type: "body",
        parameters: [{ type: "text", text: "Jordan" }],
      },
    ],
  }
);

if (error) {
  console.error(error.code, error.type, error.message);
}`,
  },
  {
    id: "interactive",
    label: "interactive.ts",
    code: `await whatsapp.messages.sendInteractive("15551234567", {
  type: "button",
  body: "Pick one:",
  buttons: [
    { id: "yes", title: "Yes" },
    { id: "no", title: "No" },
  ],
});

// two most common sends, promoted to the root
await whatsapp.send("15551234567", { body: "Hello!" });
await whatsapp.sendTemplate("15551234567", {
  name: "order_confirmation",
  language: "en_US",
});`,
  },
  {
    id: "webhook",
    label: "webhook.ts",
    code: `whatsapp.webhooks.handleExpress(app, "/webhook", {
  verifyToken: process.env.WA_VERIFY_TOKEN!,
});

whatsapp.webhooks.on("message", (msg) => {
  if (msg.messageType === "text") {
    whatsapp.messages.sendText(msg.from, {
      body: \`Echo: \${msg.text.body}\`,
    });
  }
});

whatsapp.webhooks.on("status", (status) => {
  console.log(status.recipientId, status.status);
});`,
  },
];

export function CodeShowcase() {
  const [active, setActive] = useState(TABS[0].id);
  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={clsx(
              "rounded-full border px-3.5 py-1.5 font-mono text-xs transition",
              active === tab.id
                ? "border-signal/50 bg-signal-deep/40 text-signal"
                : "border-ink-700 text-paper-300 hover:border-ink-600 hover:text-paper-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <CodeBlock code={activeTab.code} filename={activeTab.label} lang="ts" />
    </div>
  );
}
