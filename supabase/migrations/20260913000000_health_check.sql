-- Sprint 1, req 9: the baseline migration that proves the migration path
-- (versioned SQL committed to the repo, applied through Supabase's GitHub
-- integration on push to main, per D-50) end to end on production.
--
-- `health_check()` is deliberately the only thing this migration does. It
-- backs GET /api/health (req 10): a 200 with {"ok":true,"database":true}
-- from production is proof this migration actually reached the one
-- production database, not just that the app deployed.

create function public.health_check()
returns boolean
language sql
security invoker
stable
set search_path = ''
as $$
  select true;
$$;

-- New functions are executable by PUBLIC by default in Postgres. Revoke
-- that first, from every Data API role explicitly, then grant back to
-- `anon` only — the health check must work for an unauthenticated caller,
-- and nothing broader than that (req 9's acceptance criterion: "revokes
-- execute from public, and grants execute to anon only").
revoke all on function public.health_check() from public;
revoke all on function public.health_check() from anon, authenticated, service_role;
grant execute on function public.health_check() to anon;
