import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '../lib/api';
import { qk } from '../lib/queryClient';
import type {
  Application,
  Call,
  Category,
  Feedback,
  NvoAnalytics,
  NvoStats,
  Paginated,
  PlatformStats,
  PublicNvo,
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
