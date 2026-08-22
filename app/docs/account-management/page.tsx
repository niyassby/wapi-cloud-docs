import { PageHeader, ParamTable, Callout, MethodSignature } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Account management — wapi-cloud docs" };

export default function AccountManagementPage() {
  return (
    <>
      <PageHeader
        eyebrow="API reference"
        title="Account management"
        description="Configure phone numbers, business profile information, two-step verification PINs, and number registration on the WhatsApp Cloud API."
      />

      <h2>whatsapp.phoneNumbers</h2>
      <p>
        Manage the business phone numbers associated with your WhatsApp Business Account (WABA).
      </p>

      <h3>list</h3>
      <MethodSignature>{"whatsapp.phoneNumbers.list(): Promise<WhatsappResponse<{ data: WhatsappPhoneNumber[] }>>"}</MethodSignature>
      <p>
        Lists all phone numbers attached to the configured <code>businessAccountId</code>:
      </p>
      <CodeBlock
        filename="phone-numbers.ts"
        lang="ts"
        code={`const { data, error } = await whatsapp.phoneNumbers.list();

if (data) {
  data.data.forEach((p) => {
    console.log(p.id, p.display_phone_number, p.verified_name, p.quality_rating);
  });
}`}
      />

      <h3>get</h3>
      <MethodSignature>{"whatsapp.phoneNumbers.get(phoneNumberId?: string): Promise<WhatsappResponse<WhatsappPhoneNumber>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`const { data: phone } = await whatsapp.phoneNumbers.get();
console.log("Quality rating:", phone?.quality_rating);
console.log("Verification status:", phone?.code_verification_status);`}
      />

      <h3>register & deregister</h3>
      <MethodSignature>{"whatsapp.phoneNumbers.register(input: { pin: string }, opts?): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <p>
        Registers the phone number for messaging on Cloud API by providing the 6-digit two-step verification PIN:
      </p>
      <CodeBlock
        lang="ts"
        code={`// 1. Register with a 6-digit 2FA PIN
await whatsapp.phoneNumbers.register({ pin: "123456" });

// 2. Deregister a phone number
await whatsapp.phoneNumbers.deregister();`}
      />

      <h3>requestVerificationCode & verifyCode</h3>
      <p>
        Used during phone number onboarding to request and submit SMS or Voice OTP codes:
      </p>
      <CodeBlock
        filename="verify-number.ts"
        lang="ts"
        code={`// 1. Request an SMS code to the business phone number
await whatsapp.phoneNumbers.requestVerificationCode({
  codeMethod: "SMS", // "SMS" | "VOICE"
  language: "en",
});

// 2. Submit the 6-digit OTP code received by SMS
await whatsapp.phoneNumbers.verifyCode({
  code: "582910",
});`}
      />

      <h3>updateSettings</h3>
      <MethodSignature>{"whatsapp.phoneNumbers.updateSettings(settings: Record<string, unknown>, opts?): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.phoneNumbers.updateSettings({
  // Custom number-level settings
});`}
      />

      <h2>whatsapp.businessProfile</h2>
      <p>
        Inspect and update your public WhatsApp Business profile that customers see when viewing your contact card:
      </p>

      <h3>get</h3>
      <MethodSignature>{"whatsapp.businessProfile.get(opts?): Promise<WhatsappResponse<BusinessProfile>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`const { data: profile } = await whatsapp.businessProfile.get();

if (profile) {
  console.log(profile.about, profile.address, profile.email, profile.websites);
}`}
      />

      <h3>update</h3>
      <MethodSignature>{"whatsapp.businessProfile.update(input: UpdateBusinessProfileInput, opts?): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <CodeBlock
        filename="update-profile.ts"
        lang="ts"
        code={`await whatsapp.businessProfile.update({
  about: "High-performance messaging for modern businesses.",
  description: "Official support and notifications channel.",
  address: "100 Market St, Suite 400, San Francisco, CA 94105",
  email: "support@example.com",
  websites: ["https://example.com", "https://help.example.com"],
  vertical: "PROFESSIONAL_SERVICES",
  profilePictureHandle: "4::...", // media handle from upload if changing profile picture
});`}
      />

      <h2>whatsapp.twoStepVerification</h2>
      <p>
        Sets or updates the 6-digit PIN required to register and secure the phone number:
      </p>
      <MethodSignature>{"whatsapp.twoStepVerification.set(input: { pin: string }, opts?): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.twoStepVerification.set({ pin: "987654" });`}
      />

      <Callout type="warning">
        Store two-step verification PINs securely like any other master password. They are required whenever a phone number is registered or migrated across Cloud API providers.
      </Callout>
    </>
  );
}
