-- Sprint 2, req 8 (SEC-2, SEC-3, PRO-9): the player profile table and its
-- row-level security. One profile row per Supabase Auth user (auth.users),
-- created by the server only — never directly by the browser — as part of
-- sign-up's all-or-nothing flow (req 6, ACC-5). Trophies, match results and
-- any other server-only field are a later sprint's migration; this one
-- holds only what sprint 2 needs: avatar, display name, tutorial
-- completion and creation time.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  avatar text not null,
  -- Empty until sprint 11 (req 8). A timestamp doubles as "completed or
  -- not" (null = not completed) without a separate boolean that could
  -- disagree with it.
  tutorial_completed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint profiles_display_name_length
    check (char_length(display_name) between 2 and 10),
  constraint profiles_avatar_valid
    check (avatar in (
      'avatar-1', 'avatar-2', 'avatar-3', 'avatar-4', 'avatar-5',
      'avatar-6', 'avatar-7', 'avatar-8', 'avatar-9', 'avatar-10'
    ))
);

-- Req 4: case-insensitive display-name uniqueness is a database constraint,
-- not only an application check, so two simultaneous sign-ups with
-- "Doorak" and "doorak" cannot both succeed — the loser's insert raises a
-- unique_violation that the server maps to the "already taken" message.
create unique index profiles_display_name_lower_key
  on public.profiles (lower(display_name));

alter table public.profiles enable row level security;

-- SEC-3: a player can read only their own profile — nothing grants a
-- player another player's row, or anyone's email (email lives on
-- auth.users, which this policy never touches).
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- SEC-3 / PRO-9: a player can update only their own row. Which *columns*
-- of that row are writable is enforced separately below, by Postgres
-- column-level privileges — an RLS policy constrains rows, not columns, so
-- USING/WITH CHECK alone cannot stop an authorised row-owner from writing
-- a column like `created_at`.
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No INSERT or DELETE policy is granted to `anon` or `authenticated`: the
-- server creates (req 6) and will later delete (a future sprint) profile
-- rows using the service-role key, which bypasses RLS entirely. With RLS
-- enabled and no matching policy, Postgres denies every browser-originated
-- insert or delete outright.

-- New tables grant nothing to PUBLIC beyond the owner's default ACL; be
-- explicit anyway, then grant back only what each Data API role needs.
-- `authenticated` gets SELECT (row-scoped above) and UPDATE on exactly the
-- three writable columns (PRO-9) — never the whole row, so no other column
-- is writable from the browser even by a request that satisfies the RLS
-- policy.
revoke all on public.profiles from public, anon, authenticated;
grant select on public.profiles to authenticated;
grant update (display_name, avatar, tutorial_completed_at) on public.profiles to authenticated;

-- No display-name-availability RPC is added here: sign-up (lib/auth/create-
-- account.ts) relies on the unique index above and maps its violation to
-- the "already taken" message, rather than a separate check-then-insert —
-- a pre-check has a race window a concurrent insert can still slip
-- through (exactly what req 4 forbids), so the constraint itself is the
-- only enforcement this sprint needs. A live-typing availability check, if
-- a later sprint wants one for UX, is a new RPC added when something
-- actually calls it.
