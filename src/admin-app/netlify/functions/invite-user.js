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
    const { email, name, role, status, groupId, department } = JSON.parse(event.body);

    if (!email || !name) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Email and name are required' }) };
    }

    // 1. Invite the user via Supabase Auth (sends invitation email)
    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(email);
    if (authError) {
      return { statusCode: 400, body: JSON.stringify({ error: authError.message }) };
    }

    // 2. Insert the user row in our users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        name,
        email,
        role: role || 'GeneralUser',
        status: status || 'Active',
        groupId: groupId || null,
        department: department || null,
        createdAt: new Date().toISOString().slice(0, 10),
      })
      .select()
      .single();

    if (userError) {
      return { statusCode: 400, body: JSON.stringify({ error: userError.message }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
