import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import {
  register,
  unregister,
  isRegistered,
  type ShortcutEvent,
} from "@tauri-apps/plugin-global-shortcut";
import { useProofs } from "./useProofs";
import { useToasts } from "./store";

/** Fallback shortcut for non-mac platforms. macOS uses double-tap Control. */
const FALLBACK_SHORTCUT = "Ctrl+Alt+Shift+Semicolon";

type Capture = { app_name: string; text: string };

function isMac(): boolean {
  if (typeof navigator === "undefined") return false;
  const p = (navigator as Navigator & { userAgentData?: { platform?: string } })
    .userAgentData?.platform;
  if (p) return p.toLowerCase().includes("mac");
  return /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);
}

async function onTrigger() {
  let capture: Capture;
  try {
    capture = await invoke<Capture>("capture_selection");
  } catch (e) {
    console.error("capture_selection failed", e);
    return;
  }
  const text = capture.text?.trim();
  if (!text) return;

  const appName = capture.app_name || "unknown";
  const proof = await useProofs.getState().submit({ appName, text: capture.text });

  if (proof.status === "success" && proof.after) {
    try {
      await invoke("replace_selection", { text: proof.after });
    } catch (e) {
      console.error("replace_selection failed", e);
    }
  }
}

const handler = (e: ShortcutEvent) => {
  if (e.state === "Pressed") void onTrigger();
};

export async function registerHotkey(): Promise<() => void> {
  if (isMac()) {
    const offTrigger = await listen("doubletap-control", () => {
      console.log("[hotkey] doubletap-control");
      void onTrigger();
    });
    const offPerm = await listen("doubletap-permission-missing", () => {
      useToasts.getState().push({
        id: "doubletap-permission-missing",
        tone: "error",
        title: "Accessibility permission needed",
        description:
          "proof·red needs Accessibility access to detect the double-tap Control shortcut. Open System Settings -> Privacy & Security -> Accessibility and enable proof·red, then restart the app.",
        durationMs: 0,
      });
    });
    console.log("[hotkey] listening for double-tap Control");
    return () => {
      offTrigger();
      offPerm();
    };
  }

  try {
    if (await isRegistered(FALLBACK_SHORTCUT)) await unregister(FALLBACK_SHORTCUT);
    await register(FALLBACK_SHORTCUT, handler);
    console.log("[hotkey] registered", FALLBACK_SHORTCUT);
    return () => {
      void unregister(FALLBACK_SHORTCUT).catch(() => {});
    };
  } catch (e) {
    console.error("[hotkey] registerHotkey failed", e);
    const msg = e instanceof Error ? e.message : String(e);
    useToasts.getState().push({
      id: "hotkey-register-failed",
      tone: "error",
      title: `Couldn't register ${FALLBACK_SHORTCUT}`,
      description: `${msg}. Another app may already use this shortcut.`,
      durationMs: 0,
    });
    return () => {};
  }
}
