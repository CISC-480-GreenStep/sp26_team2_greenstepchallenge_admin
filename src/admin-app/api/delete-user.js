/**
 * @file delete-user.js
 * @summary Vercel API route -- permanent SuperAdmin user delete.
 *
 * Counterpart to `set-user-active.js` (deactivate). Where deactivate
 * just bans the auth credential and flips a status flag, this route
 * fully purges the user from both Supabase Auth and the app `users`
 * table.
 *
 * Cascade behavior is encoded in the schema (migration 001):
 *   - `participation."userId"`  ON DELETE CASCADE  -> rows go away
 *   - `activity_logs."userId"`  ON DELETE CASCADE  -> rows go away
 *   - `*.createdBy`             ON DELETE SET NULL -> author becomes null
 *
 * Net effect: the user disappears, their action completions disappear
 * (because they no longer count), and anything they authored
 * (challenges, templates, groups) survives but anonymized.
 *
 * Authorization is handled by the frontend (SuperAdmin-only button)
 * AND by the service-role key being server-only -- the frontend can't
 * call Supabase admin APIs directly.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const { userId, email } = req.body || {};
  if (!userId || !email) {
    return res.status(400).json({ error: "userId and email are required" });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Step 1 -- find the auth.users row by email so we can call deleteUser
  // with its UUID. listUsers maxes at 1000 per page; fine at our scale.
  // If the user never signed in there's no auth row to delete; that's
  // not a failure -- we still want to drop the app-side row.
  const { data: list, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });
  if (listError) return res.status(500).json({ error: listError.message });

  const authUser = list.users.find((u) => u.email === email);
  if (authUser) {
    const { error: authDeleteError } = await supabase.auth.admin.deleteUser(authUser.id);
    if (authDeleteError) {
      return res.status(500).json({ error: authDeleteError.message });
    }
  }

  // Step 2 -- delete the app users row. FK cascades clean up
  // participation + activity_logs; createdBy refs go to NULL.
  const { error: rowDeleteError } = await supabase.from("users").delete().eq("id", userId);
  if (rowDeleteError) {
    return res.status(500).json({ error: rowDeleteError.message });
  }

  return res.status(200).json({ ok: true, authDeleted: !!authUser });
}
