import { useEffect } from "react";
import { Shell } from "./components/Shell";
import { Toasts } from "./components/Toasts";
import { ProcessingSpinner } from "./components/ProcessingSpinner";
import { Home } from "./routes/Ledger";
import { Settings } from "./routes/Settings";
import { Account } from "./routes/Account";
import { Login } from "./routes/Login";
import { useUI } from "./lib/store";
import { useProofs } from "./lib/useProofs";
import { registerHotkey } from "./lib/hotkey";
import { registerOverlayBridge } from "./lib/overlay";
import { useAuth } from "./lib/auth";
import { supabase } from "./lib/supabase";
import { onOpenUrl, getCurrent } from "@tauri-apps/plugin-deep-link";

export default function App() {
  const route = useUI((s) => s.route);
  const load = useProofs((s) => s.load);
  const { session, loading } = useAuth();

  function handleDeepLinkUrl(url: string) {
    const parsed = new URL(url);
    const code = parsed.searchParams.get("code");
    const error = parsed.searchParams.get("error");
    if (error) { console.error("OAuth error:", error); return; }
    if (code) supabase.auth.exchangeCodeForSession(code).catch(console.error);
  }

  useEffect(() => {
    getCurrent().then((urls) => { if (urls?.[0]) handleDeepLinkUrl(urls[0]); });
    const unlisten = onOpenUrl((urls) => { if (urls[0]) handleDeepLinkUrl(urls[0]); });
    return () => { unlisten.then((fn) => fn()); };
  }, []);

  useEffect(() => {
    if (!session) return;
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
  }, [load, session]);

  if (loading) return null;

  if (!session) {
    return (
      <>
        <Login />
        <Toasts />
      </>
    );
  }

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
