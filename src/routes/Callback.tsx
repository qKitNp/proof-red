import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export function Callback() {
  const [status, setStatus] = useState("Exchanging code…");

  async function exchange() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      setStatus(`OAuth error: ${error}`);
      return;
    }

    if (!code) {
      setStatus("No authorization code in URL");
      return;
    }

    // Exchange code for session in this tab
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      setStatus(`Exchange failed: ${exchangeError.message}`);
      return;
    }

    // In dev mode, relay the code to the Tauri app via the Vite dev server
    // (WKWebView and external browsers don't share localStorage)
    try {
      await fetch("http://localhost:1420/__oauth-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
    } catch {
      // In non-dev mode or if the bridge isn't available, ignore
    }

    setStatus("✓ Authenticated! You can close this tab.");
    try { window.close(); } catch { /* some browsers block programmatic close */ }
  }

  useEffect(() => {
    exchange();
  }, []);

  return (
    <div className="h-full flex items-center justify-center bg-[var(--bg)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="text-[36px] font-semibold tracking-tight leading-none">
          proof<span className="text-[var(--accent)]">·</span>red
        </div>
        <p className="text-[14px] text-[var(--text-soft)]">{status}</p>
      </div>
    </div>
  );
}
