import { redirect } from "next/navigation";

/**
 * D-43 / req 11: the tutorial itself is sprint 11's build. Until then,
 * `/tutorial` redirects signed-in players straight to `/home` — session
 * protection (redirecting a signed-out visitor to /login instead) already
 * happened in proxy.ts before this page is reached.
 */
export default function TutorialPage() {
  redirect("/home");
}
