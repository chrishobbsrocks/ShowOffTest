import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * Sprint 1, req 10 / QA1 acceptance criterion 10: the success body is
 * exactly {"ok":true,"database":true}, and — the branch a live test alone
 * can't reach on demand — the failure body is exactly
 * {"ok":false,"database":false}, with nothing else (no error text, keys,
 * URLs or stack traces) on either path.
 */

const rpc = vi.fn();
const createClientMock = vi.fn(async () => ({ rpc }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: createClientMock,
}));

// Route Handlers log failures server-side (NFR-7) without echoing details
// back to the caller; silence that expected console.error noise in the
// failure-path tests below rather than letting it clutter test output.
const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

afterEach(() => {
  rpc.mockReset();
  createClientMock.mockClear();
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
    createClientMock.mockImplementationOnce(async () => {
      throw new Error("ECONNREFUSED 127.0.0.1:54321 — connection details leak test");
    });
    const { GET } = await import("@/app/api/health/route");

    const response = await GET();
    const text = await response.text();

    expect(response.status).not.toBe(200);
    expect(JSON.parse(text)).toEqual({ ok: false, database: false });
    expect(text).not.toMatch(/ECONNREFUSED|54321/);
  });
});
