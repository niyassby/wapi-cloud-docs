import { PageHeader, ParamTable, Callout } from "@/components/DocBits";
import { CodeBlock } from "@/components/CodeBlock";

export const metadata = { title: "Auto-pagination — wapi-cloud docs" };

export default function PaginationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Core concepts"
        title="Auto-pagination"
        description="Every list endpoint in the Meta Graph API is cursor-paginated. wapi-cloud simplifies pagination with structured PageInfo and effortless for-await async iterators."
      />

      <h2>The list() method</h2>
      <p>
        Calling <code>list()</code> on any module fetches a single page of items and normalizes Graph API&apos;s pagination object into a clean <code>PaginatedResult&lt;T&gt;</code>:
      </p>

      <CodeBlock
        filename="pagination.ts"
        lang="ts"
        code={`const { data, error } = await whatsapp.templates.list({
  limit: 25,
  after: "cursor_string_here",
});

if (data) {
  console.log("Current page items:", data.items);
  console.log("Next cursor:", data.pageInfo.nextCursor);
  console.log("Has more pages?", data.pageInfo.hasNext);
}`}
      />

      <h2>PaginatedResult shape</h2>
      <CodeBlock
        lang="ts"
        code={`interface PaginatedResult<T> {
  items: T[];
  pageInfo: PageInfo;
}

interface PageInfo {
  nextCursor?: string;
  previousCursor?: string;
  hasNext: boolean;
}`}
      />

      <h2>The listAll() async iterator</h2>
      <p>
        Modules that support full listing (such as <code>whatsapp.templates.listAll()</code>) expose an async generator that automatically fetches subsequent pages lazily as you iterate:
      </p>

      <CodeBlock
        filename="list-all.ts"
        lang="ts"
        code={`// Iterates over ALL templates across all pages seamlessly
for await (const template of whatsapp.templates.listAll()) {
  console.log(template.id, template.name, template.status);
}`}
      />

      <p>
        Because the iterator is lazy, breaking out of the loop immediately halts further network requests:
      </p>
      <CodeBlock
        lang="ts"
        code={`for await (const template of whatsapp.templates.listAll()) {
  if (template.name === "welcome_discount" && template.status === "APPROVED") {
    console.log("Found template ID:", template.id);
    break; // No further pages are fetched from Meta
  }
}`}
      />

      <h2>Collecting all items into an array</h2>
      <p>
        To gather all items across all pages into memory:
      </p>
      <CodeBlock
        lang="ts"
        code={`const allTemplates = [];
for await (const item of whatsapp.templates.listAll()) {
  allTemplates.push(item);
}
console.log("Total templates loaded:", allTemplates.length);`}
      />

      <Callout>
        If an unexpected error occurs during a <code>listAll()</code> iteration, the generator cleanly terminates iteration. For critical pipelines that require inspecting mid-pagination errors, use <code>{"list({ after })"}</code> with manual cursor walking.
      </Callout>
    </>
  );
}
