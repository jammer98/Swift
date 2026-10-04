import type { Applicant, ApplicationStatus, Company, EmploymentType, Job, JobListItem, Role, User } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
let unauthorizedHandler: (() => void) | undefined;
export function setUnauthorizedHandler(handler: () => void) { unauthorizedHandler = handler; }

async function request<T>(path: string, options: RequestInit = {}, token?: string, skipUnauthorized = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const body = await response.json().catch(() => ({ error: "Something went wrong" })) as { error?: string };
    if (response.status === 401 && token && !skipUnauthorized) unauthorizedHandler?.();
    throw new Error(body.error || "Something went wrong");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
const json = (method: string, body: unknown) => ({ method, body: JSON.stringify(body) });
export const api = {
  login: (body: { email: string; password: string }) => request<{ user: User; token: string }>("/api/auth/login", { ...json("POST", body) }, undefined, true),
  register: (body: { name: string; email: string; password: string; role: "candidate" | "employer" }) => request<{ user: User; token: string }>("/api/auth/register", { ...json("POST", body) }, undefined, true),
  me: (token: string) => request<{ user: Pick<User, "id" | "role"> }>("/api/auth/me", {}, token),
  jobs: (params: { q?: string; location?: string; employmentType?: string; page?: number; limit?: number }) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => { if (value !== "" && value !== undefined) query.set(key, String(value)); });
    return request<{ jobs: JobListItem[]; page: number; limit: number; total: number; totalPages: number }>(`/api/jobs?${query}`);
  },
  job: (id: string) => request<{ job: Job }>(`/api/jobs/${id}`),
  mineJobs: (token: string) => request<{ jobs: Job[] }>("/api/jobs/mine", {}, token),
  createJob: (token: string, body: { title: string; description: string; location?: string; employmentType?: EmploymentType; salaryMin?: number; salaryMax?: number }) => request<{ job: Job }>("/api/jobs", { ...json("POST", body) }, token),
  updateJob: (token: string, id: string, body: Record<string, unknown>) => request<{ job: Job }>(`/api/jobs/${id}`, { ...json("PATCH", body) }, token),
  deleteJob: (token: string, id: number) => request<void>(`/api/jobs/${id}`, { method: "DELETE" }, token),
  company: (token: string) => request<{ company: Company }>("/api/companies/me", {}, token),
  createCompany: (token: string, body: { name: string; description?: string; website?: string }) => request<{ company: Company }>("/api/companies", { ...json("POST", body) }, token),
  updateCompany: (token: string, body: Record<string, string>) => request<{ company: Company }>("/api/companies/me", { ...json("PATCH", body) }, token),
  apply: (token: string, id: string, file: File, coverLetter: string) => { const form = new FormData(); form.append("resume", file); if (coverLetter) form.append("coverLetter", coverLetter); return request<{ application: unknown }>(`/api/jobs/${id}/apply`, { method: "POST", body: form }, token); },
  applications: (token: string) => request<{ applications: import("./types").Application[] }>("/api/applications/mine", {}, token),
  applicants: (token: string, id: string) => request<{ applications: Applicant[] }>(`/api/jobs/${id}/applications`, {}, token),
  updateApplication: (token: string, id: number, status: ApplicationStatus) => request<{ application: unknown }>(`/api/applications/${id}/status`, { ...json("PATCH", { status }) }, token),
};