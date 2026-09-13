import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/**
 * Sprint 2, req 10 / req 1 (ACC-10, D-45): the redirect decisions proxy.ts
 * delegates to updateSession(). getUser() itself (real session
 * revalidation against Supabase Auth) is exercised live by LiveQA and by
 * lib/auth/session.ts's own use of the same pattern — this suite mocks
 * `@supabase/ssr` to drive both the signed-in and signed-out branches
 * deterministically.
 */

const getUser = vi.fn();
const createServerClientMock = vi.fn(() => ({
  auth: { getUser },
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: createServerClientMock,
}));

// lib/env.ts throws loudly on a missing variable (NFR-7); this suite isn't
// testing that, so it supplies the two proxy-session.ts actually reads,
// matching tests/env.test.ts's own pattern for stubbing them.
process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:54321";
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-publishable-key";

afterEach(() => {
  getUser.mockReset();
  createServerClientMock.mockClear();
});

function requestFor(pathname: string, search = ""): NextRequest {
  return new NextRequest(new URL(`http://localhost:3000${pathname}${search}`));
}

describe("updateSession", () => {
  it.each(["/home", "/play", "/profile", "/leaderboard", "/tutorial"])(
    "redirects a signed-out visitor from %s to /login",
    async (path) => {
      getUser.mockResolvedValueOnce({ data: { user: null } });
      const { updateSession } = await import("@/lib/supabase/proxy-session");

      const response = await updateSession(requestFor(path));

      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/login");
    },
  );

  it.each(["/", "/signup", "/login"])(
    "redirects a signed-in visitor from %s to /home",
    async (path) => {
      getUser.mockResolvedValueOnce({ data: { user: { id: "player-1" } } });
      const { updateSession } = await import("@/lib/supabase/proxy-session");

      const response = await updateSession(requestFor(path));

      expect(response.status).toBe(307);
      expect(new URL(response.headers.get("location")!).pathname).toBe("/home");
    },
  );

  it("ignores a `next` query parameter: a signed-in /login visit always lands on /home", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "player-1" } } });
    const { updateSession } = await import("@/lib/supabase/proxy-session");

    const response = await updateSession(requestFor("/login", "?next=https://example.com"));

    const location = new URL(response.headers.get("location")!);
    expect(location.pathname).toBe("/home");
    expect(location.search).toBe("");
  });

  it("does not redirect a signed-in visitor to a protected route", async () => {
    getUser.mockResolvedValueOnce({ data: { user: { id: "player-1" } } });
    const { updateSession } = await import("@/lib/supabase/proxy-session");

    const response = await updateSession(requestFor("/home"));

    expect(response.status).not.toBe(307);
    expect(response.headers.get("location")).toBeNull();
  });

  it("does not redirect a signed-out visitor to a public route", async () => {
    getUser.mockResolvedValueOnce({ data: { user: null } });
    const { updateSession } = await import("@/lib/supabase/proxy-session");

    const response = await updateSession(requestFor("/"));

    expect(response.status).not.toBe(307);
    expect(response.headers.get("location")).toBeNull();
  });
});
