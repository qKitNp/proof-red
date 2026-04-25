import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { listen } from "@tauri-apps/api/event";
import { Check } from "lucide-react";
import { Keyboard } from "@/components/ui/keyboard";

const SAMPLE = "their going too the stor tommorow to by som bred.";

export function StepShortcutDemo({ onFinish }: { onFinish: () => void }) {
  const [text, setText] = useState(SAMPLE);
  const [proofing, setProofing] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const keyboardWrapRef = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  useEffect(() => {
    const unlisten = listen("doubletap-rshift", () => {
      setProofing(true);
    });
    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  useEffect(() => {
    const wrap = keyboardWrapRef.current;
    if (!wrap) return;
    const viewport = wrap.parentElement;
    if (!viewport) return;

    let raf = 0;
    let ro: ResizeObserver | null = null;
    let mo: MutationObserver | null = null;
    let cancelled = false;

    const setup = (el: HTMLElement) => {
      const inner = el.querySelector<HTMLElement>(":scope > div");
      const target = inner ?? el;
      const cleared = proofing || done;

      target.style.boxShadow = cleared
        ? ""
        : "0 0 0 3px var(--accent), 0 0 28px 6px var(--accent)";
      target.style.borderRadius = "6px";
      target.style.transition = "box-shadow 300ms ease";
      if (!cleared && !reduceMotion) target.classList.add("animate-pulse");
      else target.classList.remove("animate-pulse");

      const position = () => {
        const vRect = viewport.getBoundingClientRect();
        const kRect = el.getBoundingClientRect();
        const wRect = wrap.getBoundingClientRect();
        if (kRect.width === 0) return;
        const keyCenterX = kRect.left - wRect.left + kRect.width / 2;
        const keyCenterY = kRect.top - wRect.top + kRect.height / 2;
        wrap.style.left = `${vRect.width * 0.55 - keyCenterX}px`;
        wrap.style.top = `${vRect.height / 2 - keyCenterY}px`;
      };
      position();
      ro = new ResizeObserver(position);
      ro.observe(viewport);
      ro.observe(wrap);
      ro.observe(el);
      window.addEventListener("resize", position);
      return position;
    };

    let onResize: (() => void) | null = null;

    const tryFind = () => {
      if (cancelled) return;
      const el = wrap.querySelector<HTMLElement>('[aria-label="ShiftRight"]');
      if (el && el.getBoundingClientRect().width > 0) {
        onResize = setup(el);
        return;
      }
      raf = requestAnimationFrame(tryFind);
    };
    tryFind();

    mo = new MutationObserver(() => {
      if (ro) return;
      tryFind();
    });
    mo.observe(wrap, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
      mo?.disconnect();
      if (onResize) window.removeEventListener("resize", onResize);
    };
  }, [proofing, done, reduceMotion]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value;
    setText(next);
    if (next.trim() && next !== SAMPLE && proofing) {
      setProofing(false);
      setDone(true);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center text-center gap-4"
    >
      <div>
        <h1 className="text-[26px] font-medium tracking-tight leading-tight">
          Try the shortcut
        </h1>
        <p className="mt-3 text-[13.5px] text-[var(--text-soft)] leading-relaxed max-w-[440px] mx-auto">
          Select the sentence below, then double-tap Right Shift. proof·red
          will rewrite it in place.
        </p>
      </div>

      <div
        className="relative rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-sm pointer-events-none select-none overflow-hidden mx-auto"
        style={{ width: 420, height: 180 }}
        aria-hidden="true"
      >
        <div
          ref={keyboardWrapRef}
          className="absolute"
          style={{ top: 0, left: 0 }}
        >
          <Keyboard theme="classic" enableHaptics={false} enableSound={false} />
        </div>
      </div>

      <textarea
        ref={ref}
        value={text}
        onChange={handleChange}
        rows={3}
        className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 text-[14px] leading-relaxed text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors resize-none font-mono"
      />

      <div className="h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[12.5px] text-green-600"
            >
              <Check size={14} strokeWidth={2} />
              <span>Nice — you're ready.</span>
            </motion.div>
          ) : proofing ? (
            <motion.div
              key="proofing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-[12.5px] text-[var(--text-soft)]"
            >
              <span className="inline-block h-[8px] w-[8px] rounded-full bg-[var(--accent)] animate-pulse" />
              <span>Proofreading…</span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <button
        onClick={onFinish}
        className="px-6 py-2.5 rounded-lg bg-[var(--accent)] text-white text-[13.5px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
      >
        {done ? "Finish" : "I'll try later"}
      </button>
    </motion.div>
  );
}
