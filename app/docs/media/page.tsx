import { PageHeader, ParamTable, Callout, MethodSignature } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Media — wapi-cloud docs" };

export default function MediaPage() {
  return (
    <>
      <PageHeader
        eyebrow="API reference"
        title="whatsapp.media"
        description="Upload media assets to Meta, fetch media metadata with temporary CDN URLs, download raw binary data, and delete media files."
      />

      <h2>upload</h2>
      <MethodSignature>{"whatsapp.media.upload(file: Blob | Buffer, options: { type: string; filename?: string }, opts?: { phoneNumberId?: string }): Promise<WhatsappResponse<{ id: string }>>"}</MethodSignature>
      <p>
        Uploads a binary file or Node.js buffer to Meta&apos;s media store and returns a <code>mediaId</code> ready for sending in messages:
      </p>
      <CodeBlock
        filename="upload-media.ts"
        lang="ts"
        code={`import { readFile } from "node:fs/promises";

// Read local file into a Buffer
const imageBuffer = await readFile("./receipt.png");

const { data: media, error } = await whatsapp.media.upload(imageBuffer, {
  type: "image/png",
  filename: "receipt.png",
});

if (error) {
  console.error("Upload failed:", error.message);
} else {
  console.log("Uploaded Media ID:", media.id);

  // Send the uploaded media in a message
  await whatsapp.messages.sendImage("15551234567", {
    mediaId: media.id,
    caption: "Here is your receipt",
  });
}`}
      />

      <Callout>
        Media IDs uploaded via the API are valid for 30 days and are scoped to the sender Phone Number ID.
      </Callout>

      <h2>get (Inspect Metadata)</h2>
      <MethodSignature>{"whatsapp.media.get(mediaId: string): Promise<WhatsappResponse<MediaMetadata>>"}</MethodSignature>
      <p>
        Retrieves metadata and a short-lived temporary download URL for any media ID (including inbound media sent by customers):
      </p>
      <CodeBlock
        lang="ts"
        code={`const { data: meta, error } = await whatsapp.media.get("media_id_12345");

if (meta) {
  console.log("Download URL:", meta.url);
  console.log("MIME Type:", meta.mime_type);
  console.log("File Size (bytes):", meta.file_size);
  console.log("SHA256 Hash:", meta.sha256);
}`}
      />

      <h2>download (Fetch Raw Binary)</h2>
      <MethodSignature>{"whatsapp.media.download(mediaId: string): Promise<WhatsappResponse<ArrayBuffer>>"}</MethodSignature>
      <p>
        Automatically resolves the temporary download URL and downloads the binary payload using the client&apos;s authentication headers:
      </p>
      <CodeBlock
        filename="download-inbound.ts"
        lang="ts"
        code={`import { writeFile } from "node:fs/promises";

// Download inbound photo from customer
const { data: arrayBuffer, error } = await whatsapp.media.download("media_id_12345");

if (error) {
  console.error("Download failed:", error.message);
} else {
  // Convert ArrayBuffer to Buffer and save to disk
  await writeFile("./customer-upload.jpg", Buffer.from(arrayBuffer));
  console.log("File saved successfully!");
}`}
      />

      <h2>delete</h2>
      <MethodSignature>{"whatsapp.media.delete(mediaId: string): Promise<WhatsappResponse<{ success: boolean }>>"}</MethodSignature>
      <CodeBlock
        lang="ts"
        code={`const { data, error } = await whatsapp.media.delete("media_id_12345");
console.log("Deleted:", data?.success);`}
      />

      <h2>Supported Media Formats & Limits</h2>
      <ParamTable
        rows={[
          {
            name: "Images",
            type: "image/jpeg, image/png",
            description: "Up to 5 MB. Formats: .jpg, .jpeg, .png",
          },
          {
            name: "Documents",
            type: "application/pdf, application/msword, text/plain, etc.",
            description: "Up to 100 MB. Any valid document MIME type.",
          },
          {
            name: "Audio",
            type: "audio/aac, audio/mp4, audio/mpeg, audio/amr, audio/ogg",
            description: "Up to 16 MB. Voice notes use audio/ogg with opus codec.",
          },
          {
            name: "Video",
            type: "video/mp4, video/3gpp",
            description: "Up to 16 MB. H.264 video codec and AAC audio codec recommended.",
          },
          {
            name: "Stickers",
            type: "image/webp",
            description: "Up to 100 KB (static) or 500 KB (animated). Dimensions: exactly 512x512 pixels.",
          },
        ]}
      />
    </>
  );
}
