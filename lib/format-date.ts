/**
 * Req 12: "Showing off since" + `MMM D, YYYY` (e.g. `Apr 1, 2026`), from
 * the profile's creation time in UTC — UTC specifically so the date never
 * shifts a day depending on the viewer's browser timezone.
 */
export function formatShowingOffSince(createdAtIso: string): string {
  const date = new Date(createdAtIso);
  const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" });
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}
