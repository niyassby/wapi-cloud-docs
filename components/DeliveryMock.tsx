"use client";

import { useEffect, useState } from "react";

const STAGES = ["queued", "sent", "delivered", "read"] as const;

export function DeliveryMock() {
  const [stage, setStage] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (stage >= STAGES.length - 1) {
      const t = setTimeout(() => {
        setStage(0);
        setCycle((c) => c + 1);
      }, 3500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage((s) => s + 1), 1200);
    return () => clearTimeout(t);
  }, [stage]);

  const tickColor =
    stage >= 2 ? "text-signal" : stage >= 1 ? "text-paper-200" : "text-paper-300/30";

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute -inset-6 rounded-[2rem] bg-signal/10 blur-3xl" />
      <div className="relative rounded-2xl border border-ink-700 bg-ink-900/90 shadow-glow backdrop-blur overflow-hidden">
        {/* header */}
        <div className="flex items-center gap-3 border-b border-ink-700 px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-signal-deep text-xs font-semibold text-signal">
            JS
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-paper-50">
              Jordan Silva
            </p>
            <p className="font-mono text-[11px] text-paper-300">
              +1 555 123 4567
            </p>
          </div>
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] text-signal">
            <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-signal" />
            live
          </span>
        </div>

        {/* chat body */}
        <div className="space-y-3 px-4 py-5 my-5">
          <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-signal-deep/60 px-3.5 py-2.5">
            <p className="text-[13px] text-paper-50">
              Hi Jordan — your order is confirmed 🎉
            </p>
            <div className="mt-1.5 flex items-center justify-end gap-1 font-mono text-[10px] text-paper-300">
              <span key={cycle} className="animate-rise">
                {STAGES[stage]}
              </span>
              <svg
                viewBox="0 0 16 10"
                className={`h-2.5 w-4 transition-colors duration-300 ${tickColor}`}
                fill="none"
              >
                <path
                  d="M1 5.5L4.2 8.5L9.5 1.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.2 5.5L9.4 8.5L14.7 1.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={stage >= 1 ? 1 : 0}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* result panel */}
        <div className="border-t border-ink-700 bg-ink-850/60 px-4 py-3.5 font-mono text-[11px]">
          <p className="text-paper-300/60">// resolved, never thrown</p>
          <p>
            <span className="text-signal">const</span>{" "}
            <span className="text-paper-50">{"{ data, error }"}</span>{" "}
            <span className="text-signal">=</span>{" "}
            <span className="text-paper-300">await</span>{" "}
            <span className="text-amber-signal">whatsapp</span>
            <span className="text-paper-50">.send(...)</span>
          </p>
          <p className="mt-1 text-signal-soft">
            {stage >= 2 ? "✓ status: " + STAGES[stage] : "… awaiting receipt"}
          </p>
        </div>
      </div>
    </div>
  );
}
