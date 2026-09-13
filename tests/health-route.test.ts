import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Sprint 1, req 10 / QA1 acceptance criterion 10: the success body is
 * exactly {"ok":true,"database":true}, and — the branch a live test alone
 * can't reach on demand — the failure body is exactly
 * {"ok":false,"database":false}, with nothing else (no error text, keys,
 * URLs or stack traces) on either path.
 *
 * Sprint 2, req 16 / D-62 / acceptance criterion 17: the route now uses
 * lib/supabase/anon (no session, no cookies) instead of the cookie-scoped
 * lib/supabase/server client — proven two ways below: the route imports
 * and calls the anon client's constructor, never the cookie-scoped one's;
 * and a signed-in caller's session cookie is present in the request
 * context yet is never read (next/headers' `cookies()` is never called),
 * so the response is identical to a signed-out caller's.
 */

const rpc = vi.fn();
const createAnonClientMock = vi.fn(() => ({ rpc }));
const createServerClientMock = vi.fn(async () => ({ rpc: vi.fn() }));
const cookiesMock = vi.fn();

vi.mock("@/lib/supabase/anon", () => ({
  createAnonClient: createAnonClientMock,
}));

// The cookie-scoped client must never even be constructed by this route —
// if it were, that alone would mean the route is capable of reading the
// caller's session, which D-62 forbids.
vi.mock("@/lib/supabase/server", () => ({
  createClient: createServerClientMock,
}));

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

// Route Handlers log failures server-side (NFR-7) without echoing details
// back to the caller; silence that expected console.error noise in the
// failure-path tests below rather than letting it clutter test output.
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

afterEach(() => {
  rpc.mockReset();
  createAnonClientMock.mockClear();
  createServerClientMock.mockClear();
  cookiesMock.mockClear();
  consoleErrorSpy.mockClear();
});

describe("GET /api/health", () => {
  it("returns 200 and exactly {\"ok\":true,\"database\":true} when health_check() succeeds", async () => {
    rpc.mockResolvedValueOnce({ data: true, error: null });
    const { GET } = await import("@/app/api/health/route");

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, database: true });
    expect(Object.keys(body).sort()).toEqual(["database", "ok"]);
    expect(rpc).toHaveBeenCalledWith("health_check");
  });

  it("returns a non-200 and exactly {\"ok\":false,\"database\":false} when health_check() errors", async () => {
    rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "relation does not exist", code: "42P01" },
    });
    const { GET } = await import("@/app/api/health/route");

    const response = await GET();
    const body = await response.json();

    expect(response.status).not.toBe(200);
    expect(body).toEqual({ ok: false, database: false });
    expect(JSON.stringify(body)).not.toMatch(/42P01|relation does not exist/);
  });

  it("returns a non-200 and exactly {\"ok\":false,\"database\":false} when health_check() returns an unexpected value", async () => {
    rpc.mockResolvedValueOnce({ data: false, error: null });
    const { GET } = await import("@/app/api/health/route");

    const response = await GET();
    const body = await response.json();

    expect(response.status).not.toBe(200);
    expect(body).toEqual({ ok: false, database: false });
  });

  it("returns a non-200 and exactly {\"ok\":false,\"database\":false} when the client throws", async () => {
    createAnonClientMock.mockImplementationOnce(() => {
      throw new Error("ECONNREFUSED 127.0.0.1:54321 — connection details leak test");
    });
    const { GET } = await import("@/app/api/health/route");

    const response = await GET();
    const text = await response.text();

    expect(response.status).not.toBe(200);
    expect(JSON.parse(text)).toEqual({ ok: false, database: false });
    expect(text).not.toMatch(/ECONNREFUSED|54321/);
  });

  it("uses the no-session anon client, never the cookie-scoped server client", async () => {
    rpc.mockResolvedValueOnce({ data: true, error: null });
    const { GET } = await import("@/app/api/health/route");

    await GET();

    expect(createAnonClientMock).toHaveBeenCalledTimes(1);
    expect(createServerClientMock).not.toHaveBeenCalled();
  });

  it("a signed-in caller (session cookie present in the request context) gets the identical response, and the route never reads cookies at all", async () => {
    cookiesMock.mockResolvedValue({
      getAll: () => [{ name: "sb-access-token", value: "signed-in-session-token" }],
      get: () => ({ name: "sb-access-token", value: "signed-in-session-token" }),
    });
    rpc.mockResolvedValueOnce({ data: true, error: null });
    const { GET } = await import("@/app/api/health/route");

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ ok: true, database: true });
    // The whole point of D-62: this route must not even call cookies(),
    // signed-in session or not.
    expect(cookiesMock).not.toHaveBeenCalled();
  });
});
