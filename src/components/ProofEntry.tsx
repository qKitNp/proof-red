import { useState } from "react";
import { motion } from "motion/react";
import type { Proof } from "../lib/seed";
import { DiffRenderer } from "./DiffRenderer";

const fmtTime = (d: Date) =>
  d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

type Props = { proof: Proof; index: number };

export function ProofEntry({ proof, index }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      className="group grid grid-cols-[84px_1fr] gap-x-6 py-5 border-b border-[var(--edge)] last:border-b-0"
    >
      <div className="pt-[2px] select-none">
        <div className="font-mono text-[11px] tracking-wider text-[var(--ink-soft)]">
          {fmtTime(proof.ts)}
        </div>
        <div className="mt-1 small-caps text-[10.5px] text-[var(--ink-faint)]">
          {proof.sourceApp}
        </div>
      </div>

      <div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="block w-full text-left cursor-pointer"
        >
          <DiffRenderer before={proof.before} after={proof.after} />
        </button>

        {open && (
          <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-l border-[var(--red)]/40 pl-4 text-[0.92rem]">
            <span className="small-caps text-[10px] pt-[3px] text-[var(--ink-faint)]">
              before
            </span>
            <span className="italic text-[var(--ink-soft)]">{proof.before}</span>
            <span className="small-caps text-[10px] pt-[3px] text-[var(--ink-faint)]">
              after
            </span>
            <span className="text-[var(--ink)]">{proof.after}</span>
            <span className="small-caps text-[10px] pt-[3px] text-[var(--ink-faint)]">
              tone
            </span>
            <span className="font-mono text-[11px] text-[var(--ink-soft)]">
              {proof.tone}
            </span>
          </div>
        )}

        <div className="mt-2 flex gap-4 text-[11px] text-[var(--ink-faint)] opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="hover:text-[var(--red)]">copy original</button>
          <button className="hover:text-[var(--red)]">copy corrected</button>
          <button className="hover:text-[var(--red)]">re-proof</button>
          <button className="ml-auto hover:text-[var(--red)]">delete</button>
        </div>
      </div>
    </motion.article>
  );
}
