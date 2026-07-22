import { api } from "./api";
import {
  InstitutionalBroadcast,
  AdminAnalytics,
} from "@/src/types/broadcast.types";
export const broadcastService = {
  list: () => api<InstitutionalBroadcast[]>("/broadcasts"),
  detail: (id: string) => api<InstitutionalBroadcast>(`/broadcasts/${id}`),
  count: (input: Record<string, unknown>) =>
    api<{ count: number }>("/broadcasts/audience-count", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  create: (input: Record<string, unknown>) =>
    api<InstitutionalBroadcast>("/broadcasts", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  update: (id: string, input: Record<string, unknown>) =>
    api<InstitutionalBroadcast>(`/broadcasts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  publish: (id: string) =>
    api<InstitutionalBroadcast>(`/broadcasts/${id}/publish`, {
      method: "POST",
    }),
  remove: (id: string) => api(`/broadcasts/${id}`, { method: "DELETE" }),
  read: (id: string) => api(`/broadcasts/${id}/read`, { method: "POST" }),
  dismiss: (id: string) =>
    api(`/broadcasts/${id}/dismiss-alert`, { method: "POST" }),
  analytics: () => api<AdminAnalytics>("/admin/analytics"),
};
