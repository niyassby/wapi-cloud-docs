"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import clsx from "clsx";

type Lang = "ts" | "js" | "bash" | "json";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const KEYWORDS =
  /^(import|from|export|const|let|var|function|async|await|return|new|if|else|for|of|in|try|catch|throw|type|interface|extends|implements|class|default|as|typeof|instanceof|null|undefined|true|false|this|void)$/;

const SDK_IDENTIFIERS =
  /^(Whatsapp|whatsapp|messages|templates|media|contacts|phoneNumbers|businessProfile|flows|qrCodes|analytics|twoStepVerification|webhooks)$/;

// Single combined pattern so every token is matched exactly once, in one
// left-to-right pass. Only text between matches (and inside matched groups)
// is ever escaped/wrapped — nothing already-emitted is re-scanned.
const TOKEN_PATTERN =
  /(\/\/.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b([a-zA-Z_$][a-zA-Z0-9_$]*)\b|\b(\d+(?:\.\d+)?)\b/gm;

function highlightTs(code: string): string {
  let out = "";
  let last = 0;
  let match: RegExpExecArray | null;

  TOKEN_PATTERN.lastIndex = 0;
  while ((match = TOKEN_PATTERN.exec(code))) {
    const [full, comment, str, word, num] = match;

    // plain text between the previous token and this one
    out += esc(code.slice(last, match.index));
    last = match.index + full.length;

    if (comment !== undefined) {
      out += `<span class="text-paper-300/45 italic">${esc(comment)}</span>`;
    } else if (str !== undefined) {
      out += `<span class="text-signal-soft">${esc(str)}</span>`;
    } else if (word !== undefined) {
      // does this identifier get called, e.g. `sendText(` ?
      const isCallee = /^\s*\(/.test(code.slice(last));
      if (KEYWORDS.test(word)) {
        out += `<span class="text-signal">${esc(word)}</span>`;
      } else if (SDK_IDENTIFIERS.test(word)) {
        out += `<span class="text-amber-signal">${esc(word)}</span>`;
      } else if (isCallee) {
        out += `<span class="text-paper-50">${esc(word)}</span>`;
      } else {
        out += esc(word);
      }
    } else if (num !== undefined) {
      out += `<span class="text-signal-soft">${esc(num)}</span>`;
    }
  }

  out += esc(code.slice(last));
  return out;
}

function highlightBash(code: string): string {
  return code
    .split("\n")
    .map((line) => {
      if (line.trim().startsWith("#")) {
        return `<span class="text-paper-300/50">${esc(line)}</span>`;
      }
      const m = line.match(/^(\s*)(npm|yarn|pnpm|bun|npx|node|export|curl)(\s.*)?$/);
      if (!m) return esc(line);
      return `${m[1]}<span class="text-signal">${m[2]}</span>${esc(
        m[3] ?? ""
      )}`;
    })
    .join("\n");
}

function highlight(code: string, lang: Lang): string {
  return lang === "bash" ? highlightBash(code) : highlightTs(code);
}

export function CodeBlock({
  code,
  lang = "ts",
  filename,
  className,
}: {
  code: string;
  lang?: Lang;
  filename?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  };

  return (
    <div
      className={clsx(
        "group relative overflow-hidden rounded-xl border border-ink-700 bg-ink-900/80 mb-2",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-850 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          {filename && (
            <span className="ml-3 font-mono text-xs text-paper-300">
              {filename}
            </span>
          )}
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-paper-300 transition hover:bg-ink-700 hover:text-paper-50"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-signal" /> copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-6">
        <code
          className="font-mono text-paper-200"
          dangerouslySetInnerHTML={{ __html: highlight(code.trim(), lang) }}
        />
      </pre>
    </div>
  );
}