import type { JobListItem } from "./types";
export const dateIN = (value: string) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(value));
export const postedRelative = (value: string) => { const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86400000)); return days === 0 ? "Posted today" : days === 1 ? "Posted yesterday" : `Posted ${days} days ago`; };
export const salary = (min: number | null, max: number | null) => {
  const lpa = (n: number) => n >= 100000 ? `${n / 100000 % 1 ? (n / 100000).toFixed(1) : n / 100000}` : new Intl.NumberFormat("en-IN").format(n);
  if (min != null && max != null) return `₹${lpa(min)} - ${lpa(max)}${min >= 100000 ? " LPA" : ""}`;
  if (min != null) return `₹${lpa(min)}${min >= 100000 ? " LPA+" : "+"}`;
  if (max != null) return `Up to ₹${lpa(max)}${max >= 100000 ? " LPA" : ""}`;
  return "Salary not disclosed";
};
export const locations = ["Bengaluru", "Hyderabad", "Pune", "Mumbai", "Delhi NCR", "Gurugram", "Noida", "Chennai", "Kolkata", "Ahmedabad", "Remote", "Hybrid"];
export function JobCard({ job }: { job: JobListItem }) { return <a href={`/jobs/${job.id}`} className="card block transition hover:-translate-y-0.5 hover:border-teal-400"><div className="flex justify-between gap-3"><h2 className="text-lg font-semibold text-indigo-950">{job.title}</h2><span className="shrink-0 text-right text-xs text-slate-500">{postedRelative(job.created_at)}</span></div><p className="mt-1 text-indigo-700">{job.company_name}</p><p className="mt-3 text-sm text-slate-600">{job.location || "Location not specified"} · {job.employment_type || "Not specified"}</p><p className="mt-2 text-sm font-medium">{salary(job.salary_min, job.salary_max)}</p></a>; }
