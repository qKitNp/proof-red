import { useState } from "react";
import type { Proof } from "../lib/seed";
import { DiffRenderer } from "./DiffRenderer";

const fmtTime = (d: Date) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

export function ProofEntry({ proof }: { proof: Proof }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="w-full text-left rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-4 transition-colors hover:border-[var(--text-faint)]/40 cursor-pointer"
    >
      <div className="grid grid-cols-[90px_1fr_auto] items-start gap-5">
        <div className="font-mono text-[12px] text-[var(--text-faint)] pt-[1px]">
          {fmtTime(proof.ts)}
        </div>
        <div>
          <DiffRenderer before={proof.before} after={proof.after} />
          {open && (
            <div className="mt-3 grid grid-cols-[64px_1fr] gap-x-4 gap-y-1.5 text-[12.5px] pt-3 border-t border-[var(--border)]">
              <span className="text-[var(--text-faint)] uppercase tracking-wider text-[10.5px] pt-[3px]">
                before
              </span>
              <span className="text-[var(--text-soft)]">{proof.before}</span>
              <span className="text-[var(--text-faint)] uppercase tracking-wider text-[10.5px] pt-[3px]">
                after
              </span>
              <span className="text-[var(--text)]">{proof.after}</span>
            </div>
          )}
        </div>
        <span className="text-[11px] text-[var(--text-faint)] pt-[2px]">{proof.sourceApp}</span>
      </div>
    </button>
  );
}
