import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(url, key, {
  auth: {
    flowType: "pkce",
    detectSessionInUrl: false,
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Subscription = {
  user_id: string;
  provider: string;
  customer_id: string | null;
  subscription_id: string | null;
  status: "active" | "trialing" | "past_due" | "canceled" | "incomplete";
  plan: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};
