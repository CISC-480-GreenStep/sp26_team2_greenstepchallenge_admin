import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!supabaseUrl || !serviceRoleKey) {
    return res.status(500).json({ error: 'Server misconfigured: missing Supabase credentials' });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { email, name, role, status, groupId, department } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Invite the user via Supabase Auth (sends invitation email)
    const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(email);
    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // Insert the user row in our users table
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
      return res.status(400).json({ error: userError.message });
    }

    return res.status(200).json(userData);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
