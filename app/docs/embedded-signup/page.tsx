import { PageHeader, ParamTable, Callout, MethodSignature } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Embedded Signup — wapi-cloud docs" };

export default function EmbeddedSignupPage() {
  return (
    <>
      <PageHeader
        eyebrow="API reference"
        title="whatsapp.embeddedSignup"
        description="Onboard customers to the WhatsApp Cloud API directly inside your application using Meta Embedded Signup."
      />

      <p>
        Meta&apos;s <strong>Embedded Signup</strong> (Facebook Login for Business) lets your users connect their own WhatsApp Business Account to your platform with an in-app popup — without manually navigating Meta Business Manager or creating developer apps.
      </p>

      <p>
        The <code>whatsapp.embeddedSignup</code> module provides helpers for generating the client popup script, exchanging the short-lived authorization code for a long-lived Business Integration token on your backend, and subscribing your app to the new WABA&apos;s webhooks.
      </p>

      <h2>The onboarding flow</h2>
      <ol className="list-decimal pl-5 space-y-2 text-paper-300">
        <li>
          <strong>Frontend:</strong> Render the Facebook JavaScript SDK popup with your Login for Business configuration ID.
        </li>
        <li>
          <strong>Browser response:</strong> When the user finishes the popup, Meta returns a short-lived <code>code</code> (and sends a <code>window.postMessage</code> containing <code>phone_number_id</code> and <code>waba_id</code>).
        </li>
        <li>
          <strong>Backend exchange:</strong> Send the <code>code</code> to your server and call <code>whatsapp.embeddedSignup.exchangeCodeForToken(code)</code> to obtain a System User access token.
        </li>
        <li>
          <strong>Webhook subscription:</strong> Call <code>{"whatsapp.embeddedSignup.subscribeToWaba(wabaId, { accessTokenOverride })"}</code> so your application receives incoming messages and delivery receipts for that customer.
        </li>
      </ol>

      <h2>1. Generate the Frontend Script</h2>
      <MethodSignature>{"whatsapp.embeddedSignup.getLoginScript(options: EmbeddedSignupLoginScriptOptions): string"}</MethodSignature>
      <p>
        Generates the standard HTML <code>&lt;script&gt;</code> and <code>&lt;button&gt;</code> markup for initiating <code>FB.login()</code> with your configuration ID:
      </p>
      <CodeBlock
        filename="signup-button.ts"
        lang="ts"
        code={`const scriptHtml = whatsapp.embeddedSignup.getLoginScript({
  appId: process.env.WA_APP_ID!,
  configId: process.env.WA_EMBEDDED_CONFIG_ID!,
  triggerElementId: "connect-whatsapp-btn",
  graphApiVersion: "v21.0",
});`}
      />

      <h2>2. Exchange Authorization Code for Access Token</h2>
      <MethodSignature>{"whatsapp.embeddedSignup.exchangeCodeForToken(code: string): Promise<WhatsappResponse<ExchangedEmbeddedSignupToken>>"}</MethodSignature>
      <p>
        Exchanges the short-lived OAuth authorization <code>code</code> sent from the browser callback for a Business Integration access token. Requires <code>appId</code> and <code>appSecret</code> in the client configuration.
      </p>
      <CodeBlock
        filename="api/whatsapp/embedded-signup/callback.ts"
        lang="ts"
        code={`import { whatsapp } from "@/lib/whatsapp";

export async function POST(req: Request) {
  const { code } = await req.json();

  // Exchange the short-lived code for a system user access token
  const { data: tokenData, error: tokenError } =
    await whatsapp.embeddedSignup.exchangeCodeForToken(code);

  if (tokenError) {
    return Response.json({ error: tokenError.message }, { status: 400 });
  }

  const { accessToken } = tokenData;

  // Store accessToken, wabaId, and phoneNumberId in your database for this tenant
  return Response.json({ success: true, accessToken });
}`}
      />

      <h2>3. Subscribe to the Customer's WABA Webhooks</h2>
      <MethodSignature>{"whatsapp.embeddedSignup.subscribeToWaba(businessAccountId: string, opts?: { accessTokenOverride?: string }): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <p>
        Subscribes your Meta App to receive webhook events for the customer&apos;s newly linked WhatsApp Business Account. Pass the customer&apos;s fresh token via <code>accessTokenOverride</code>:
      </p>
      <CodeBlock
        filename="subscribe.ts"
        lang="ts"
        code={`const { data, error } = await whatsapp.embeddedSignup.subscribeToWaba(
  customerWabaId,
  { accessTokenOverride: customerAccessToken }
);

if (error) {
  console.error("Failed to subscribe WABA to webhooks:", error.message);
} else {
  console.log("Successfully subscribed to customer WABA webhooks!");
}`}
      />

      <Callout>
        Always pass <code>accessTokenOverride</code> when calling <code>subscribeToWaba</code> for an Embedded Signup tenant, because the subscription call must be authenticated with that customer&apos;s token rather than your system-wide token.
      </Callout>

      <h2>Parameters and Options</h2>
      <ParamTable
        rows={[
          {
            name: "appId",
            type: "string",
            required: true,
            description: "Your Meta App ID (configured in Whatsapp constructor or script options).",
          },
          {
            name: "appSecret",
            type: "string",
            required: true,
            description: "Your Meta App Secret, used for server-side OAuth code exchange.",
          },
          {
            name: "configId",
            type: "string",
            required: true,
            description: "Facebook Login for Business configuration ID created in your Meta App Dashboard.",
          },
          {
            name: "code",
            type: "string",
            required: true,
            description: "The short-lived authorization code from the popup window callback.",
          },
          {
            name: "accessTokenOverride",
            type: "string",
            description: "Temporary or tenant-specific token to authenticate the subscription request.",
          },
        ]}
      />
    </>
  );
}
