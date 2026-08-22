export const modules = [
  {
    key: "messages",
    name: "messages",
    title: "Messages",
    href: "/docs/messages",
    description:
      "Send text, media, templates, interactive buttons/lists/CTA, carousels, contacts, location, reactions, and flows.",
  },
  {
    key: "templates",
    name: "templates",
    title: "Templates",
    href: "/docs/templates",
    description:
      "Create, list, auto-paginate, get, update and delete message templates including carousels and SPM templates.",
  },
  {
    key: "media",
    name: "media",
    title: "Media",
    href: "/docs/media",
    description:
      "Upload media files, retrieve metadata with temp download URLs, download raw binary data, and delete assets.",
  },
  {
    key: "contacts",
    name: "contacts",
    title: "Contacts",
    href: "/docs/contacts",
    description:
      "Check WhatsApp registration validity for phone numbers, block users, unblock users, and list blocked contacts.",
  },
  {
    key: "phoneNumbers",
    name: "phoneNumbers",
    title: "Phone numbers",
    href: "/docs/account-management",
    description:
      "List, get, register with 2FA PIN, deregister, request SMS/voice verification codes, and verify phone numbers.",
  },
  {
    key: "businessProfile",
    name: "businessProfile",
    title: "Business profile",
    href: "/docs/account-management",
    description:
      "Read and update your WhatsApp Business profile details: about, address, description, email, websites, industry, and picture.",
  },
  {
    key: "twoStepVerification",
    name: "twoStepVerification",
    title: "Two-step verification",
    href: "/docs/account-management",
    description:
      "Set or update the 6-digit PIN used to re-register and secure a phone number on WhatsApp Cloud API.",
  },
  {
    key: "catalogs",
    name: "catalogs",
    title: "Catalogs",
    href: "/docs/commerce",
    description:
      "List Meta product catalogs, look up catalog details, verify WABA catalog connections, and send product messages.",
  },
  {
    key: "products",
    name: "products",
    title: "Products",
    href: "/docs/commerce",
    description:
      "List, get, create, update and delete catalog products with price, currency, availability, condition, and imagery.",
  },
  {
    key: "commerceSettings",
    name: "commerceSettings",
    title: "Commerce settings",
    href: "/docs/commerce",
    description:
      "Check and configure WhatsApp commerce settings: toggle catalog visibility and enable/disable the in-chat cart.",
  },
  {
    key: "flows",
    name: "flows",
    title: "Flows",
    href: "/docs/flows-qr-analytics",
    description:
      "Create, list, update Flow JSON asset files, publish, deprecate, and delete native in-chat interactive WhatsApp Flows.",
  },
  {
    key: "qrCodes",
    name: "qrCodes",
    title: "QR codes",
    href: "/docs/flows-qr-analytics",
    description:
      "Create, list, get, update and delete deep link QR codes with pre-filled messages that launch a WhatsApp chat.",
  },
  {
    key: "analytics",
    name: "analytics",
    title: "Analytics",
    href: "/docs/flows-qr-analytics",
    description:
      "Query messaging analytics, conversation volume, and pricing analytics for your WABA by date range and granularity.",
  },
  {
    key: "embeddedSignup",
    name: "embeddedSignup",
    title: "Embedded Signup",
    href: "/docs/embedded-signup",
    description:
      "Generate client-side onboarding login scripts, exchange OAuth code for system user tokens, and subscribe to WABAs.",
  },
] as const;

export const docsNav = [
  {
    group: "Getting started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "Quick start", href: "/docs/quick-start" },
      { title: "Configuration", href: "/docs/configuration" },
    ],
  },
  {
    group: "Core concepts",
    items: [
      { title: "The { data, error } result", href: "/docs/error-handling" },
      { title: "Auto-pagination", href: "/docs/pagination" },
    ],
  },
  {
    group: "API reference",
    items: [
      { title: "Messages", href: "/docs/messages" },
      { title: "Templates", href: "/docs/templates" },
      { title: "Media", href: "/docs/media" },
      { title: "Contacts", href: "/docs/contacts" },
      { title: "Account management", href: "/docs/account-management" },
      { title: "Commerce & Catalogs", href: "/docs/commerce" },
      { title: "Flows, QR codes & analytics", href: "/docs/flows-qr-analytics" },
      { title: "Embedded Signup", href: "/docs/embedded-signup" },
    ],
  },
  {
    group: "Webhooks",
    items: [{ title: "Receiving events", href: "/docs/webhooks" }],
  },
  {
    group: "Reference",
    items: [
      { title: "Types", href: "/docs/types" },
      { title: "Examples", href: "/docs/examples" },
    ],
  },
] as const;
