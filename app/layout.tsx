import type { Metadata } from "next";
import "./globals.css"; 

export const metadata: Metadata = {
  title: "wapi-cloud — a Node.js SDK for the WhatsApp Cloud API",
  icons: './wapi-cloud-icon.svg',
  description:
    "A promise-based, fully-typed Node.js wrapper for the WhatsApp Cloud API (Meta Graph API). Never throws, always resolves to { data, error }.",
  metadataBase: new URL("https://wapi-cloud.dev"),
  openGraph: {
    title: "wapi-cloud — a Node.js SDK for the WhatsApp Cloud API",
    description:
      "Promise-based, fully-typed, and never throws. Messages, templates, media, flows, QR codes, analytics and webhooks for the WhatsApp Cloud API.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-body antialiased bg-ink-950 text-paper-50">
        {children}
      </body>
    </html>
  );
}
