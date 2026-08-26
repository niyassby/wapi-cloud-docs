import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "fs";
import { join, relative as _relative, dirname, sep } from "path";

const ROOT = process.cwd();
// const ROOT = path.resolve(import.meta.dirname, "..");
const DOCS_DIR = join(ROOT, "app", "docs");
const OUTPUT_DIR = join(ROOT, "public");
const OUTPUT_FILE = join(OUTPUT_DIR, "search-index.json");

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });

  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (
      entry.isFile() &&
      entry.name === "page.tsx"
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

function decodeEntities(value) {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function cleanText(value) {
  return decodeEntities(
    value
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/\/\/.*$/gm, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function extractAttribute(source, component, attribute) {
  const regex = new RegExp(
    `<${component}[\\s\\S]*?\\b${attribute}=["'\`]([^"'\`]+)["'\`]`,
    "m"
  );

  const match = source.match(regex);

  return match ? cleanText(match[1]) : "";
}

function extractPageTitle(source, filePath) {
  const pageHeaderTitle = extractAttribute(
    source,
    "PageHeader",
    "title"
  );

  if (pageHeaderTitle) {
    return pageHeaderTitle;
  }

  const metadataTitle = source.match(
    /export\s+const\s+metadata\s*=\s*\{[\s\S]*?title:\s*["'`]([^"'`]+)["'`]/
  );

  if (metadataTitle) {
    return cleanText(metadataTitle[1]);
  }

  const h1 = source.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);

  if (h1) {
    return cleanText(
      h1[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/\{[^}]+\}/g, " ")
    );
  }

  const relative = _relative(DOCS_DIR, filePath);
  const folder = dirname(relative);

  if (!folder || folder === ".") {
    return "Documentation";
  }

  return folder
    .split(sep)
    .filter(Boolean)
    .pop()
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function extractHeadings(source) {
  const headings = [];

  const regex = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/g;

  let match;

  while ((match = regex.exec(source)) !== null) {
    const text = cleanText(
      match[2]
        .replace(/<[^>]+>/g, " ")
        .replace(/\{[^}]+\}/g, " ")
    );

    if (text) {
      headings.push(text);
    }
  }

  return headings;
}

function extractCode(source) {
  const codeBlocks = [];

  const regex =
    /\bcode=\{`([\s\S]*?)`\}/g;

  let match;

  while ((match = regex.exec(source)) !== null) {
    codeBlocks.push(match[1]);
  }

  return codeBlocks;
}

function extractStrings(source) {
  const strings = [];

  const regex =
    /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;

  let match;

  while ((match = regex.exec(source)) !== null) {
    const value = match[2];

    if (
      value.length >= 3 &&
      !value.includes("className") &&
      !value.includes("font-") &&
      !value.includes("text-") &&
      !value.includes("border-") &&
      !value.includes("bg-")
    ) {
      strings.push(value);
    }
  }

  return strings;
}

function extractVisibleText(source) {
  let text = source;

  // Remove imports.
  text = text.replace(
    /import[\s\S]*?from\s+["'][^"']+["'];?/g,
    " "
  );

  // Remove exports and TypeScript declarations.
  text = text.replace(
    /export\s+(const|type|interface|function)[\s\S]*?;/g,
    " "
  );

  // Keep code strings separately, then remove JSX/TS syntax.
  const code = extractCode(source);

  text = text
    .replace(/<[^>]+>/g, " ")
    .replace(/\{[\s\S]*?\}/g, " ")
    .replace(/["'`]/g, " ");

  const strings = extractStrings(source);

  return cleanText(
    [
      text,
      strings.join(" "),
      code.join(" "),
    ].join(" ")
  );
}

function makeHref(filePath) {
  const relative = _relative(DOCS_DIR, filePath);
  const folder = dirname(relative);

  if (!folder || folder === ".") {
    return "/docs";
  }

  return `/docs/${folder
    .split(sep)
    .map(encodeURIComponent)
    .join("/")}`;
}

function createIndex() {
  const files = walk(DOCS_DIR);

  const documents = files.map((filePath) => {
    const source = readFileSync(filePath, "utf8");

    const title = extractPageTitle(source, filePath);
    const headings = extractHeadings(source);
    const code = extractCode(source);
    const content = extractVisibleText(source);

    return {
      id: makeHref(filePath),
      title,
      href: makeHref(filePath),
      headings,
      content,
      code: code.join("\n"),
    };
  });

  documents.sort((a, b) =>
    a.href.localeCompare(b.href)
  );

  mkdirSync(OUTPUT_DIR, { recursive: true });

  writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(documents, null, 2),
    "utf8"
  );

  console.log(
    `Generated search index with ${documents.length} documents.`
  );

  console.log(`Output: ${OUTPUT_FILE}`);
}

createIndex();