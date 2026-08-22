import { PageHeader, ParamTable, Callout, MethodSignature } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Configuration — wapi-cloud docs" };

export default function ConfigurationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Getting started"
        title="Configuration"
        description="Everything the Whatsapp constructor accepts, runtime token management, rate limit monitoring, and multi-tenant setup."
      />

      <CodeBlock
        filename="whatsapp.ts"
        lang="ts"
        code={`import { Whatsapp } from "wapi-cloud";

const whatsapp = new Whatsapp({
  accessToken: process.env.WA_TOKEN!,
  phoneNumberId: process.env.WA_PHONE_ID!,
  businessAccountId: process.env.WA_WABA_ID,
  appId: process.env.WA_APP_ID,
  appSecret: process.env.WA_APP_SECRET,
  businessId: process.env.WA_BUSINESS_ID,
  apiVersion: "v21.0",
  maxRetries: 3,
  timeoutMs: 15000,
  onRequest: ({ method, url }) => {
    console.log("[WA API]", method, url);
  },
  onResponse: ({ method, url, status }) => {
    console.log("[WA API]", method, url, "→", status);
  },
});`}
      />

      <h2>Constructor options</h2>
      <ParamTable
        rows={[
          {
            name: "accessToken",
            type: "string",
            required: true,
            description:
              "Permanent or System User access token with whatsapp_business_messaging and whatsapp_business_management permissions.",
          },
          {
            name: "phoneNumberId",
            type: "string",
            required: true,
            description:
              "Default Phone Number ID used for sending messages and uploading media.",
          },
          {
            name: "businessAccountId",
            type: "string",
            description:
              "WhatsApp Business Account (WABA) ID. Required for templates, flows, qrCodes, analytics, and phoneNumbers.list().",
          },
          {
            name: "appSecret",
            type: "string",
            description:
              "Meta App Secret. Required for webhook signature verification (X-Hub-Signature-256) and Embedded Signup code exchange.",
          },
          {
            name: "appId",
            type: "string",
            description:
              "Meta App ID. Required for Embedded Signup code exchange and script generation.",
          },
          {
            name: "businessId",
            type: "string",
            description:
              "Meta Business Manager ID. Required only for whatsapp.catalogs.list(). Distinct from businessAccountId.",
          },
          {
            name: "apiVersion",
            type: "string",
            description:
              'Graph API version to target (e.g. "v21.0"). Defaults to a pinned stable version.',
          },
          {
            name: "baseUrl",
            type: "string",
            description:
              'Base Graph API URL. Defaults to "https://graph.facebook.com". Useful for mocking or proxying requests.',
          },
          {
            name: "fetch",
            type: "typeof fetch",
            description:
              "Custom fetch implementation (e.g. undici, node-fetch, or a testing stub).",
          },
          {
            name: "maxRetries",
            type: "number",
            description:
              "Maximum automatic retries with exponential backoff and jitter for 429 rate limits and 5xx server errors. Default: 3.",
          },
          {
            name: "timeoutMs",
            type: "number",
            description:
              "Per-request timeout in milliseconds before failing with a TimeoutError. Default: 15000.",
          },
          {
            name: "onRequest",
            type: "(info) => void",
            description:
              "Optional callback invoked before each HTTP request for logging/tracing.",
          },
          {
            name: "onResponse",
            type: "(info) => void",
            description:
              "Optional callback invoked after each HTTP response for metrics/logging.",
          },
        ]}
      />

      <h2>Runtime token management</h2>
      <p>
        If you rotate or refresh access tokens dynamically (e.g. using short-lived tokens), you can swap in a new token on an existing client instance without creating a new object:
      </p>
      <MethodSignature>{"whatsapp.setAccessToken(token: string): void"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`// Update token on the fly
whatsapp.setAccessToken(freshlyRefreshedToken);`}
      />

      <h2>Rate limit monitoring</h2>
      <p>
        The Graph API returns business use-case usage headers on responses. You can inspect the last seen header value at any time:
      </p>
      <MethodSignature>{"whatsapp.getRateLimitStatus(): string | null"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`const usageHeader = whatsapp.getRateLimitStatus();
if (usageHeader) {
  console.log("Current rate limit header:", usageHeader);
}`}
      />

      <h2>Partial configuration is supported</h2>
      <p>
        You don&apos;t need every option to start using wapi-cloud — only the
        modules you call check their corresponding config parameters. If you call a module
        that requires a missing value, it will not throw an exception; it returns a typed configuration error:
      </p>
      <CodeBlock
        lang="ts"
        code={`const whatsapp = new Whatsapp({
  accessToken: process.env.WA_TOKEN!,
  phoneNumberId: process.env.WA_PHONE_ID!,
  // businessAccountId omitted
});

const { data, error } = await whatsapp.templates.list();
// data === null
// error.type === "ConfigError"
// error.message === "businessAccountId is required in the Whatsapp client config to use whatsapp.templates.*"`}
      />

      <Callout>
        Always store <code>accessToken</code> and <code>appSecret</code> in
        secure environment variables or a secrets manager. Never expose them to client-side code.
      </Callout>

      <h2>Multi-tenant applications</h2>
      <p>
        Because configuration is scoped per instance, you can safely create multiple <code>Whatsapp</code> instances in multi-tenant or agency setups:
      </p>
      <CodeBlock
        filename="tenantClient.ts"
        lang="ts"
        code={`export function getTenantClient(tenant: {
  token: string;
  phoneId: string;
  wabaId: string;
}) {
  return new Whatsapp({
    accessToken: tenant.token,
    phoneNumberId: tenant.phoneId,
    businessAccountId: tenant.wabaId,
  });
}`}
      />
    </>
  );
}
