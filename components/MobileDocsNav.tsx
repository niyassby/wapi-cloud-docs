"use client";

import { X } from "lucide-react";
import { DocsSidebarContent } from "./DocsSidebar";

export function MobileDocsNav({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  return (
    <div className="md:hidden">

      {/* {open && ( */}
        {/* <div className={`fixed inset-0 z-[600] `}> */}
          <div
            className={`absolute z-[200] inset-0 bg-ink-950/80 backdrop-blur-sm transition-all duration-300 ${open ? "opacity-100 visible": "invisible opacity-0"}`}
            onClick={() => setOpen(false)}
          />
          <div className={`absolute z-[200] ${open ? "left-0": "-left-full"} transition-all duration-300 top-0 h-full w-[82%] max-w-xs border-r border-ink-800 bg-ink-950 p-5 shadow-2xl`}>
            <button
              onClick={() => setOpen(false)}
              className="mb-4 flex items-center gap-2 rounded-md border border-ink-700 px-3 py-1.5 font-mono text-xs text-paper-200"
            >
              <X className="h-3.5 w-3.5" /> close
            </button>
            <div className="overflow-y-auto h-full">

            <DocsSidebarContent onNavigate={() => setOpen(false)} />
            </div>
          </div>
        {/* </div> */}
      {/* )} */}
    </div>
  );
}
