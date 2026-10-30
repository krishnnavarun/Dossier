import axios from 'axios';
import type { CaseHistoryItem, Difficulty, Mystery, Result } from './types';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api', withCredentials: true, timeout: 70000 });
export const casesApi = {
  sample: async () => (await api.get<{ data: Mystery }>('/cases/sample')).data.data,
  get: async (id: string) => (await api.get<{ data: Mystery }>(`/cases/${id}`)).data.data,
  history: async () => (await api.get<{ data: CaseHistoryItem[] }>('/cases/history')).data.data,
  create: async (scenario: string, difficulty: Difficulty) => (await api.post<{ data: { caseId:string; status:'generating'; statusUrl:string } }>('/cases', { scenario, difficulty })).data.data,
  status: async (id:string) => (await api.get<{data:{caseId:string;status:'queued'|'generating'|'ready'|'failed';stage:string;retryable:boolean;error:{code:string;message:string}|null}}>(`/cases/${id}/status`)).data.data,
  retryGeneration: async (id:string) => (await api.post<{data:{caseId:string;status:'generating';statusUrl:string}}>(`/cases/${id}/retry-generation`)).data.data,
  discover: async (id: string, clueId: string) => (await api.post<{ data: Mystery }>(`/cases/${id}/clues/${clueId}/discover`)).data.data,
  hint: async (id: string) => (await api.post<{ data: { hint: string; mystery: Mystery } }>(`/cases/${id}/hints`)).data.data,
  accuse: async (id: string, suspectId: string) => (await api.post<{ data: Result }>(`/cases/${id}/accuse`, { suspectId })).data.data,
  result: async (id: string) => (await api.get<{ data: Result }>(`/cases/${id}/result`)).data.data,
};
export function errorMessage(error: unknown) {
  if (axios.isAxiosError(error)) return error.response?.data?.error?.message ?? 'We couldn’t reach the case desk. Check your connection and try again.';
  return 'Something went wrong. Please try again.';
}
