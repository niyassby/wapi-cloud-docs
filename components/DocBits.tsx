import { Info, AlertTriangle } from "lucide-react";
import clsx from "clsx";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 border-b border-ink-800 pb-8">
      <p className="font-mono text-xs uppercase tracking-wider text-signal">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-paper-50 sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-paper-300">
          {description}
        </p>
      )}
    </div>
  );
}

export function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning";
  children: React.ReactNode;
}) {
  const Icon = type === "warning" ? AlertTriangle : Info;
  return (
    <div
      className={clsx(
        "my-6 flex gap-3 rounded-xl border px-4 py-3.5 text-[13.5px] leading-relaxed",
        type === "warning"
          ? "border-amber-signal/30 bg-amber-signal/[0.06] text-paper-100"
          : "border-signal/25 bg-signal-deep/20 text-paper-100"
      )}
    >
      <Icon
        className={clsx(
          "mt-0.5 h-4 w-4 shrink-0",
          type === "warning" ? "text-amber-signal" : "text-signal"
        )}
      />
      <div>{children}</div>
    </div>
  );
}

export function ParamTable({
  rows,
}: {
  rows: { name: string; type: string; required?: boolean; description: string }[];
}) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-ink-800">
      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-ink-800 bg-ink-900/60">
            <th className="px-4 py-2.5 font-mono font-medium text-paper-300">
              Parameter
            </th>
            <th className="px-4 py-2.5 font-mono font-medium text-paper-300">
              Type
            </th>
            <th className="px-4 py-2.5 font-medium text-paper-300">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b border-ink-800/70 last:border-0">
              <td className="px-4 py-2.5 align-top font-mono text-signal-soft">
                {r.name}
                {r.required && (
                  <span className="ml-1 text-amber-signal">*</span>
                )}
              </td>
              <td className="px-4 py-2.5 align-top font-mono text-paper-300">
                {r.type}
              </td>
              <td className="px-4 py-2.5 align-top text-paper-200">
                {r.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MethodSignature({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-ink-800 bg-ink-900/60 px-4 py-3 font-mono text-[13px] text-paper-100">
      {children}
    </div>
  );
}
