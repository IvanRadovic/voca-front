import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '../lib/api';
import { qk } from '../lib/queryClient';
import type {
  Application,
  Call,
  Category,
  Certificate,
  Feedback,
  Gamification,
  LeaderboardEntry,
  Mentor,
  NvoAnalytics,
  NvoStats,
  Paginated,
  PlatformStats,
  Post,
  PublicNvo,
  Story,
} from '../types';

const get = async <T>(url: string, params?: Record<string, unknown>): Promise<T> => {
  const { data } = await api.get<T>(url, { params });
  return data;
};

export function useCategories() {
  return useQuery({
    queryKey: qk.categories,
    queryFn: () => get<{ data: Category[] }>('/categories'),
    staleTime: 30 * 60_000, // categories rarely change
    select: (res) => res.data,
  });
}

export function usePlatformStats() {
  return useQuery({ queryKey: qk.stats, queryFn: () => get<PlatformStats>('/stats') });
}

export function useCalls(params: Record<string, unknown>) {
  return useQuery({
    queryKey: qk.calls(params),
    queryFn: () => get<Paginated<Call>>('/calls', params),
    placeholderData: keepPreviousData, // smooth pagination / filtering
  });
}

export function useCall(id: string | number | undefined) {
  return useQuery({
    queryKey: qk.call(id ?? ''),
    queryFn: () => get<{ data: Call }>(`/calls/${id}`),
    enabled: !!id,
    select: (res) => res.data,
  });
}

export function useSimilarCalls(id: string | number | undefined) {
  return useQuery({
    queryKey: qk.similar(id ?? ''),
    queryFn: () => get<{ data: Call[] }>(`/calls/${id}/similar`),
    enabled: !!id,
    select: (res) => res.data,
  });
}

export function useCallFeedbacks(id: string | number | undefined) {
  return useQuery({
    queryKey: qk.feedbacks(id ?? ''),
    queryFn: () => get<{ data: Feedback[] }>(`/calls/${id}/feedbacks`),
    enabled: !!id,
    select: (res) => res.data,
  });
}

export function useFeed(enabled: boolean) {
  return useQuery({
    queryKey: qk.feed,
    queryFn: () => get<Paginated<Call>>('/feed', { per_page: 8 }),
    enabled,
    select: (res) => res.data,
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: qk.myApplications,
    queryFn: () => get<Paginated<Application>>('/my/applications'),
    select: (res) => res.data,
  });
}

export function useMySaved() {
  return useQuery({
    queryKey: qk.mySaved,
    queryFn: () => get<Paginated<Call>>('/my/saved'),
    select: (res) => res.data,
  });
}

export function useMyFeedbacks() {
  return useQuery({
    queryKey: qk.myFeedbacks,
    queryFn: () => get<{ data: Feedback[] }>('/my/feedbacks'),
    select: (res) => res.data,
  });
}

export function useNvoStats() {
  return useQuery({ queryKey: qk.nvoStats, queryFn: () => get<NvoStats>('/nvo/stats') });
}

export function useNvoCalls() {
  return useQuery({
    queryKey: qk.nvoCalls,
    queryFn: () => get<Paginated<Call>>('/nvo/calls'),
    select: (res) => res.data,
  });
}

export function useApplicants(
  callId: string | number | undefined,
  params: Record<string, unknown> = {},
) {
  return useQuery({
    queryKey: [...qk.applicants(callId ?? ''), params],
    queryFn: () => get<Paginated<Application>>(`/calls/${callId}/applicants`, params),
    enabled: !!callId,
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });
}

export function useNvoAnalytics(period: number) {
  return useQuery({
    queryKey: qk.nvoAnalytics(period),
    queryFn: () => get<NvoAnalytics>('/nvo/analytics', { period }),
    placeholderData: keepPreviousData,
  });
}

export function usePublicNvo(id: string | number | undefined) {
  return useQuery({
    queryKey: qk.publicNvo(id ?? ''),
    queryFn: () => get<PublicNvo>(`/nvos/${id}`),
    enabled: !!id,
  });
}

export function useMyGamification() {
  return useQuery({
    queryKey: qk.gamification,
    queryFn: () => get<Gamification>('/me/gamification'),
  });
}

export function useLeaderboard(city: string) {
  return useQuery({
    queryKey: qk.leaderboard(city),
    queryFn: () => get<{ data: LeaderboardEntry[] }>('/leaderboard', { city: city || undefined }),
    select: (res) => res.data,
  });
}

export function useCallStories(id: string | number | undefined) {
  return useQuery({
    queryKey: qk.callStories(id ?? ''),
    queryFn: () => get<{ data: Story[] }>(`/calls/${id}/stories`),
    enabled: !!id,
    select: (res) => res.data,
  });
}

export function useRecentStories() {
  return useQuery({
    queryKey: qk.recentStories,
    queryFn: () => get<{ data: Story[] }>('/stories/recent'),
    select: (res) => res.data,
  });
}

export function usePosts(params: Record<string, unknown>) {
  return useQuery({
    queryKey: qk.posts(params),
    queryFn: () => get<Paginated<Post>>('/posts', params),
    placeholderData: keepPreviousData,
  });
}

export function usePost(slug: string | undefined) {
  return useQuery({
    queryKey: qk.post(slug ?? ''),
    queryFn: () => get<{ data: Post }>(`/posts/${slug}`),
    enabled: !!slug,
    retry: false,
    select: (res) => res.data,
  });
}

export function useMyPosts() {
  return useQuery({
    queryKey: qk.myPosts,
    queryFn: () => get<{ data: Post[] }>('/my/posts'),
    select: (res) => res.data,
  });
}

export function useMentors(search: string) {
  return useQuery({
    queryKey: qk.mentors(search),
    queryFn: () => get<{ data: Mentor[] }>('/mentors', { search: search || undefined }),
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });
}

export function useMentor(id: string | undefined) {
  return useQuery({
    queryKey: qk.mentor(id ?? ''),
    queryFn: () => get<{ data: Mentor }>(`/mentors/${id}`),
    enabled: !!id,
    retry: false,
    select: (res) => res.data,
  });
}

export function useMyCertificates() {
  return useQuery({
    queryKey: qk.myCertificates,
    queryFn: () => get<{ data: Certificate[] }>('/my/certificates'),
    select: (res) => res.data,
  });
}

export function useCertificate(code: string | undefined) {
  return useQuery({
    queryKey: qk.certificate(code ?? ''),
    queryFn: () => get<{ data: Certificate }>(`/certificates/${code}`),
    enabled: !!code,
    retry: false,
    select: (res) => res.data,
  });
}
