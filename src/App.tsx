import { useEffect, useState } from "react";
import { Shell } from "./components/Shell";
import { Toasts } from "./components/Toasts";
import { ProcessingSpinner } from "./components/ProcessingSpinner";
import { Home } from "./routes/Ledger";
import { Settings } from "./routes/Settings";
import { Account } from "./routes/Account";
import { Login } from "./routes/Login";
import { Onboarding, ONBOARDING_FLAG } from "./routes/Onboarding";
import { useUI } from "./lib/store";
import { useProofs } from "./lib/useProofs";
import { registerHotkey } from "./lib/hotkey";
import { registerOverlayBridge } from "./lib/overlay";
import { useAuth } from "./lib/auth";
import { Callback } from "./routes/Callback";
import { supabase } from "./lib/supabase";
import { onOpenUrl, getCurrent } from "@tauri-apps/plugin-deep-link";

export default function App() {
  const path = window.location.pathname;

  if (path === "/callback") {
    return <Callback />;
  }
  const route = useUI((s) => s.route);
  const load = useProofs((s) => s.load);
  const { session, loading } = useAuth();
  const BYPASS_AUTH = import.meta.env.DEV;
  const effectiveSession = BYPASS_AUTH ? ({ user: { id: "dev-user" } } as any) : session;
  const effectiveLoading = BYPASS_AUTH ? false : loading;
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem(ONBOARDING_FLAG) === "1"
  );

  function handleDeepLinkUrl(url: string) {
    const parsed = new URL(url);
    const code = parsed.searchParams.get("code");
    const error = parsed.searchParams.get("error");
    if (error) { console.error("OAuth error:", error); return; }
    if (code) supabase.auth.exchangeCodeForSession(code).catch(console.error);
  }

  // In dev mode, poll the Vite dev server bridge for OAuth codes
  // relayed from the external browser tab.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const id = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:1420/__oauth-state");
        const data = await res.json();
        if (data.code) {
          supabase.auth.exchangeCodeForSession(data.code).catch(console.error);
        }
      } catch { /* dev server not reachable */ }
    }, 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    getCurrent().then((urls) => { if (urls?.[0]) handleDeepLinkUrl(urls[0]); });
    const unlisten = onOpenUrl((urls) => { if (urls[0]) handleDeepLinkUrl(urls[0]); });
    return () => { unlisten.then((fn) => fn()); };
  }, []);

  useEffect(() => {
    if (!effectiveSession) return;
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
  }, [load, effectiveSession]);

  if (effectiveLoading) return null;

  if (!onboarded) {
    return (
      <>
        <Onboarding onComplete={() => setOnboarded(true)} />
        <Toasts />
      </>
    );
  }

  if (!effectiveSession) {
    return (
      <>
        <Login />
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
