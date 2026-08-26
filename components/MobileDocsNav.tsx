"use client";

import { X } from "lucide-react";
import { DocsSidebarContent } from "./DocsSidebar";

export function MobileDocsNav({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <div className="lg:hidden">

      {open && (
        <div className="fixed inset-0 z-[600]">
          <div
            className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-xs overflow-y-auto border-r border-ink-800 bg-ink-950 p-5 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="mb-4 flex items-center gap-2 rounded-md border border-ink-700 px-3 py-1.5 font-mono text-xs text-paper-200"
            >
              <X className="h-3.5 w-3.5" /> close
            </button>
            <DocsSidebarContent onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
