export const LICENSE_KEY_STORAGE = "grammarlol:license_key";

const BASE_URL = import.meta.env.VITE_PROOFREAD_BASE_URL as string | undefined;

export function getLicenseKey(): string | null {
  return localStorage.getItem(LICENSE_KEY_STORAGE);
}

export function setLicenseKey(key: string): void {
  localStorage.setItem(LICENSE_KEY_STORAGE, key);
}

export function clearLicenseKey(): void {
  localStorage.removeItem(LICENSE_KEY_STORAGE);
}

export async function validateLicenseKey(key: string): Promise<void> {
  if (!BASE_URL) throw new Error("VITE_PROOFREAD_BASE_URL not set");
  const res = await fetch(`${BASE_URL}/proofread`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-License-Key": key,
    },
    body: JSON.stringify({
      app_name: "onboarding-license-check",
      to_proofread: "license verification probe",
    }),
  });
  if (!res.ok) {
    throw new Error(`Invalid license key (${res.status})`);
  }
}
