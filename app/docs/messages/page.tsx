import { PageHeader, ParamTable, Callout, MethodSignature } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Messages — wapi-cloud docs" };

export default function MessagesPage() {
  return (
    <>
      <PageHeader
        eyebrow="API reference"
        title="whatsapp.messages"
        description="Send every message type supported by the WhatsApp Cloud API: text, media, templates, interactive buttons/lists/CTA, carousels, catalogs, location, contacts, flows, and reactions."
      />

      <Callout>
        Every method in this module returns a <code>Promise&lt;WhatsappResponse&lt;SendMessageResult&gt;&gt;</code>{" "}
        following the <a href="/docs/error-handling">{"{ data, error }"}</a>{" "}
        contract. The recipient phone number must be in international format without leading plus (e.g. <code>15551234567</code>).
      </Callout>

      <h2>Optional third parameter: opts</h2>
      <p>
        Every message-sending method accepts an optional trailing <code>opts</code> object:
      </p>
      <CodeBlock
        lang="ts"
        code={`{
  phoneNumberId?: string;    // Override the sender phone number for this call
  replyToMessageId?: string; // Send as a contextual quote reply to a specific inbound message
}`}
      />

      <h2>sendText</h2>
      <MethodSignature>{"whatsapp.messages.sendText(to: string, options: TextMessageOptions, opts?): Promise<WhatsappResponse<SendMessageResult>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`const { data, error } = await whatsapp.messages.sendText("15551234567", {
  body: "Hello from wapi-cloud! Check out https://github.com/niyassby/wapi-cloud",
  previewUrl: true, // Generate a web preview card for URLs in the text
});

if (data) console.log("Message ID:", data.messageId, "WA ID:", data.waId);`}
      />

      <h2>reply (Contextual quote reply)</h2>
      <MethodSignature>{"whatsapp.messages.reply(to: string, messageId: string, options: TextMessageOptions, opts?): Promise<WhatsappResponse<SendMessageResult>>"}</MethodSignature>
      <p>
        Convenience method that quotes a specific inbound message ID when sending a text reply:
      </p>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.reply(
  "15551234567",
  "wamid.HBgLM...", // Inbound message ID to quote
  { body: "Thanks for your inquiry! We are processing your request." }
);`}
      />

      <h2>Media Messages (Images, Video, Audio, Document, Sticker)</h2>
      <p>
        Media methods accept either a hosted public HTTPS <code>link</code> or a <code>mediaId</code> returned from <a href="/docs/media">whatsapp.media.upload()</a>:
      </p>
      <CodeBlock
        filename="media-messages.ts"
        lang="ts"
        code={`// 1. Send Image
await whatsapp.messages.sendImage("15551234567", {
  link: "https://example.com/receipt.jpg",
  caption: "Your purchase receipt for Order #8821",
});

// 2. Send Document (with custom filename)
await whatsapp.messages.sendDocument("15551234567", {
  mediaId: uploadedDocId,
  filename: "Financial_Report_2026.pdf",
  caption: "Q2 Financial Summary",
});

// 3. Send Video
await whatsapp.messages.sendVideo("15551234567", {
  link: "https://example.com/demo.mp4",
  caption: "Product walkthrough video",
});

// 4. Send Audio (voice notes / audio files)
await whatsapp.messages.sendAudio("15551234567", {
  link: "https://example.com/audio-message.ogg",
});

// 5. Send Sticker (WebP format)
await whatsapp.messages.sendSticker("15551234567", {
  mediaId: stickerMediaId,
});`}
      />

      <h2>sendInteractive (Buttons, Lists, CTA URL)</h2>
      <p>
        Interactive messages provide structured UI elements in the chat window:
      </p>

      <h3>1. Quick-reply buttons (1 to 3 buttons)</h3>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.sendInteractive("15551234567", {
  type: "button",
  header: "Appointment Confirmation",
  body: "Would you like to confirm your appointment for tomorrow at 3:00 PM?",
  footer: "Reply by selecting an option below",
  buttons: [
    { id: "btn_confirm", title: "Confirm ✅" },
    { id: "btn_reschedule", title: "Reschedule 📅" },
    { id: "btn_cancel", title: "Cancel ❌" },
  ],
});`}
      />

      <h3>2. Interactive List menu (up to 10 rows across sections)</h3>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.sendInteractive("15551234567", {
  type: "list",
  header: "Support Menu",
  body: "Please choose a department to connect with:",
  footer: "Available 24/7",
  buttonText: "View Options",
  sections: [
    {
      title: "Technical Support",
      rows: [
        { id: "dept_cloud", title: "Cloud Infrastructure", description: "Servers, uptime, scaling" },
        { id: "dept_api", title: "API Integration", description: "Webhooks, SDK questions" },
      ],
    },
    {
      title: "Billing & Sales",
      rows: [
        { id: "dept_billing", title: "Invoices & Payments", description: "View or update payment info" },
      ],
    },
  ],
});`}
      />

      <h3>3. CTA URL Button (Open web link)</h3>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.sendInteractive("15551234567", {
  type: "cta_url",
  header: "New Release",
  body: "wapi-cloud v1.0 is now live with full TypeScript support!",
  footer: "Documentation & Examples",
  displayText: "Read Documentation",
  url: "https://github.com/niyassby/wapi-cloud",
});`}
      />

      <h2>sendTemplate</h2>
      <p>
        Sends pre-approved message templates with dynamic variable substitutions:
      </p>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.sendTemplate("15551234567", {
  name: "order_status_update",
  language: "en_US",
  components: [
    {
      type: "header",
      parameters: [{ type: "text", text: "ORDER-991" }],
    },
    {
      type: "body",
      parameters: [
        { type: "text", text: "Alex" },
        { type: "text", text: "Shipped" },
      ],
    },
    {
      type: "button",
      sub_type: "quick_reply",
      index: 0,
      parameters: [{ type: "payload", payload: "TRACK_PACKAGE" }],
    },
  ],
});`}
      />

      <h2>sendCatalogTemplate (Single-Product Template SPM)</h2>
      <p>
        Sends an approved single-product message template where product details are fetched from your Meta catalog automatically:
      </p>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.sendCatalogTemplate("15551234567", {
  name: "featured_product_promo",
  language: "en_US",
  catalogId: "1234567890",
  productRetailerId: "SKU-9921",
  bodyParams: [{ type: "text", text: "20% Discount" }],
});`}
      />

      <h2>sendCarouselTemplate (Template with Media Cards)</h2>
      <p>
        Sends an approved media-card carousel template with 2 to 10 swipeable cards:
      </p>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.sendCarouselTemplate("15551234567", {
  name: "holiday_promotions",
  language: "en_US",
  bodyParams: [{ type: "text", text: "Exclusive Member Deals" }],
  cards: [
    {
      headerType: "image",
      headerMediaId: "media_id_1",
      bodyParams: [{ type: "text", text: "Deal 1: 30% Off Shoes" }],
      buttons: [
        {
          subType: "url",
          index: 0,
          parameters: [{ type: "text", text: "shoes-sale" }],
        },
      ],
    },
    {
      headerType: "image",
      headerMediaId: "media_id_2",
      bodyParams: [{ type: "text", text: "Deal 2: Buy 1 Get 1 Shirts" }],
      buttons: [
        {
          subType: "url",
          index: 0,
          parameters: [{ type: "text", text: "shirts-sale" }],
        },
      ],
    },
  ],
});`}
      />

      <h2>sendLocation & sendLocationRequest</h2>
      <CodeBlock
        filename="location.ts"
        lang="ts"
        code={`// 1. Send specific location pin
await whatsapp.messages.sendLocation("15551234567", {
  latitude: 37.4849,
  longitude: -122.1483,
  name: "Meta Headquarters",
  address: "1 Hacker Way, Menlo Park, CA 94025",
});

// 2. Request user to share their current live location
await whatsapp.messages.sendLocationRequest("15551234567", {
  body: "Please share your current location so our courier can find you:",
});`}
      />

      <h2>sendContacts</h2>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.sendContacts("15551234567", [
  {
    name: {
      formattedName: "Sarah Connor",
      firstName: "Sarah",
      lastName: "Connor",
    },
    phones: [
      { phone: "+15550192834", type: "WORK", waId: "15550192834" },
    ],
    emails: [
      { email: "sarah@example.com", type: "WORK" },
    ],
  },
]);`}
      />

      <h2>sendFlow (Interactive WhatsApp Flows v3)</h2>
      <p>
        Launches an interactive native form screen directly inside the chat:
      </p>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.sendFlow("15551234567", {
  flowId: "9876543210",
  cta: "Book Appointment",
  headerText: "Dentist Booking",
  bodyText: "Tap below to select your service and preferred time slot:",
  footerText: "Fast and easy booking",
  flowActionPayload: {
    screen: "APPOINTMENT_SELECTION",
    data: { serviceId: "clean-01" },
  },
});`}
      />

      <h2>sendReaction</h2>
      <CodeBlock
        lang="ts"
        code={`// Add reaction emoji
await whatsapp.messages.sendReaction("15551234567", {
  messageId: "wamid.HBgLM...",
  emoji: "👍",
});

// Remove reaction by passing an empty string
await whatsapp.messages.sendReaction("15551234567", {
  messageId: "wamid.HBgLM...",
  emoji: "",
});`}
      />

      <h2>Commerce Messages (sendProduct, sendProductList, sendCatalog, sendProductCarousel)</h2>
      <CodeBlock
        filename="commerce-messages.ts"
        lang="ts"
        code={`// 1. Single Product
await whatsapp.messages.sendProduct("15551234567", {
  catalogId: "1234567890",
  productRetailerId: "ITEM-101",
  body: "Check out this item!",
  footer: "In stock",
});

// 2. Multi-Product List
await whatsapp.messages.sendProductList("15551234567", {
  catalogId: "1234567890",
  header: "Electronics Sale",
  body: "Select a device to view specs:",
  sections: [
    { title: "Phones", productRetailerIds: ["PHONE-A", "PHONE-B"] },
    { title: "Audio", productRetailerIds: ["AUDIO-X"] },
  ],
});

// 3. Browse Full Catalog
await whatsapp.messages.sendCatalog("15551234567", {
  body: "Browse our entire inventory right here on WhatsApp:",
});

// 4. Product Carousel (2 to 10 products)
await whatsapp.messages.sendProductCarousel("15551234567", {
  body: "Recommended for you:",
  cards: [
    { catalogId: "1234567890", productRetailerId: "ITEM-101" },
    { catalogId: "1234567890", productRetailerId: "ITEM-102" },
  ],
});`}
      />

      <h2>sendMediaCarousel (Image/Video Carousel with Buttons)</h2>
      <CodeBlock
        lang="ts"
        code={`await whatsapp.messages.sendMediaCarousel("15551234567", {
  body: "Swipe through our new arrivals:",
  cards: [
    {
      type: "cta_url",
      headerType: "image",
      headerMedia: { link: "https://example.com/jacket.jpg" },
      body: "Winter Jacket - $89",
      displayText: "Buy Online",
      url: "https://example.com/store/jacket",
    },
    {
      type: "cta_url",
      headerType: "image",
      headerMedia: { link: "https://example.com/boots.jpg" },
      body: "Leather Boots - $120",
      displayText: "Buy Online",
      url: "https://example.com/store/boots",
    },
  ],
});`}
      />

      <h2>markAsRead</h2>
      <CodeBlock
        lang="ts"
        code={`// Marks message as read and shows the typing indicator
await whatsapp.messages.markAsRead("wamid.HBgLM...");`}
      />

      <h2>Root shortcuts</h2>
      <CodeBlock
        lang="ts"
        code={`// Direct sugar on the main client
await whatsapp.send("15551234567", { body: "Quick message" });
await whatsapp.sendTemplate("15551234567", { name: "alert", language: "en" });`}
      />
    </>
  );
}
