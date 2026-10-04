"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { JobCard, locations } from "@/lib/format";
import type { JobListItem } from "@/lib/types";

export default function JobsClient({
  initialQuery,
  initialLocation,
}: {
  initialQuery: string;
  initialLocation: string;
}) {
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [q, setQ] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [employmentType, setEmploymentType] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async (event?: FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await api.jobs({
        q,
        location,
        employmentType,
        page,
        limit: 10,
      });
      setJobs(result.jobs);
      setTotalPages(result.totalPages);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <section className="mx-auto min-h-[calc(100vh-72px)] max-w-6xl px-5 py-12">
      <div className="mb-10">
        <p className="text-sm font-medium text-teal-700">Open roles</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-indigo-950">
          Find your next opportunity
        </h1>
        <p className="mt-3 max-w-xl text-slate-600">
          Explore open roles from growing teams across India.
        </p>
      </div>
      <form
        onSubmit={load}
        className="mb-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[2fr_1fr_1fr_auto]"
      >
        <label className="sr-only" htmlFor="jobs-search">
          Search jobs
        </label>
        <input
          id="jobs-search"
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search jobs"
        />
        <div>
          <label className="sr-only" htmlFor="jobs-location">
            Location
          </label>
          <input
            id="jobs-location"
            list="locations"
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full"
          />
          <datalist id="locations">
            {locations.map(x => (
              <option key={x} value={x} />
            ))}
          </datalist>
        </div>
        <label className="sr-only" htmlFor="employment-type">
          Employment type
        </label>
        <select
          id="employment-type"
          value={employmentType}
          onChange={e => setEmploymentType(e.target.value)}
        >
          <option value="">All types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
        </select>
        <button className="btn-primary">Search</button>
      </form>
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      ) : error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          {error}
        </p>
      ) : jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-600">
          No jobs match these filters. Try a different city or clear the search.
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              className="btn-secondary"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn-secondary"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}
