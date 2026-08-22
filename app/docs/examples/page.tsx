import { PageHeader, Callout } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Examples — wapi-cloud docs" };

export default function ExamplesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="Examples"
        description="Production-ready recipes and real-world patterns for building chatbots, e-commerce stores, automated notifications, and webhook handlers."
      />

      <h2>1. Express Webhook Server (One-liner Setup)</h2>
      <p>
        A complete Express server that sets up the GET verification endpoint, verifies HMAC signatures, and handles incoming text and interactive button clicks:
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
  businessAccountId: process.env.WA_WABA_ID!,
  appSecret: process.env.WA_APP_SECRET!,
});

// Setup webhook endpoints and verification challenge
whatsapp.webhooks.handleExpress(app, "/webhook", {
  verifyToken: process.env.WA_VERIFY_TOKEN!,
});

// Handle incoming messages
whatsapp.webhooks.on("message", async (msg) => {
  if (msg.messageType === "text") {
    // Reply to text messages
    await whatsapp.messages.reply(msg.from, msg.id, {
      body: "Hello! You said: " + msg.text.body,
    });
  } else if (msg.messageType === "interactive") {
    console.log("Interactive button response from", msg.from, msg.interactive);
  }
});

// Handle delivery status receipts
whatsapp.webhooks.on("status", (status) => {
  console.log("Message " + status.messageId + " -> " + status.status);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));`}
      />

      <h2>2. Next.js App Router Webhook Handler</h2>
      <p>
        Full Route Handler for Next.js 14 and 15 (<code>app/api/whatsapp/webhook/route.ts</code>):
      </p>
      <CodeBlock
        filename="app/api/whatsapp/webhook/route.ts"
        lang="ts"
        code={`import { Whatsapp } from "wapi-cloud";

const whatsapp = new Whatsapp({
  accessToken: process.env.WA_TOKEN!,
  phoneNumberId: process.env.WA_PHONE_ID!,
  appSecret: process.env.WA_APP_SECRET!,
});

// GET: Meta Webhook Verification Handshake
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const challenge = whatsapp.webhooks.verifyHandshake({
      mode: searchParams.get("hub.mode"),
      token: searchParams.get("hub.verify_token"),
      challenge: searchParams.get("hub.challenge"),
      expectedToken: process.env.WA_VERIFY_TOKEN!,
    });
    return new Response(challenge, { status: 200 });
  } catch {
    return new Response("Unauthorized", { status: 403 });
  }
}

// POST: Process incoming WhatsApp events
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("x-hub-signature-256") ?? undefined;

  // 1. Verify HMAC Signature
  const isValid = whatsapp.webhooks.verifySignature({
    payload: rawBody,
    signatureHeader,
  });

  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  // 2. Parse batch of events
  const events = whatsapp.webhooks.parse(JSON.parse(rawBody));

  for (const event of events) {
    if (event.type === "message" && event.messageType === "text") {
      await whatsapp.messages.sendText(event.from, {
        body: "Thanks for reaching out! A representative will reply shortly.",
      });
    }
  }

  return new Response("EVENT_RECEIVED", { status: 200 });
}`}
      />

      <h2>3. E-Commerce Order Confirmation & Interactive Menu</h2>
      <CodeBlock
        filename="ecommerce-bot.ts"
        lang="ts"
        code={`import { Whatsapp } from "wapi-cloud";

const whatsapp = new Whatsapp({
  accessToken: process.env.WA_TOKEN!,
  phoneNumberId: process.env.WA_PHONE_ID!,
  businessAccountId: process.env.WA_WABA_ID!,
  businessId: process.env.WA_BUSINESS_ID!,
});

export async function sendOrderFlow(customerPhone: string, orderNumber: string) {
  // Step 1: Send approved Utility template outside 24h window
  const { data: tplResult, error: tplError } = await whatsapp.messages.sendTemplate(
    customerPhone,
    {
      name: "order_confirmation_v2",
      language: "en_US",
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: "Alex" },
            { type: "text", text: orderNumber },
          ],
        },
      ],
    }
  );

  if (tplError) {
    console.error("Failed to send template:", tplError.message);
    return;
  }

  console.log("Template sent with ID:", tplResult.messageId);

  // Step 2: Send product recommendations list
  await whatsapp.catalogs.sendProductList(customerPhone, {
    catalogId: process.env.WA_CATALOG_ID!,
    header: "Recommended Add-ons",
    body: "Customers also purchased these items with their order:",
    sections: [
      {
        title: "Accessories",
        productRetailerIds: ["ACC-CASE-01", "ACC-CHARGER-02"],
      },
    ],
  });
}`}
      />

      <h2>4. Media Upload & PDF Invoice Dispatch</h2>
      <CodeBlock
        filename="send-invoice.ts"
        lang="ts"
        code={`import { readFile } from "node:fs/promises";
import { whatsapp } from "./whatsappClient";

export async function sendInvoice(to: string, invoiceFilePath: string, invoiceNumber: string) {
  // 1. Read binary buffer from disk or S3
  const fileBuffer = await readFile(invoiceFilePath);

  // 2. Upload to Meta media store
  const { data: media, error: uploadError } = await whatsapp.media.upload(fileBuffer, {
    type: "application/pdf",
    filename: "Invoice_" + invoiceNumber + ".pdf",
  });

  if (uploadError) {
    console.error("Failed to upload invoice:", uploadError.message);
    return;
  }

  // 3. Send as document message
  const { data: sendResult, error: sendError } = await whatsapp.messages.sendDocument(to, {
    mediaId: media.id,
    filename: "Invoice_" + invoiceNumber + ".pdf",
    caption: "Here is your invoice for order #" + invoiceNumber + ".",
  });

  if (sendError) {
    console.error("Failed to deliver invoice message:", sendError.message);
  } else {
    console.log("Invoice delivered! Message ID:", sendResult.messageId);
  }
}`}
      />

      <h2>5. Template Auto-Pagination & Broadcast Campaign</h2>
      <CodeBlock
        filename="broadcast.ts"
        lang="ts"
        code={`import { whatsapp } from "./whatsappClient";

export async function runBroadcast(recipients: string[], templateName: string) {
  // 1. Verify template is approved across all pages
  let isApproved = false;
  for await (const t of whatsapp.templates.listAll()) {
    if (t.name === templateName && t.status === "APPROVED") {
      isApproved = true;
      break;
    }
  }

  if (!isApproved) {
    throw new Error("Template " + templateName + " is not approved on Meta.");
  }

  console.log("Broadcasting " + templateName + " to " + recipients.length + " recipients...");

  // 2. Dispatch in batches with error logging
  const results = await Promise.all(
    recipients.map((phone) =>
      whatsapp.messages.sendTemplate(phone, {
        name: templateName,
        language: "en_US",
      })
    )
  );

  const successful = results.filter((r) => r.data !== null);
  const failed = results.filter((r) => r.error !== null);

  console.log("Broadcast finished: " + successful.length + " sent, " + failed.length + " failed.");
}`}
      />

      <h2>6. Embedded Signup Customer Onboarding</h2>
      <CodeBlock
        filename="embedded-signup-onboard.ts"
        lang="ts"
        code={`import { whatsapp } from "./whatsappClient";

export async function onboardTenant(code: string, customerWabaId: string) {
  // 1. Exchange browser popup code for permanent system user token
  const { data: tokenData, error: tokenError } =
    await whatsapp.embeddedSignup.exchangeCodeForToken(code);

  if (tokenError) {
    throw new Error("Token exchange failed: " + tokenError.message);
  }

  const { accessToken } = tokenData;

  // 2. Subscribe your Meta app to customer's WABA webhooks
  const { data: subData, error: subError } =
    await whatsapp.embeddedSignup.subscribeToWaba(customerWabaId, {
      accessTokenOverride: accessToken,
    });

  if (subError) {
    throw new Error("Webhook subscription failed: " + subError.message);
  }

  console.log("Tenant onboarded and webhooks subscribed successfully!");
}`}
      />
    </>
  );
}
