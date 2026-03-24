import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured: missing Supabase credentials' }) };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { id, email } = JSON.parse(event.body);

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'User id is required' }) };
    }

    // 1. Delete the user row from our users table
    const { error: dbError } = await supabase.from('users').delete().eq('id', id);
    if (dbError) {
      return { statusCode: 400, body: JSON.stringify({ error: dbError.message }) };
    }

    // 2. Delete from Supabase Auth (if they have an auth account)
    if (email) {
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      const authUser = authUsers?.users?.find((u) => u.email === email);
      if (authUser) {
        await supabase.auth.admin.deleteUser(authUser.id);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
