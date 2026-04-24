import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../lib/auth";

export function StepLogin({ onNext }: { onNext: () => void }) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) onNext();
  }, [session, onNext]);

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);
    try {
      const redirectUrl = import.meta.env.DEV
        ? "http://localhost:1420/callback"
        : "proofred://auth/callback";
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });
      if (oauthError) throw oauthError;
      if (data.url) await openUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setLoading(false);
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
          Sign in to continue
        </h1>
        <p className="mt-3 text-[13.5px] text-[var(--text-soft)] leading-relaxed max-w-[420px] mx-auto">
          Your proofs sync across devices. We only use your account to keep
          your history and subscription in one place.
        </p>
      </div>

      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="w-full max-w-[280px] flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--sidebar)] text-[13.5px] font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!loading && (
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
        )}
        {loading ? "Opening browser…" : "Continue with Google"}
      </button>

      {error && <p className="text-[12px] text-red-500">{error}</p>}

      <p className="text-[11.5px] text-[var(--text-faint)] max-w-[280px] leading-relaxed">
        After signing in with Google, return to this window.
      </p>
    </motion.div>
  );
}
