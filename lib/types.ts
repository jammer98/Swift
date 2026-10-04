export type Role = "candidate" | "employer" | "admin";
export type EmploymentType = "full-time" | "part-time" | "contract" | "internship";
export type JobStatus = "open" | "closed";
export type ApplicationStatus = "pending" | "reviewed" | "accepted" | "rejected";

export type User = { id: number; name: string; email: string; role: Role; created_at: string };
export type Company = { id: number; employer_id: number; name: string; description: string | null; website: string | null; created_at: string };
export type Job = {
  id: number; company_id: number; title: string; description: string; location: string | null;
  employment_type: string | null; salary_min: number | null; salary_max: number | null;
  status: JobStatus; created_at: string; company_name?: string; company_website?: string | null;
};
export type JobListItem = Pick<Job, "id" | "title" | "location" | "employment_type" | "salary_min" | "salary_max" | "created_at" | "company_id"> & { company_name: string };
export type Application = { id: number; status: ApplicationStatus; resume_url: string; applied_at: string; job_id: number; job_title: string; company_name: string };
export type Applicant = { id: number; status: ApplicationStatus; resume_url: string; cover_letter: string | null; applied_at: string; candidate_id: number; candidate_name: string; candidate_email: string };
export type ApiResponse<T> = T;