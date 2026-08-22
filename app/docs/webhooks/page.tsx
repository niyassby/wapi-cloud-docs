import { PageHeader, ParamTable, Callout, MethodSignature } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Webhooks — wapi-cloud docs" };

export default function WebhooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Webhooks"
        title="Receiving events"
        description="wapi-cloud provides HMAC-SHA256 signature verification, webhook challenge handshakes, normalized event parsing, and event dispatcher utilities for Express, Next.js, and Fastify."
      />

      <h2>1. Express One-Liner (handleExpress)</h2>
      <p>
        For Express servers, <code>whatsapp.webhooks.handleExpress</code> automatically wires up both the GET verification challenge and the POST signature verification/event dispatcher in a single call:
      </p>
      <CodeBlock
        filename="server.ts"
        lang="ts"
        code={`import express from "express";
import { Whatsapp } from "wapi-cloud";

const app = express();
const whatsapp = new Whatsapp({
  accessToken: process.env.WA_TOKEN!,
  phoneNumberId: process.env.WA_PHONE_ID!,
  appSecret: process.env.WA_APP_SECRET!,
});

// Setup webhook route and verifyToken challenge
whatsapp.webhooks.handleExpress(app, "/webhook", {
  verifyToken: process.env.WA_VERIFY_TOKEN!,
});

// Listen for incoming customer messages
whatsapp.webhooks.on("message", async (msg) => {
  if (msg.messageType === "text") {
    console.log("Received text from " + msg.from + ": " + msg.text.body);
    await whatsapp.messages.sendText(msg.from, {
      body: "Echo: " + msg.text.body,
    });
  } else if (msg.messageType === "image") {
    console.log("Received photo from " + msg.from + ", mediaId: " + msg.image.id);
  }
});

// Listen for delivery status updates (sent, delivered, read, failed)
whatsapp.webhooks.on("status", (status) => {
  console.log("Message " + status.messageId + " to " + status.recipientId + ": " + status.status);
});

// Listen for template approval or rejection updates
whatsapp.webhooks.on("template_status_update", (t) => {
  console.log("Template " + t.messageTemplateName + " updated to " + t.event);
});

app.listen(3000, () => console.log("Server listening on :3000"));`}
      />

      <h2>2. Next.js App Router (Route Handler)</h2>
      <p>
        In modern Next.js applications (App Router <code>app/api/webhook/route.ts</code>), use <code>verifyHandshake</code> and <code>verifySignature</code>:
      </p>
      <CodeBlock
        filename="app/api/webhook/route.ts"
        lang="ts"
        code={`import { whatsapp } from "@/lib/whatsapp";

// 1. GET: Webhook verification challenge
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  try {
    const challenge = whatsapp.webhooks.verifyHandshake({
      mode: searchParams.get("hub.mode"),
      token: searchParams.get("hub.verify_token"),
      challenge: searchParams.get("hub.challenge"),
      expectedToken: process.env.WA_VERIFY_TOKEN!,
    });
    return new Response(challenge, { status: 200 });
  } catch {
    return new Response("Forbidden", { status: 403 });
  }
}

// 2. POST: Inbound messages and status receipts
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("x-hub-signature-256") ?? undefined;

  // Verify HMAC-SHA256 signature
  const isValid = whatsapp.webhooks.verifySignature({
    payload: rawBody,
    signatureHeader,
  });

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // Parse events into strongly-typed array
  const events = whatsapp.webhooks.parse(JSON.parse(rawBody));

  for (const event of events) {
    if (event.type === "message" && event.messageType === "text") {
      await whatsapp.messages.sendText(event.from, {
        body: "Hello! Received: " + event.text.body,
      });
    }
  }

  return new Response("OK", { status: 200 });
}`}
      />

      <h2>3. Manual Express Handler</h2>
      <CodeBlock
        filename="manual-server.ts"
        lang="ts"
        code={`// Mount express.raw on the webhook path to preserve unmodified byte payload for HMAC
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const isValid = whatsapp.webhooks.verifySignature({
    payload: req.body,
    signatureHeader: req.headers["x-hub-signature-256"],
  });

  if (!isValid) return res.sendStatus(401);

  const json = JSON.parse(req.body.toString("utf-8"));
  const events = whatsapp.webhooks.parse(json);

  for (const event of events) {
    if (event.type === "message") {
      console.log("Inbound message from:", event.from);
    }
  }

  res.sendStatus(200);
});`}
      />

      <h2>Event Types</h2>
      <ParamTable
        rows={[
          {
            name: "message",
            type: "InboundMessageEvent",
            description:
              "Inbound message from a user. Discriminated by messageType: 'text' | 'image' | 'video' | 'audio' | 'document' | 'sticker' | 'location' | 'contacts' | 'interactive' | 'button' | 'reaction' | 'unknown'.",
          },
          {
            name: "status",
            type: "MessageStatusEvent",
            description:
              "Delivery receipt status for an outbound message: 'sent' | 'delivered' | 'read' | 'failed'. Includes timestamp and errors if failed.",
          },
          {
            name: "template_status_update",
            type: "TemplateStatusUpdateEvent",
            description:
              "Notification that a message template was APPROVED, REJECTED, PAUSED, or DISABLED by Meta.",
          },
          {
            name: "account_alert",
            type: "AccountAlertEvent",
            description:
              "System alerts regarding WABA health, restriction status, or payment alerts.",
          },
        ]}
      />
    </>
  );
}
