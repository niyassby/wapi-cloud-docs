"use client";

import {
  Command,
  FileText,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Fuse, { FuseResultMatch } from "fuse.js";

type SearchDocument = {
  id: string;
  title: string;
  href: string;
  headings: string[];
  content: string;
  code: string;
};

type SearchResult = SearchDocument & {
  matches?: readonly FuseResultMatch[];
};

function highlight(
  text: string,
  query: string
) {
  if (!query.trim()) {
    return text;
  }

  const escaped = query.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const parts = text.split(
    new RegExp(`(${escaped})`, "gi")
  );

  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={index}
        className="rounded bg-signal/20 px-0.5 text-signal"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function getSnippet(
  document: SearchDocument,
  query: string
) {
  const text =
    `${document.title} ${document.content} ${document.code}`;

  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  const index = normalizedText.indexOf(
    normalizedQuery
  );

  if (index === -1) {
    return document.content.slice(0, 150);
  }

  const start = Math.max(0, index - 70);
  const end = Math.min(
    text.length,
    index + query.length + 120
  );

  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";

  return (
    prefix +
    text.slice(start, end) +
    suffix
  );
}

export function DocsSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState<
    SearchDocument[]
  >([]);
  const [activeIndex, setActiveIndex] =
    useState(0);

  const inputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/search-index.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Unable to load search index"
          );
        }

        return response.json();
      })
      .then(setDocuments)
      .catch((error) => {
        console.error(
          "Search index error:",
          error
        );
      });
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isShortcut =
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k";

      if (isShortcut) {
        event.preventDefault();
        setOpen(true);
      }

      if (
        event.key === "Escape" &&
        open
      ) {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 20);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const fuse = useMemo(() => {
    return new Fuse(documents, {
      includeMatches: true,
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2,

      keys: [
        {
          name: "title",
          weight: 0.4,
        },
        {
          name: "headings",
          weight: 0.25,
        },
        {
          name: "content",
          weight: 0.2,
        },
        {
          name: "code",
          weight: 0.15,
        },
      ],
    });
  }, [documents]);

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) {
      return documents.slice(0, 8);
    }

    return fuse
      .search(query)
      .slice(0, 12)
      .map((result) => ({
        ...result.item,
        matches: result.matches,
      }));
  }, [documents, fuse, query]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function handleInputKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((current) =>
        Math.min(
          current + 1,
          results.length - 1
        )
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((current) =>
        Math.max(current - 1, 0)
      );
    }

    if (
      event.key === "Enter" &&
      results[activeIndex]
    ) {
      window.location.href =
        results[activeIndex].href;

      close();
    }
  }

  return (
    <>
      {/* Desktop / tablet search button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden w-64 items-center justify-between rounded-md border border-ink-700 bg-ink-900/70 px-3 py-1 text-left transition hover:border-ink-600 sm:flex"
        aria-label="Search documentation"
      >
        <span className="flex items-center gap-2 text-xs text-paper-400">
          <Search className="h-3.5 w-3.5" />
          Search docs...
        </span>

        <span className="flex items-center gap-1 rounded border border-ink-700 px-1.5 py-0.5 font-mono text-[10px] text-paper-500">
          <Command className="h-2.5 w-2.5" />
          K
        </span>
      </button>

      {/* Mobile search button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex py-1.5 w-9 items-center justify-center rounded-lg border border-ink-700 text-paper-300 sm:hidden"
        aria-label="Search documentation"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Search modal */}
      {open && (
        <div
          className="fixed w-full h-screen inset-0 z-[100] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              close();
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-ink-700 bg-ink-950 shadow-2xl">
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-ink-800 px-4">
              <Search className="h-5 w-5 shrink-0 text-paper-500" />

              <input
                ref={inputRef}
                value={query}
                onChange={(event) =>
                  setQuery(event.target.value)
                }
                onKeyDown={
                  handleInputKeyDown
                }
                placeholder="Search documentation..."
                className="h-14 flex-1 bg-transparent font-mono text-sm text-paper-50 outline-none placeholder:text-paper-500"
              />

              <button
                type="button"
                onClick={close}
                className="rounded-md p-1.5 text-paper-500 transition hover:bg-ink-800 hover:text-paper-200"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <div className="px-5 py-12 text-center">
                  <Search className="mx-auto mb-3 h-8 w-8 text-paper-600" />

                  <p className="font-display text-sm text-paper-200">
                    No results found
                  </p>

                  <p className="mt-1 text-xs text-paper-500">
                    Try a different search term.
                  </p>
                </div>
              ) : (
                <>
                  {results.map(
                    (result, index) => {
                      const snippet =
                        getSnippet(
                          result,
                          query
                        );

                      return (
                        <Link
                          key={result.id}
                          href={result.href}
                          onClick={close}
                          onMouseEnter={() =>
                            setActiveIndex(
                              index
                            )
                          }
                          className={`block rounded-xl px-4 py-3 transition ${
                            index ===
                            activeIndex
                              ? "bg-ink-800"
                              : "hover:bg-ink-900"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-signal" />

                            <div className="min-w-0 flex-1">
                              <div className="font-display text-sm font-medium text-paper-50">
                                {highlight(
                                  result.title,
                                  query
                                )}
                              </div>

                              <div className="mt-1 line-clamp-2 text-xs font-normal leading-relaxed text-paper-300">
                                {highlight(
                                  snippet,
                                  query
                                )}
                              </div>

                              <div className="mt-2 font-mono text-[10px] text-paper-600">
                                {result.href}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    }
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 border-t border-ink-800 bg-ink-900/50 px-4 py-2.5">
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-paper-500">
                <ArrowUp className="h-3 w-3" />
                <ArrowDown className="h-3 w-3" />
                Navigate
              </span>

              <span className="flex items-center gap-1.5 font-mono text-[10px] text-paper-500">
                <CornerDownLeft className="h-3 w-3" />
                Open
              </span>

              <span className="ml-auto font-mono text-[10px] text-paper-600">
                ESC to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}