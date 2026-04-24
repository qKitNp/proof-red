import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, Shield } from "lucide-react";
import {
  checkAccessibility,
  openAccessibilitySettings,
} from "../../lib/permissions";

export function StepAccessibility({ onNext }: { onNext: () => void }) {
  const [granted, setGranted] = useState<boolean | null>(null);
  const [openFailed, setOpenFailed] = useState(false);

  async function handleOpenSettings() {
    setOpenFailed(false);
    const ok = await openAccessibilitySettings();
    if (!ok) setOpenFailed(true);
  }

  useEffect(() => {
    let cancelled = false;
    let advanced = false;
    async function tick() {
      const ok = await checkAccessibility();
      if (cancelled) return;
      setGranted(ok);
      if (ok && !advanced) {
        advanced = true;
        setTimeout(() => {
          if (!cancelled) onNext();
        }, 600);
      }
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [onNext]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center gap-8"
    >
      <div className="h-14 w-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center">
        <Shield size={24} strokeWidth={1.5} className="text-[var(--accent)]" />
      </div>

      <div>
        <h1 className="text-[26px] font-medium tracking-tight leading-tight">
          Enable Accessibility
        </h1>
        <p className="mt-3 text-[13.5px] text-[var(--text-soft)] leading-relaxed max-w-[440px] mx-auto">
          proof·red needs Accessibility access to watch for the Right Shift
          shortcut. It never reads what you type — only the moment you
          double-tap.
        </p>
      </div>

      <div className="flex items-center gap-2 text-[12px]">
        <span
          className={`inline-block h-[8px] w-[8px] rounded-full ${
            granted
              ? "bg-green-500"
              : granted === false
                ? "bg-[var(--text-faint)]"
                : "bg-[var(--border)]"
          }`}
        />
        <span className="text-[var(--text-soft)]">
          {granted === null
            ? "Checking…"
            : granted
              ? "Granted — continuing…"
              : "Not granted yet"}
        </span>
        {granted && (
          <Check size={14} strokeWidth={2} className="text-green-500" />
        )}
      </div>

      <div className="flex flex-col gap-2 w-full max-w-[280px]">
        <button
          type="button"
          onClick={handleOpenSettings}
          disabled={!!granted}
          className="w-full px-4 py-2.5 rounded-lg bg-[var(--accent)] text-white text-[13.5px] font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Open System Settings
        </button>
        {openFailed && (
          <p className="text-[11.5px] text-[var(--text-soft)] leading-snug">
            Could not open System Settings. Open Privacy & Security →
            Accessibility and enable proof·red manually.
          </p>
        )}
        <button
          onClick={onNext}
          className="w-full px-4 py-2 text-[12.5px] text-[var(--text-faint)] hover:text-[var(--text)] transition-colors cursor-pointer"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}
