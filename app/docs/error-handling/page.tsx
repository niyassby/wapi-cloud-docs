import { PageHeader, ParamTable, Callout } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Error handling — wapi-cloud docs" };

export default function ErrorHandlingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Core concepts"
        title="The { data, error } result"
        description="Every wapi-cloud method resolves to a consistent response object — it never throws for expected API, network, or validation failures."
      />

      <p>
        Instead of throwing exceptions on failed requests, every method in wapi-cloud returns a promise that resolves to a strongly-typed <code>WhatsappResponse&lt;T&gt;</code> object. Exactly one of <code>data</code> or <code>error</code> will be non-null:
      </p>

      <CodeBlock
        lang="ts"
        code={`interface WhatsappResponse<T> {
  data: T | null;
  error: WhatsappApiError | null;
  status: number;      // HTTP status code (0 for network/client errors)
  statusText: string;  // HTTP status text
  raw: unknown;        // Untouched raw JSON payload from Meta Graph API
}`}
      />

      <h2>Checking a result with TypeScript</h2>
      <p>
        Because <code>data</code> and <code>error</code> are mutually
        exclusive, checking <code>error</code> first lets TypeScript narrow{" "}
        <code>data</code> to its non-null type automatically:
      </p>
      <CodeBlock
        lang="ts"
        code={`const { data, error, status } = await whatsapp.templates.list();

if (error) {
  // data is narrowed to null
  console.error("[" + error.type + "] Code " + error.code + ": " + error.message);
  if (error.fbtraceId) console.error("Trace ID for Meta support:", error.fbtraceId);
  return;
}

// error is narrowed to null — data.items is 100% type-safe
console.log("Fetched " + data.items.length + " templates (HTTP " + status + ")");`}
      />

      <h2>The WhatsappApiError class</h2>
      <p>
        Every failure is normalized into a <code>WhatsappApiError</code> instance attached to <code>response.error</code>:
      </p>
      <ParamTable
        rows={[
          {
            name: "code",
            type: "number",
            description:
              "Meta Graph API numeric error code (e.g. 131047 for outside 24h window). 0 for network/client failures.",
          },
          {
            name: "type",
            type: "string",
            description:
              'Error category: "OAuthException", "ClientError", "ConfigError", "NetworkError", "TimeoutError", or Graph API type.',
          },
          {
            name: "message",
            type: "string",
            description:
              "Human-readable description with automatic hint for known WhatsApp error codes.",
          },
          {
            name: "subcode",
            type: "number | undefined",
            description: "Meta error subcode, if provided in the Graph response.",
          },
          {
            name: "httpStatus",
            type: "number",
            description: "HTTP status code (e.g. 400, 401, 404, 429, 500). 0 for network dropouts.",
          },
          {
            name: "isRetryable",
            type: "boolean",
            description:
              "True if the error was caused by a rate limit (429), temporary 5xx server glitch, or transient network error.",
          },
          {
            name: "fbtraceId",
            type: "string | undefined",
            description:
              "Meta's internal diagnostic trace ID for the request, helpful when submitting support tickets to Meta.",
          },
          {
            name: "raw",
            type: "unknown",
            description:
              "The unmodified raw JSON error payload from the Graph API.",
          },
        ]}
      />

      <h2>Automatic retries & backoff</h2>
      <p>
        wapi-cloud automatically retries failed requests that return HTTP 429 (rate limits) or 5xx (server errors) up to <code>maxRetries</code> times (default: 3). Retries use exponential backoff with full jitter and respect <code>Retry-After</code> headers.
      </p>

      <h2>Common WhatsApp error codes</h2>
      <p>
        wapi-cloud includes built-in descriptions for common Graph API error codes:
      </p>
      <ParamTable
        rows={[
          {
            name: "131047",
            type: "Re-engagement required",
            description: "Outside the 24-hour customer service window. You must use an approved template message to contact this user.",
          },
          {
            name: "131021",
            type: "Invalid recipient",
            description: "Recipient phone number is invalid or not registered on WhatsApp.",
          },
          {
            name: "131005",
            type: "Invalid access token",
            description: "Access token has expired, been revoked, or is missing permissions.",
          },
          {
            name: "131026",
            type: "Undeliverable message",
            description: "Message could not be delivered to the recipient.",
          },
          {
            name: "131031",
            type: "Account restricted",
            description: "WhatsApp Business Account has been restricted or disabled by Meta.",
          },
          {
            name: "131042",
            type: "Payment issue",
            description: "Payment or billing issue detected on the WhatsApp Business Account.",
          },
          {
            name: "132000",
            type: "Parameter mismatch",
            description: "Number of parameters passed does not match the template definition.",
          },
          {
            name: "132001",
            type: "Template not found",
            description: "Template does not exist in the specified language, or is not approved yet.",
          },
          {
            name: "132005",
            type: "Template paused",
            description: "Template has been temporarily paused by Meta due to low quality rating from recipient feedback.",
          },
          {
            name: "133005",
            type: "Unregistered number",
            description: "Phone number is not registered on WhatsApp Cloud API. Call phoneNumbers.register() first.",
          },
        ]}
      />

      <h2>Why no try/catch?</h2>
      <p>
        In messaging applications, expected operational states — rate limits, unapproved templates, or customers outside the 24-hour window — are normal program outcomes, not fatal runtime crashes.
      </p>
      <ul>
        <li>
          <strong>Compile-time safety:</strong> You cannot accidentally forget to handle an error — TypeScript prevents accessing <code>data</code> properties without checking <code>error</code> first.
        </li>
        <li>
          <strong>Batch resilience:</strong> Using <code>Promise.all()</code> across hundreds of messages won&apos;t abort early if a single recipient is invalid.
        </li>
        <li>
          <strong>Clean async code:</strong> No nested <code>try/catch</code> boilerplate cluttering your business logic.
        </li>
      </ul>
    </>
  );
}
