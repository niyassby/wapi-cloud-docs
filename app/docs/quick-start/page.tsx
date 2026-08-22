import Link from "next/link";
import { PageHeader, Callout } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Quick start — wapi-cloud docs" };

export default function QuickStartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Getting started"
        title="Quick start"
        description="From npm install to a delivered WhatsApp message in about five minutes."
      />

      <h2>1. Install</h2>
      <CodeBlock lang="bash" code={`npm install wapi-cloud`} />

      <h2>2. Create the client</h2>
      <p>
        Instantiate <code>Whatsapp</code> once and reuse it across your
        application. Only <code>accessToken</code> and <code>phoneNumberId</code>{" "}
        are strictly required to send messages — optional parameters unlock additional modules.
      </p>
      <CodeBlock
        filename="whatsapp.ts"
        lang="ts"
        code={`import { Whatsapp } from "wapi-cloud";

export const whatsapp = new Whatsapp({
  accessToken: process.env.WA_TOKEN!,
  phoneNumberId: process.env.WA_PHONE_ID!,
  businessAccountId: process.env.WA_WABA_ID!, // needed for templates/flows/QR/analytics
  appSecret: process.env.WA_APP_SECRET!,      // needed for webhook signature verification
  businessId: process.env.WA_BUSINESS_ID,     // needed for catalogs.list()
  appId: process.env.WA_APP_ID,               // needed for embedded signup
});`}
      />

      <h2>3. Send your first message</h2>
      <CodeBlock
        filename="send.ts"
        lang="ts"
        code={`import { whatsapp } from "./whatsapp";

const { data, error } = await whatsapp.messages.sendText(
  "15551234567",
  { body: "Hello from wapi-cloud!" }
);

if (error) {
  console.error("Send failed:", error.code, error.type, error.message);
} else {
  console.log("Message sent successfully! ID:", data.messageId);
}`}
      />

      <Callout type="warning">
        Recipient numbers must be in international format without a leading{" "}
        <code>+</code> (for example <code>15551234567</code>). Outside
        of an approved template message, you can only send free-form messages to a user who has
        messaged your business within the last 24 hours (Meta&apos;s
        &quot;customer service window&quot;).
      </Callout>

      <h2>4. Send a template message</h2>
      <p>
        Template messages can be sent outside the 24-hour window and are required to initiate conversations with customers. Create templates in Meta Business
        Manager or via <Link href="/docs/templates">the templates module</Link>,
        then send them by name:
      </p>
      <CodeBlock
        filename="send-template.ts"
        lang="ts"
        code={`const { data, error } = await whatsapp.messages.sendTemplate("15551234567", {
  name: "order_confirmation",
  language: "en_US",
  components: [
    {
      type: "body",
      parameters: [{ type: "text", text: "Jordan" }],
    },
  ],
});

if (!error) {
  console.log("Template sent! ID:", data.messageId);
}`}
      />

      <h2>5. Root-level sugar</h2>
      <p>
        For the two most common calls, wapi-cloud provides convenient shortcuts directly on the client instance:
      </p>
      <CodeBlock
        lang="ts"
        code={`// Sugar for whatsapp.messages.sendText()
await whatsapp.send("15551234567", { body: "Hello!" });

// Sugar for whatsapp.messages.sendTemplate()
await whatsapp.sendTemplate("15551234567", {
  name: "order_confirmation",
  language: "en_US",
});`}
      />

      <h2>Next steps</h2>
      <ul>
        <li>
          <Link href="/docs/error-handling">
            Understand the <code>{"{ data, error }"}</code> pattern
          </Link>{" "}
          and error codes before wiring up error handling.
        </li>
        <li>
          <Link href="/docs/pagination">Learn about Auto-pagination</Link> for
          walking lists effortlessly.
        </li>
        <li>
          <Link href="/docs/webhooks">Set up webhooks</Link> to receive
          customer replies and message delivery statuses.
        </li>
        <li>
          <Link href="/docs/messages">Browse the Messages reference</Link>{" "}
          for media, interactive buttons, lists, carousels, locations, and reactions.
        </li>
        <li>
          <Link href="/docs/commerce">Explore Commerce & Catalogs</Link>{" "}
          for sending product and catalog messages.
        </li>
      </ul>
    </>
  );
}
