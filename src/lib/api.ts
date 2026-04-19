const BASE_URL = import.meta.env.VITE_PROOFREAD_BASE_URL as string | undefined;

export type ProofreadRequest = {
  appName: string;
  text: string;
  screenshot?: string;
};

type ProofreadResponse = { proofread_text: string };

export async function proofread(req: ProofreadRequest): Promise<{ corrected: string }> {
  if (!BASE_URL) throw new Error("VITE_PROOFREAD_BASE_URL not set");
  const res = await fetch(`${BASE_URL}/proofread`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_name: req.appName,
      to_proofread: req.text,
      screenshot: req.screenshot,
    }),
  });
  if (!res.ok) {
    throw new Error(`proofread failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as ProofreadResponse;
  return { corrected: data.proofread_text };
}
