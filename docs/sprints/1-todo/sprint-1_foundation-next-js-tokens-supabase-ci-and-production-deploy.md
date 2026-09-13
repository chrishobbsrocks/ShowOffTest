---
id: 1
title: "Foundation: Next.js, tokens, Supabase, CI and production deploy"
epic: "Show Off Rebuild"
status: todo
created: 2026-09-13T04:44:17+00:00
---

# Master Controller Sprint Definition — Sprint 1

**Epic:** Show Off Rebuild — rebuild the Show Off trivia game from `docs/rebuild/show-off-rebuild-prd.md` as a test of the Fully Completely harness.
**Sprint Objective:** Stand up the empty application on the PRD's stack, with every design token shipped, the database migration path proven end to end on production, and CI gating every push.

### Context
Every later sprint builds on this one: accounts (sprint 2) and the question bank (sprint 3) both need a working app, a Supabase connection and a way to get schema changes into the one production database. PRD section 8 puts the scaffold first, and NFR-1, NFR-4 and NFR-5 are cheapest to satisfy before any feature exists.

This sprint ships no product features and no product copy. Its only visible screen is the design's Splash frame, which has no text, so the live test has something real to check tokens, fonts and assets against. Read `CLAUDE.md` ("Show Off rebuild standards") and `docs/rebuild/mc-decisions.md` before starting. The no-email rule (D-03) applies from this sprint on.

### Requirements
1. **Application scaffold.** A Next.js 16 App Router app with React 19 and TypeScript in strict mode, at the repository root, running on Node 24.x (declared in `package.json` `engines`). The framework's own directories (`scripts/`, `.claude/`, `templates/`, `docs/sprints/`) are untouched and excluded from linting and type checking. `.gitignore` covers dependencies, build output and local env files.
2. **Every design token reaches the browser (NFR-1, P6).** All 17 tokens in `docs/design/design-tokens.md` — the 10 colours and the 7 shape, padding, shadow and border tokens — are defined once, as CSS custom properties with exactly the names in that file (for example `--color-bg-base`), with exactly its values, and are exposed as Tailwind CSS 4 theme values usable by name. The type tokens that file lists with values (`type-input`, `type-button`, `type-body`, `type-link`, `type-caption`, `type-legal`) are defined the same way. `type-error` is left undefined, as that file instructs; Master Controller resolves it before sprint 2.
3. **No literal colours in components (P6).** An automated check, run as part of the test suite or lint, fails if a hex, `rgb()` or `hsl()` colour literal appears in application source outside the single token stylesheet.
4. **Token drift test.** An automated test reads `docs/design/design-tokens.md`, and fails if any of the 17 token names or values in it is missing from, or differs from, the shipped token stylesheet.
5. **Typefaces.** Bebas Neue (400) and Space Grotesk (400 and 500) load in production without layout-blocking requests to a third-party host at runtime. The mechanism is the team's choice.
6. **Assets moved into the app.** Everything under `docs/public/` is moved (not copied) to `public/`, keeping its folder structure and file names (`public/avatars/avatar-1.svg`, `public/arenas/arena-01-badge.png`, `public/host/host-01-neutral.png`, `public/brand/show-off-logo.svg`, and so on).
7. **Splash screen at `/`.** The root route renders the design's `Splash` frame (Game UI page): the Show Off logo (`public/brand/show-off-logo.svg`) centred on the `--color-bg-base` background, with no text. It renders correctly from 320px wide (NFR-3). Sprint 2 replaces this route with the landing page. Using `--color-bg-base` rather than the frame's untokenised `#0F0E0C` is deliberate (P6).
8. **Supabase clients.** Server and browser Supabase clients for the production project. Configuration comes from environment variables only; a committed `.env.example` lists every variable name with no values. The service-role credential is readable only by server code: its module fails to import into client code (for example via `server-only`), and its variable name does not use the `NEXT_PUBLIC_` prefix (SEC-4).
9. **Migration path proven on production (NFR-5).** Schema changes live as versioned SQL migrations committed under `supabase/migrations/`. This sprint adds one baseline migration that creates a SQL function `public.health_check()` returning `true`, executable by the anon role and nothing else. How migrations are applied to the production database is the team's choice, but it must not require any role other than the operator to hold a production secret; the chosen procedure is written into `CLAUDE.md`'s project standards so every later sprint follows it. The baseline migration is applied to production before the live test.
10. **Health endpoint.** `GET /api/health` calls `health_check()` through the server Supabase client and returns HTTP 200 with `{"ok":true,"database":true}` when it succeeds, and a non-200 status with `{"ok":false,"database":false}` when it fails. The response contains nothing else: no error text, keys, URLs or stack traces.
11. **CI on every push (NFR-4).** A GitHub Actions workflow runs on every push to any branch and on every pull request, and runs lint, type checking, the Vitest suite (jsdom, with Testing Library installed) and `next build`. Any failure fails the run, visibly, on the commit. CI needs no production secret.
12. **Production deploy.** The Vercel project builds production from `main`. The production URL is written into `CLAUDE.md`'s project standards.
13. **No-email configuration check (D-03).** Before the live test, confirm that Supabase "Confirm email" is off, without creating an account. *Flagged assumption, Dev Team must verify before relying on it:* the project's public `GET <SUPABASE_URL>/auth/v1/settings` endpoint (with the anon key) reports this as `"mailer_autoconfirm": true`. If that assumption turns out false, record what was found in this sprint's notes and ask the operator to confirm the dashboard setting instead. No account is created in this sprint, by any role.

### Acceptance Criteria
1. QA1: `package.json` pins Next 16.x, React 19.x and TypeScript with `strict: true`; `engines.node` is `24.x`; lint and type-check configs exclude the framework directories; `git diff` shows no change under `scripts/`, `.claude/`, `templates/` or `docs/sprints/` other than lifecycle bookkeeping.
2. QA1: the token stylesheet defines all 17 tokens with names and values identical to `docs/design/design-tokens.md` (checked line by line), plus the six valued type tokens, and no `type-error`. A Tailwind utility is used by token name in at least the Splash screen. LiveQA: on production, `getComputedStyle(document.documentElement)` returns each of the 10 colour tokens' values exactly.
3. QA1: the check exists and runs in CI. Adding a hex literal to a component on a scratch branch makes it fail (Dev Team shows this in a test, or QA1 confirms the rule by reading it).
4. QA1: the test exists, parses the tokens file rather than a hardcoded copy of it, and a deliberately changed value in the stylesheet makes it fail.
5. LiveQA: on production, both families render in the browser's computed fonts, and no font request goes to `fonts.googleapis.com` or `fonts.gstatic.com` at page load (checked in the network panel).
6. QA1: `docs/public/` no longer exists; `public/` holds the same 34 files at the same relative paths (10 avatars, 6 badges, 6 tags plus the global tag, 10 host images, the logo). LiveQA: `/avatars/avatar-1.svg`, `/arenas/arena-06-badge.png`, `/host/host-10-greetings.png` and `/brand/show-off-logo.svg` all return 200 on production.
7. LiveQA: `/` on production shows the logo centred on black with no text, at 320px, 375px and desktop widths, with no horizontal scroll and no console errors. Visual comparison against the Figma `Splash` frame.
8. QA1: the service-role client imports a server-only guard, the variable has no `NEXT_PUBLIC_` prefix, `.env.example` lists every variable used with no values, and no real key appears anywhere in the repository. LiveQA: searching every JavaScript file served on production for the service-role variable name and for the start of the service-role key value finds nothing.
9. QA1: `supabase/migrations/` holds exactly one migration; it creates `health_check()`, revokes execute from `public`, and grants execute to `anon` only. The procedure for applying migrations is in `CLAUDE.md` and needs no secret held by anyone but the operator.
10. LiveQA: `GET /api/health` on production returns 200 and exactly `{"ok":true,"database":true}` — which also proves the baseline migration reached production. QA1: an automated test covers the failure branch and asserts the response body is exactly `{"ok":false,"database":false}`.
11. QA1: the workflow file triggers on `push` (all branches) and `pull_request` and runs all four steps. LiveQA: the GitHub Actions run for the deployed commit is green.
12. LiveQA: the production URL in `CLAUDE.md` serves the deployed commit (Vercel shows that commit on the production deployment).
13. LiveQA: the settings check shows email confirmation is off (or the operator's confirmation is recorded if the assumption failed), and Supabase's auth user list is empty after the live test — no account was created.

### Out of Scope
- Any authentication, route beyond `/` and `/api/health`, tab bar or navigation — sprint 2 onward.
- Any database table — each feature sprint adds its own migrations.
- Any product copy, GAP strings or arena data — they belong to the sprints that use them.
- Type tokens not listed with values in `design-tokens.md` (for example `type-display`) and the `type-error` size — Master Controller records them before the sprint that needs them.
- Icon library choice — decided in the first sprint that needs an icon.

### Dependencies
- Blocks: sprint 2 (accounts) and sprint 3 (question bank).
- Blocked by: nothing. Inputs are committed (`e18021d`).
- External: Supabase and Vercel projects exist (operator, done). The operator supplies environment variable values to Vercel and to whoever applies migrations, and must be available to apply the baseline migration if the chosen procedure needs it.

### Team Assignments
- **Dev Team 1:** the whole sprint.
- **Dev Team 2:** not assigned.

### Risks & Mitigations
- Next.js 16 and Tailwind CSS 4 conventions differ from older versions that most examples show — verify against the installed versions' own documentation, not memory; QA1 checks the pinned versions.
- Applying migrations to production could quietly depend on a secret sitting in a role's session — requirement 9 forbids it and QA1 checks the documented procedure.
- The public auth settings endpoint may not report `mailer_autoconfirm` as assumed — requirement 13 names the fallback; nobody tests it by signing up.
- The repository root also holds the framework's own files, and tooling could lint, format or rewrite them — requirement 1 excludes them and QA1 checks the diff.
