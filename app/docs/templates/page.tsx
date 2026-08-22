import { PageHeader, ParamTable, Callout, MethodSignature } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Templates — wapi-cloud docs" };

export default function TemplatesPage() {
  return (
    <>
      <PageHeader
        eyebrow="API reference"
        title="whatsapp.templates"
        description="Create, list, auto-paginate, fetch, update, and delete message templates including media carousels and catalog templates. Requires businessAccountId."
      />

      <Callout>
        WhatsApp Message Templates are required to initiate conversations with customers outside the 24-hour service window. Once created, templates go through Meta&apos;s automated and human approval before they can be sent.
      </Callout>

      <h2>create</h2>
      <MethodSignature>{"whatsapp.templates.create(input: CreateTemplateInput): Promise<WhatsappResponse<{ id: string; status: string; category: string }>>"}</MethodSignature>

      <h3>1. Standard text & quick-reply template</h3>
      <CodeBlock
        filename="create-template.ts"
        lang="ts"
        code={`const { data, error } = await whatsapp.templates.create({
  name: "order_status_v1",
  category: "UTILITY",
  language: "en_US",
  components: [
    {
      type: "HEADER",
      format: "TEXT",
      text: "Order {{1}} Update",
      example: { header_text: ["#1001"] },
    },
    {
      type: "BODY",
      text: "Hello {{1}}, your order has been {{2}}.",
      example: { body_text: [["John Doe", "shipped"]] },
    },
    {
      type: "FOOTER",
      text: "Thank you for shopping with Acme Store",
    },
    {
      type: "BUTTONS",
      buttons: [
        { type: "QUICK_REPLY", text: "Track Order" },
        { type: "URL", text: "Visit Store", url: "https://example.com/order/{{1}}", example: ["1001"] },
        { type: "PHONE_NUMBER", text: "Call Support", phone_number: "+15551234567" },
      ],
    },
  ],
});

if (!error) {
  console.log("Created template ID:", data.id, "Status:", data.status);
}`}
      />

      <h3>2. Media Carousel template (2 to 10 cards)</h3>
      <p>
        Create templates with horizontal swipeable media cards containing buttons:
      </p>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.templates.create({
  name: "product_carousel_deal",
  category: "MARKETING",
  language: "en_US",
  components: [
    {
      type: "BODY",
      text: "Check out our top deals today:",
    },
    {
      type: "CAROUSEL",
      cards: [
        {
          components: [
            { type: "HEADER", format: "IMAGE", example: { header_handle: ["4::..."] } },
            { type: "BODY", text: "Summer Sneakers - 30% Off" },
            { type: "BUTTONS", buttons: [{ type: "QUICK_REPLY", text: "Buy Now" }] },
          ],
        },
        {
          components: [
            { type: "HEADER", format: "IMAGE", example: { header_handle: ["4::..."] } },
            { type: "BODY", text: "Running Shorts - 20% Off" },
            { type: "BUTTONS", buttons: [{ type: "QUICK_REPLY", text: "Buy Now" }] },
          ],
        },
      ],
    },
  ],
});`}
      />

      <h3>3. Single-Product Catalog Template (SPM)</h3>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.templates.create({
  name: "spm_product_template",
  category: "MARKETING",
  language: "en_US",
  components: [
    { type: "HEADER", format: "PRODUCT" },
    { type: "BODY", text: "Special deal on {{1}}! Tap below to view details in WhatsApp." },
    { type: "BUTTONS", buttons: [{ type: "SPM" }] },
  ],
});`}
      />

      <h2>list & listAll</h2>
      <MethodSignature>{"whatsapp.templates.list(params?: ListTemplatesParams): Promise<WhatsappResponse<PaginatedResult<WhatsappTemplate>>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`// 1. Fetch a single page
const { data } = await whatsapp.templates.list({
  limit: 25,
  status: "APPROVED", // "APPROVED" | "PENDING" | "REJECTED" | "PAUSED" | "DISABLED"
});
data?.items.forEach((t) => console.log(t.name, t.category, t.status));

// 2. Auto-paginate through all templates across every page
for await (const template of whatsapp.templates.listAll()) {
  console.log("Template:", template.name, "Language:", template.language);
}`}
      />

      <h2>get</h2>
      <MethodSignature>{"whatsapp.templates.get(templateId: string): Promise<WhatsappResponse<WhatsappTemplate>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`const { data: template } = await whatsapp.templates.get("1234567890");
console.log(template?.name, template?.status, template?.components);`}
      />

      <h2>update</h2>
      <MethodSignature>{"whatsapp.templates.update(templateId: string, patch: UpdateTemplateInput): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.templates.update("1234567890", {
  components: [
    {
      type: "BODY",
      text: "Updated text: Hello {{1}}, your package has been delivered!",
    },
  ],
});`}
      />

      <h2>delete</h2>
      <MethodSignature>{"whatsapp.templates.delete(nameOrId: string): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.templates.delete("order_status_v1");`}
      />

      <h2>Template Categories</h2>
      <ParamTable
        rows={[
          {
            name: "UTILITY",
            type: "Transactional",
            description: "Account alerts, order confirmations, shipping updates, reminders, and customer service follow-ups.",
          },
          {
            name: "MARKETING",
            type: "Promotional",
            description: "Promotions, product offers, announcements, welcome messages, and newsletter updates.",
          },
          {
            name: "AUTHENTICATION",
            type: "Security & OTP",
            description: "One-time passcodes, identity verification codes, and password recovery verification.",
          },
        ]}
      />
    </>
  );
}
