import { PageHeader, Callout } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Installation — wapi-cloud docs" };

export default function InstallationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Getting started"
        title="Installation"
        description="wapi-cloud is published on npm and works with any Node.js 18+ project, TypeScript or JavaScript, ESM or CJS."
      />

      <h2>Requirements</h2>
      <ul>
        <li>Node.js 18 or later</li>
        <li>
          A Meta developer app with the WhatsApp product added, plus a
          verified WhatsApp Business Account (WABA)
        </li>
        <li>
          A permanent or system-user access token — see{" "}
          <a
            href="https://developers.facebook.com/documentation/business-messaging/whatsapp/overview"
            target="_blank"
            rel="noreferrer"
          >
            the Graph API docs
          </a>{" "}
          for generating one
        </li>
      </ul>

      <h2>Install the package</h2>
      <CodeBlock lang="bash" code={`npm install wapi-cloud`} />
      <p>Or with your package manager of choice:</p>
      <CodeBlock
        lang="bash"
        code={`yarn add wapi-cloud
pnpm add wapi-cloud
bun add wapi-cloud`}
      />

      <h2>Import it</h2>
      <p>
        wapi-cloud ships as both ESM and CJS builds with bundled type
        declarations, so both import styles work out of the box.
      </p>
      <CodeBlock
        filename="ESM / TypeScript"
        lang="ts"
        code={`import { Whatsapp } from "wapi-cloud";`}
      />
      <CodeBlock
        filename="CommonJS"
        lang="js"
        code={`const { Whatsapp } = require("wapi-cloud");`}
      />

      <Callout>
        No build step is required to use wapi-cloud in a TypeScript project
        — types are resolved automatically from the package&apos;s{" "}
        <code>.d.ts</code> files.
      </Callout>

      <h2>Environment variables</h2>
      <p>
        wapi-cloud doesn&apos;t read environment variables for you — pass
        credentials explicitly to the constructor. A typical{" "}
        <code>.env</code> looks like this:
      </p>
      <CodeBlock
        filename=".env"
        lang="bash"
        code={`WA_TOKEN=EAAG...
WA_PHONE_ID=123456789012345
WA_WABA_ID=987654321098765
WA_APP_SECRET=your_meta_app_secret
WA_APP_ID=your_meta_app_id
WA_BUSINESS_ID=your_meta_business_manager_id
WA_VERIFY_TOKEN=a_string_you_choose`}
      />

      <p>
        Continue to <a href="/docs/quick-start">Quick start</a> to wire
        these into a working client.
      </p>
    </>
  );
}
