-- ============================================================
-- 005: Add a known dev password for the Quick Login button
-- ============================================================
-- The "Quick Login as Kristin (SuperAdmin)" shortcut on the login
-- page lets the team skip the email round-trip during development.
-- With RLS enabled (migration 006) every request must carry a real
-- Supabase Auth JWT, so this migration ensures the seeded SuperAdmin
-- has an auth.users entry with a known password the front-end can
-- sign in with.
--
-- The dev login button (and this auth row) will be removed before
-- production. The password lives in source code on the client side
-- by design -- it is not protecting anything sensitive on its own;
-- the protection is that production removes the bypass entirely.
-- ============================================================

-- pgcrypto lives in the `extensions` schema on Supabase, so functions
-- need to be schema-qualified (search_path inside DO blocks does not
-- include `extensions` by default).
create extension if not exists pgcrypto with schema extensions;
do $$
declare
  dev_password text := 'gsc-dev-password';
  dev_emails text[] := array['kristin.mroz@mpca.mn.gov'];
  e text;
begin
  foreach e in array dev_emails loop
    if exists (select 1 from auth.users where email = e) then
      -- User already exists (probably from a magic-link sign-in earlier).
      -- Just stamp the dev password on top so the button works.
      update auth.users
        set encrypted_password = extensions.crypt(dev_password, extensions.gen_salt('bf')),
            email_confirmed_at = coalesce(email_confirmed_at, now()),
            updated_at = now()
        where email = e;
    else
      insert into auth.users (
        instance_id, id, aud, role, email, encrypted_password,
        email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
        created_at, updated_at,
        confirmation_token, email_change, email_change_token_new, recovery_token
      ) values (
        '00000000-0000-0000-0000-000000000000',
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        e,
        extensions.crypt(dev_password, extensions.gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{}'::jsonb,
        now(),
        now(),
        '', '', '', ''
      );
    end if;
  end loop;
end $$;
