import { useEffect } from "react";
import { Shell } from "./components/Shell";
import { Toasts } from "./components/Toasts";
import { ProcessingSpinner } from "./components/ProcessingSpinner";
import { Home } from "./routes/Ledger";
import { Settings } from "./routes/Settings";
import { Account } from "./routes/Account";
import { useUI } from "./lib/store";
import { useProofs } from "./lib/useProofs";
import { registerHotkey } from "./lib/hotkey";
import { registerOverlayBridge } from "./lib/overlay";

export default function App() {
  const route = useUI((s) => s.route);
  const load = useProofs((s) => s.load);

  useEffect(() => {
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
  }, [load]);

  return (
    <>
      <Shell>
        {route === "home" && <Home />}
        {route === "settings" && <Settings />}
        {route === "account" && <Account />}
      </Shell>
      <ProcessingSpinner />
      <Toasts />
    </>
  );
}
