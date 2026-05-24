import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { qk } from '../lib/queryClient';
import type { ApplicationStatus } from '../types';

/** Apply to a call (one click). */
export function useApply(callId: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (message?: string) => api.post(`/calls/${callId}/apply`, { message }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.call(callId) });
      qc.invalidateQueries({ queryKey: qk.myApplications });
    },
  });
}

/** Toggle wishlist; returns the new saved state. */
export function useToggleSave() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (callId: string | number) =>
      api.post<{ saved: boolean }>(`/calls/${callId}/save`).then((r) => r.data),
    onSuccess: (_data, callId) => {
      qc.invalidateQueries({ queryKey: qk.call(callId) });
      qc.invalidateQueries({ queryKey: qk.mySaved });
    },
  });
}

export function useSavePost(existingId?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) =>
      api.post(existingId ? `/posts/${existingId}` : '/posts', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      qc.invalidateQueries({ queryKey: qk.myPosts });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/posts/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      qc.invalidateQueries({ queryKey: qk.myPosts });
    },
  });
}

export function useShareStory(callId: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) =>
      api.post(`/calls/${callId}/stories`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.callStories(callId) });
      qc.invalidateQueries({ queryKey: qk.recentStories });
    },
  });
}

export function useLeaveFeedback(callId: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { rating: number; comment?: string }) =>
      api.post(`/calls/${callId}/feedbacks`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.feedbacks(callId) });
      qc.invalidateQueries({ queryKey: qk.myFeedbacks });
    },
  });
}

export function useSaveCall(existingId?: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) =>
      api.post(existingId ? `/calls/${existingId}` : '/calls', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.nvoCalls });
      qc.invalidateQueries({ queryKey: qk.nvoStats });
    },
  });
}

export function useDeleteCall() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (callId: number) => api.delete(`/calls/${callId}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.nvoCalls });
      qc.invalidateQueries({ queryKey: qk.nvoStats });
    },
  });
}

export function useUpdateApplicationStatus(callId: string | number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ApplicationStatus }) =>
      api.put(`/applications/${id}/status`, { status }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.applicants(callId) });
      qc.invalidateQueries({ queryKey: qk.nvoStats });
    },
  });
}

export function useAnnounce(callId: string | number) {
  return useMutation({
    mutationFn: (payload: { subject: string; body: string }) =>
      api.post<{ message: string }>(`/calls/${callId}/announce`, payload).then((r) => r.data),
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api.put('/profile', payload).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.user }),
  });
}

interface AiResult {
  text: string;
  source: 'ai' | 'template' | 'search';
  matches?: { id: number; title: string; type: string }[];
}

export function useCoverLetter() {
  return useMutation({
    mutationFn: (payload: { call_id: number; lang: string }) =>
      api.post<AiResult>('/ai/cover-letter', payload).then((r) => r.data),
  });
}

export function useGenerateCv() {
  return useMutation({
    mutationFn: (lang: string) => api.post<AiResult>('/ai/cv', { lang }).then((r) => r.data),
  });
}

export function useAiChat() {
  return useMutation({
    mutationFn: (payload: { message: string; lang: string }) =>
      api.post<AiResult>('/ai/assistant', payload).then((r) => r.data),
  });
}

export function useUpdateNvo() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => api.put('/profile/nvo', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.user }),
  });
}
