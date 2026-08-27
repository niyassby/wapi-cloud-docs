"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import React from "react";

function CopyButton() {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  const onCopy = async (code: string) => {
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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 px-4 py-3 font-mono text-sm text-paper-200"
    >
      <button onClick={() => onCopy("npm install wapi-cloud")}>
        {copied ? (
          <Check className="h-4 w-4 text-signal" />
        ) : hover ? (
          <Copy className="h-4 w-4 text-signal" />
        ) : (
          <Terminal className="h-4 w-4 text-signal" />
        )}
      </button>
      npm install wapi-cloud
    </div>
  );
}

export default CopyButton;
