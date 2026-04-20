import { openUrl } from "@tauri-apps/plugin-opener";
import { supabase } from "./supabase";

const BASE_URL = import.meta.env.VITE_PROOFREAD_BASE_URL as string;

export type Plan = "pro_monthly" | "pro_yearly";

async function getToken(): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Not signed in");
  return token;
}

export async function startCheckout(plan: Plan): Promise<void> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/billing/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) throw new Error(`Checkout failed: ${res.status}`);
  const { url } = (await res.json()) as { url: string };
  await openUrl(url);
}

export async function openPortal(): Promise<void> {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/billing/portal`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Portal failed: ${res.status}`);
  const { url } = (await res.json()) as { url: string };
  await openUrl(url);
}
