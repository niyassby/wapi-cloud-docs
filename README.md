# wapi-cloud docs website

A Next.js 14 (App Router) documentation site for [wapi-cloud](https://github.com/niyassby/wapi-cloud) — a promise-based, fully-typed Node.js wrapper for the WhatsApp Cloud API.

- `/` — design-focused marketing landing page
- `/docs` — full documentation (installation, quick start, configuration, error handling, pagination, every API module, webhooks, types reference, examples)

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom theme — see `tailwind.config.ts`)
- lucide-react icons
- No MDX / CMS — content lives directly in typed React components under `app/docs/**/page.tsx`, so it's easy to edit without learning a new authoring format.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project structure

```
app/
  page.tsx              landing page
  layout.tsx            root layout (fonts, metadata)
  globals.css           theme tokens, prose styles
  docs/
    layout.tsx           sidebar + docs shell
    page.tsx              /docs (introduction)
    installation/
    quick-start/
    configuration/
    error-handling/
    pagination/
    messages/
    templates/
    media/
    contacts/
    account-management/
    flows-qr-analytics/
    webhooks/
    types/
    examples/
components/
  CodeBlock.tsx          syntax-highlighted code block w/ copy button
  CodeShowcase.tsx        tabbed code snippets (landing page)
  DeliveryMock.tsx         animated hero chat mockup
  DocBits.tsx              PageHeader / Callout / ParamTable / MethodSignature
  DocsSidebar.tsx / MobileDocsNav.tsx
  SiteNav.tsx / SiteFooter.tsx / Logo.tsx
lib/
  modules.ts              shared module + sidebar nav metadata
```

## Editing content

Every docs page is a plain `.tsx` file — edit the JSX directly, no build tooling required beyond what Next.js already gives you. Reusable pieces:

- `<CodeBlock lang="ts" filename="..." code={\`...\`} />` — syntax-highlighted snippet with copy button
- `<Callout>` / `<Callout type="warning">` — inline note or warning box
- `<ParamTable rows={[...]} />` — parameter reference table
- `<MethodSignature>` — inline method signature strip

To add a new docs page, create `app/docs/<slug>/page.tsx` and add an entry to `docsNav` in `lib/modules.ts`.

## Notes

- Content (install steps, module names, code examples) is sourced from the [wapi-cloud README](https://github.com/niyassby/wapi-cloud) and general WhatsApp Cloud API (Meta Graph API) conventions. Verify exact method signatures against the shipped `.d.ts` files in `node_modules/wapi-cloud/dist` before publishing, since the package may evolve.
- Fonts (Space Grotesk / Inter / JetBrains Mono) are loaded via a Google Fonts `@import` in `globals.css` — swap for `next/font/google` if you'd prefer self-hosted fonts.
