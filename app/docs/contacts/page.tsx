import { PageHeader, ParamTable, Callout, MethodSignature } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Contacts — wapi-cloud docs" };

export default function ContactsPage() {
  return (
    <>
      <PageHeader
        eyebrow="API reference"
        title="whatsapp.contacts"
        description="Verify WhatsApp registration status for phone numbers before sending outreach, and manage blocked user lists."
      />

      <h2>check</h2>
      <MethodSignature>{"whatsapp.contacts.check(phoneNumbers: string[], opts?: { phoneNumberId?: string }): Promise<WhatsappResponse<ContactCheckResult[]>>"}</MethodSignature>
      <p>
        Verifies whether one or more phone numbers are registered WhatsApp accounts, returning the associated WhatsApp ID (<code>waId</code>) for valid contacts:
      </p>
      <CodeBlock
        filename="check-contacts.ts"
        lang="ts"
        code={`const { data: results, error } = await whatsapp.contacts.check([
  "15551234567",
  "15559876543",
  "447123456789",
]);

if (results) {
  results.forEach((c) => {
    if (c.status === "valid") {
      console.log("✅ Valid contact: " + c.input + " → WA ID: " + c.waId);
    } else {
      console.log("❌ Not on WhatsApp: " + c.input);
    }
  });
}`}
      />

      <h2>block</h2>
      <MethodSignature>{"whatsapp.contacts.block(waIds: string[], opts?: { phoneNumberId?: string }): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <p>
        Blocks one or more WhatsApp users by their WhatsApp ID, preventing incoming messages from reaching your webhook:
      </p>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.contacts.block(["15551234567"]);`}
      />

      <h2>unblock</h2>
      <MethodSignature>{"whatsapp.contacts.unblock(waIds: string[], opts?: { phoneNumberId?: string }): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.contacts.unblock(["15551234567"]);`}
      />

      <h2>listBlocked</h2>
      <MethodSignature>{"whatsapp.contacts.listBlocked(opts?: { phoneNumberId?: string }): Promise<WhatsappResponse<{ waId: string }[]>>"}</MethodSignature>
      <p>
        Retrieves the list of all currently blocked WhatsApp IDs for the phone number:
      </p>
      <CodeBlock
        lang="ts"
        code={`const { data: blockedList } = await whatsapp.contacts.listBlocked();
console.log("Blocked users:", blockedList);`}
      />

      <h2>ContactCheckResult shape</h2>
      <ParamTable
        rows={[
          {
            name: "input",
            type: "string",
            description: "The phone number string exactly as supplied in your input array.",
          },
          {
            name: "waId",
            type: "string | undefined",
            description: "The official WhatsApp ID (digits only) to target when sending messages.",
          },
          {
            name: "status",
            type: '"valid" | "invalid"',
            description: "Whether the user account is active and registered on WhatsApp.",
          },
        ]}
      />
    </>
  );
}
