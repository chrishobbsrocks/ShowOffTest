import { describe, expect, it } from "vitest";
import { formatShowingOffSince } from "@/lib/format-date";

describe("formatShowingOffSince", () => {
  it("formats as MMM D, YYYY (req 12)", () => {
    expect(formatShowingOffSince("2026-04-01T00:00:00Z")).toBe("Apr 1, 2026");
  });

  it("uses UTC, not the local timezone, so a late-UTC timestamp doesn't shift a day back", () => {
    expect(formatShowingOffSince("2026-04-01T23:30:00Z")).toBe("Apr 1, 2026");
  });

  it("does not zero-pad the day", () => {
    expect(formatShowingOffSince("2026-01-05T12:00:00Z")).toBe("Jan 5, 2026");
  });
});
