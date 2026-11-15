# Swasthloop

Next.js public site and account foundation for Swasthloop. Supabase Auth and database access require a project URL, publishable key, email configuration, and applied SQL migration.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `NEXT_PUBLIC_SITE_URL` in `.env.local`. The publishable key is intended for browser-safe use; never put a service-role key in a `NEXT_PUBLIC_` variable. Restart the dev server after changing environment values.

## Configure Supabase Auth

1. Create a Supabase project and copy its project URL and publishable key into `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to `http://localhost:3000` for local development.
2. In **Authentication → URL Configuration**, set the local Site URL and allow `http://localhost:3000/**`. Add the deployed site URL and its redirect pattern when deploying.
3. In **Authentication → Email Templates**, use the token-hash confirmation link so server-side Auth can establish the cookie session:

   ```html
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next={{ .RedirectTo }}">Confirm email</a>
   ```

   For the password recovery template, use:

   ```html
   <a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/account/update-password">Reset password</a>
   ```

4. Link the Supabase project and apply the tracked migrations:

   ```bash
   npx --yes supabase login
   npx --yes supabase link --project-ref <your-project-ref>
   npx --yes supabase db push
   ```

5. Register and confirm the founder's account. In the Supabase SQL Editor, promote that exact profile to the first administrator, replacing the email below:

   ```sql
   update public.profiles as profile
   set role = 'admin'
   from auth.users as auth_user
   where profile.id = auth_user.id
     and lower(auth_user.email) = lower('founder@example.com');
   ```

   Confirm the editor reports exactly one updated row. This trusted SQL setup is the only initial admin bootstrap; public registration cannot assign the admin role. Add only approved specialties in the database before accepting doctor applications.

## Database tests

The local Supabase stack needs Docker Desktop running. The SQL tests create synthetic Auth users and roll back all test data.

```bash
npx --yes supabase start
npm run test:db
```

## Project checks

```bash
npm run lint
npm run typecheck
npm run build
```
