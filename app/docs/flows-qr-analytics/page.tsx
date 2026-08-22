import { PageHeader, ParamTable, Callout, MethodSignature } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Flows, QR codes & analytics — wapi-cloud docs" };

export default function FlowsQrAnalyticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="API reference"
        title="Flows, QR codes & analytics"
        description="Build native interactive in-chat forms with WhatsApp Flows, generate scan-to-chat QR codes, and query rich WABA messaging metrics."
      />

      <h2>whatsapp.flows</h2>
      <p>
        WhatsApp Flows allow businesses to build rich, native multi-screen experiences (forms, surveys, appointment booking, lead generation, customer support) directly inside WhatsApp without redirecting to a browser.
      </p>

      <h3>1. Create a Flow</h3>
      <MethodSignature>{"whatsapp.flows.create(input: CreateFlowInput): Promise<WhatsappResponse<{ id: string; success?: boolean }>>"}</MethodSignature>
      <CodeBlock
        filename="create-flow.ts"
        lang="ts"
        code={`const { data: flow, error } = await whatsapp.flows.create({
  name: "appointment_booking_v1",
  categories: ["APPOINTMENT_BOOKING"],
  // Optional: Supply initial JSON definition or endpoint URI for data exchange flows
  endpointUri: "https://example.com/api/whatsapp/flows/data-exchange",
});

if (flow) {
  console.log("Created Flow ID:", flow.id);
}`}
      />

      <h3>2. Update Flow JSON Asset</h3>
      <MethodSignature>{"whatsapp.flows.updateJson(flowId: string, flowJson: object): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <p>
        Uploads the Flow JSON layout definition specifying screens, inputs, and actions:
      </p>
      <CodeBlock
        filename="update-flow-json.ts"
        lang="ts"
        code={`await whatsapp.flows.updateJson("flow_id_12345", {
  version: "3.1",
  screens: [
    {
      id: "APPOINTMENT_SCREEN",
      title: "Select Service",
      data: {},
      layout: {
        type: "SingleColumnLayout",
        children: [
          {
            type: "Dropdown",
            name: "service_type",
            label: "Select Service",
            required: true,
            "data-source": [
              { id: "consult", title: "General Consultation" },
              { id: "teeth_clean", title: "Teeth Cleaning" },
            ],
          },
          {
            type: "Footer",
            label: "Book Now",
            "on-click-action": {
              name: "complete",
              payload: { service: "\${form.service_type}" },
            },
          },
        ],
      },
    },
  ],
});`}
      />

      <h3>3. Publish, Deprecate & Delete Flows</h3>
      <CodeBlock
        lang="ts"
        code={`// Publish a flow (makes it available to send to customers)
await whatsapp.flows.publish("flow_id_12345");

// List all flows
const { data: flows } = await whatsapp.flows.list();

// Deprecate or delete
await whatsapp.flows.deprecate("flow_id_12345");
await whatsapp.flows.delete("flow_id_12345");`}
      />

      <h3>4. Send Flow to Customer</h3>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.sendFlow("15551234567", {
  flowId: "flow_id_12345",
  cta: "Start Booking",
  headerText: "Book Your Visit",
  bodyText: "Tap the button below to choose your date and time:",
  footerText: "Appointments available this week",
  flowActionPayload: {
    screen: "APPOINTMENT_SCREEN",
  },
});`}
      />

      <h2>whatsapp.qrCodes</h2>
      <p>
        Generate deep-link QR codes that launch a direct WhatsApp chat with your business phone number and pre-fill an introductory message.
      </p>

      <h3>create</h3>
      <MethodSignature>{"whatsapp.qrCodes.create(input: { prefilledMessage: string }, opts?): Promise<WhatsappResponse<WhatsappQrCode>>"}</MethodSignature>
      <CodeBlock
        filename="qr-codes.ts"
        lang="ts"
        code={`const { data: qr, error } = await whatsapp.qrCodes.create({
  prefilledMessage: "Hello! I saw your flyer and would like a quote.",
});

if (qr) {
  console.log("QR Code identifier:", qr.code);
  console.log("Deep link URL:", qr.deep_link_url); // https://wa.me/message/...
  console.log("QR Image URL (PNG):", qr.qr_image_url);
}`}
      />

      <h3>list, get, update & delete</h3>
      <CodeBlock
        lang="ts"
        code={`// List all QR codes
const { data: codes } = await whatsapp.qrCodes.list();

// Get specific QR code
const { data: code } = await whatsapp.qrCodes.get("QR_CODE_ID");

// Update prefilled message
await whatsapp.qrCodes.update("QR_CODE_ID", {
  prefilledMessage: "Updated campaign message",
});

// Delete QR code
await whatsapp.qrCodes.delete("QR_CODE_ID");`}
      />

      <h2>whatsapp.analytics</h2>
      <p>
        Retrieve granular messaging metrics, conversation breakdown counts, and pricing analytics for your WhatsApp Business Account.
      </p>

      <CodeBlock
        filename="analytics.ts"
        lang="ts"
        code={`const query = {
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  end: new Date(),
  granularity: "DAY" as const, // "HALF_HOUR" | "DAY" | "MONTH"
};

// 1. Messaging analytics (sent, delivered)
const { data: messagingData } = await whatsapp.analytics.getMessagingAnalytics(query);

// 2. Conversation analytics (user-initiated, business-initiated)
const { data: convData } = await whatsapp.analytics.getConversationAnalytics(query);

// 3. Pricing analytics (cost per category)
const { data: pricingData } = await whatsapp.analytics.getPricingAnalytics(query);`}
      />

      <h2>Flow Categories</h2>
      <ParamTable
        rows={[
          { name: "SIGN_UP", type: "FlowCategory", description: "Account creation and customer onboarding forms." },
          { name: "SIGN_IN", type: "FlowCategory", description: "Login and authentication verification." },
          { name: "APPOINTMENT_BOOKING", type: "FlowCategory", description: "Scheduling, reservations, and time-slot booking." },
          { name: "LEAD_GENERATION", type: "FlowCategory", description: "Collecting customer contact information and interest surveys." },
          { name: "CONTACT_US", type: "FlowCategory", description: "Customer inquiry and contact forms." },
          { name: "CUSTOMER_SUPPORT", type: "FlowCategory", description: "Support tickets, issue reporting, and troubleshooting flows." },
          { name: "SURVEY", type: "FlowCategory", description: "Feedback questionnaires and NPS ratings." },
          { name: "OTHER", type: "FlowCategory", description: "Custom business-specific forms." },
        ]}
      />
    </>
  );
}
