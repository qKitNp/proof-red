import { useState } from "react";
import { motion } from "motion/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { setLicenseKey, validateLicenseKey } from "../../lib/license";

export function StepLicenseKey({ onNext }: { onNext: () => void }) {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    const trimmed = key.trim();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      await validateLicenseKey(trimmed);
      setLicenseKey(trimmed);
      onNext();
    } catch {
      setError("That key didn't work — check it or get one at grammar.lol");
      setLoading(false);
    }
  }

  async function openGrammarLol() {
    try {
      await openUrl("https://grammar.lol");
    } catch {
      window.open("https://grammar.lol", "_blank");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center gap-8"
    >
      <div>
        <h1 className="text-[26px] font-medium tracking-tight leading-tight">
          Enter your license key
        </h1>
        <p className="mt-3 text-[13.5px] text-[var(--text-soft)] leading-relaxed max-w-[420px] mx-auto">
          Paste your license key to unlock proofreading on this device.
        </p>
      </div>

      <input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleContinue();
        }}
        placeholder="grm_••••••••••••••••"
        autoFocus
        spellCheck={false}
        className="w-full max-w-[360px] px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[13.5px] font-mono text-[var(--text)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors"
      />

      <button
        onClick={handleContinue}
        disabled={loading || !key.trim()}
        className="px-6 py-2.5 rounded-lg bg-[var(--accent)] text-white text-[13.5px] font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Checking…" : "Continue"}
      </button>

      <button
        onClick={openGrammarLol}
        className="px-6 py-2.5 rounded-lg text-[13.5px] font-medium text-[var(--text-soft)] hover:text-[var(--text)] transition-colors cursor-pointer"
      >
        Get Your License Key
      </button>

      {error && <p className="text-[12px] text-red-500 max-w-[360px]">{error}</p>}
    </motion.div>
  );
}
