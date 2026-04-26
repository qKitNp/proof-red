import { useEffect, useState } from "react";
import { Shell } from "./components/Shell";
import { Toasts } from "./components/Toasts";
import { ProcessingSpinner } from "./components/ProcessingSpinner";
import { Home } from "./routes/Ledger";
import { Settings } from "./routes/Settings";
import { Account } from "./routes/Account";
import { Onboarding, ONBOARDING_FLAG } from "./routes/Onboarding";
import { useUI } from "./lib/store";
import { useProofs } from "./lib/useProofs";
import { registerHotkey } from "./lib/hotkey";
import { registerOverlayBridge } from "./lib/overlay";

export default function App() {
  const route = useUI((s) => s.route);
  const load = useProofs((s) => s.load);
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem(ONBOARDING_FLAG) === "1"
  );

  useEffect(() => {
    if (!onboarded) return;
    load();
    let cleanup: (() => void) | null = null;
    let cancelled = false;
    registerHotkey().then((fn) => {
      if (cancelled) fn();
      else cleanup = fn;
    });
    const offOverlay = registerOverlayBridge();
    return () => {
      cancelled = true;
      cleanup?.();
      offOverlay();
    };
  }, [load, onboarded]);

  if (!onboarded) {
    return (
      <>
        <Onboarding onComplete={() => setOnboarded(true)} />
        <Toasts />
      </>
    );
  }

  return (
    <>
      <Shell onRedoOnboarding={() => { localStorage.removeItem(ONBOARDING_FLAG); setOnboarded(false); }}>
        {route === "home" && <Home />}
        {route === "settings" && <Settings />}
        {route === "account" && <Account />}
      </Shell>
      <ProcessingSpinner />
      <Toasts />
    </>
  );
}
