import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useProofs } from "./useProofs";
import { useToasts } from "./store";

type Capture = { app_name: string; text: string };

async function onTrigger() {
  let capture: Capture;
  try {
    capture = await invoke<Capture>("capture_selection");
  } catch (e) {
    console.error("capture_selection failed", e);
    return;
  }
  let text = capture.text?.trim();
  if (!text) {
    try {
      capture = await invoke<Capture>("select_all_and_capture");
    } catch (e) {
      console.error("select_all_and_capture failed", e);
      return;
    }
    text = capture.text?.trim();
    if (!text) return;
    if (capture.text.length >= 2000) {
      useToasts.getState().push({
        id: "proofread-too-long",
        tone: "error",
        title: "Text too long",
        description: "Select a shorter passage (under 2000 characters) to proofread.",
        durationMs: 4000,
      });
      return;
    }
  }

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

export async function registerHotkey(): Promise<() => void> {
  const offTrigger = await listen("doubletap-rshift", () => {
    console.log("[hotkey] doubletap-rshift");
    void onTrigger();
  });
  const offPerm = await listen("doubletap-permission-missing", () => {
    useToasts.getState().push({
      id: "doubletap-permission-missing",
      tone: "error",
      title: "Accessibility permission needed",
      description:
        "proof·red needs Accessibility access to detect the double-tap Right Shift shortcut. Open System Settings -> Privacy & Security -> Accessibility and enable proof·red, then restart the app.",
      durationMs: 0,
    });
  });
  console.log("[hotkey] listening for double-tap Right Shift");
  return () => {
    offTrigger();
    offPerm();
  };
}
