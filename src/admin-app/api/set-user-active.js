import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// "Permanent" ban for deactivated users -- 100 years out. Supabase Auth
// requires a positive ban_duration string; null/'none' lifts the ban.
const PERMANENT_BAN = "876600h";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const { email, active } = req.body || {};
  if (!email || typeof active !== "boolean") {
    return res.status(400).json({ error: "email and active are required" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // No getUserByEmail in the admin API; list and filter. Page size of 1000
  // is fine at our scale.
  const { data: list, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) return res.status(500).json({ error: listError.message });

  const authUser = list.users.find((u) => u.email === email);
  if (!authUser) {
    // The profile row exists but the auth row doesn't -- they were never
    // signed in. Nothing to ban; client side will still gate via status.
    return res.status(200).json({ ok: true, skipped: "no auth user" });
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(authUser.id, {
    ban_duration: active ? "none" : PERMANENT_BAN,
  });
  if (updateError) return res.status(500).json({ error: updateError.message });

  return res.status(200).json({ ok: true });
}
