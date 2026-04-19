import { invoke } from "@tauri-apps/api/core";
import {
  register,
  unregister,
  isRegistered,
} from "@tauri-apps/plugin-global-shortcut";
import { useProofs } from "./useProofs";

const SHORTCUT = "CmdOrCtrl+Shift+J";

type Capture = { app_name: string; text: string };

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

export async function registerHotkey() {
  try {
    if (await isRegistered(SHORTCUT)) await unregister(SHORTCUT);
    await register(SHORTCUT, (e) => {
      console.log("[hotkey] event", e);
      if (e.state === "Pressed") void onTrigger();
    });
    console.log("[hotkey] registered", SHORTCUT);
  } catch (e) {
    console.error("[hotkey] registerHotkey failed", e);
  }
}
