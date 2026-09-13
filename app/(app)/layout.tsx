import { TabBar } from "@/components/TabBar";

/**
 * D-45: the shared shell for every signed-in route (`/home`, `/play`,
 * `/leaderboard`, `/profile`, `/tutorial`) — a route group, so it adds no
 * segment to the URL. Session protection itself lives in proxy.ts (req
 * 10); this layout only supplies the tab bar every one of these routes
 * shows.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-bg-base">
      <div className="flex flex-1 flex-col">{children}</div>
      <TabBar />
    </div>
  );
}
