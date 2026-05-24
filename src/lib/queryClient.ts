import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000, // 1 min - avoids refetch storms while staying fresh
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Centralized query keys keep cache invalidation consistent and typo-proof.
export const qk = {
  user: ["user"] as const,
  categories: ["categories"] as const,
  stats: ["stats"] as const,
  calls: (params: Record<string, unknown>) => ["calls", params] as const,
  call: (id: string | number) => ["call", String(id)] as const,
  similar: (id: string | number) => ["call", String(id), "similar"] as const,
  feedbacks: (id: string | number) =>
    ["call", String(id), "feedbacks"] as const,
  feed: ["feed"] as const,
  myApplications: ["my", "applications"] as const,
  mySaved: ["my", "saved"] as const,
  myFeedbacks: ["my", "feedbacks"] as const,
  nvoStats: ["nvo", "stats"] as const,
  nvoAnalytics: (period: number) => ["nvo", "analytics", period] as const,
  nvoCalls: ["nvo", "calls"] as const,
  applicants: (id: string | number) =>
    ["call", String(id), "applicants"] as const,
  publicNvo: (id: string | number) => ["nvos", String(id)] as const,
  myCertificates: ["my", "certificates"] as const,
  certificate: (code: string) => ["certificate", code] as const,
  gamification: ["me", "gamification"] as const,
  leaderboard: (city: string) => ["leaderboard", city] as const,
  callStories: (id: string | number) => ["call", String(id), "stories"] as const,
  recentStories: ["stories", "recent"] as const,
  posts: (params: Record<string, unknown>) => ["posts", params] as const,
  post: (slug: string) => ["post", slug] as const,
  myPosts: ["my", "posts"] as const,
};
