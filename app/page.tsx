"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { JobCard, locations, salary } from "@/lib/format";
import { useAuth } from "@/components/auth";
import type { JobListItem } from "@/lib/types";

const ShaderHero = dynamic(() => import("@/components/shader-hero"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,#087f8c_0%,transparent_34%),linear-gradient(120deg,#17223b,#243b80_55%,#087f8c)]" />,
});

const cities = ["Bengaluru", "Hyderabad", "Pune", "Mumbai", "Gurugram", "Noida", "Chennai", "Remote"];

export default function Home() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([api.jobs({ limit: 1 }), api.jobs({ limit: 6 })])
      .then(([count, latest]) => { setTotal(count.total); setJobs(latest.jobs); })
      .catch(() => { setTotal(null); setJobs([]); });
  }, []);

  const search = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (location.trim()) params.set("location", location.trim());
    window.location.href = `/jobs${params.toString() ? `?${params}` : ""}`;
  };

  return <div className="overflow-hidden">
    <section className="relative isolate min-h-[650px] text-white">
      <ShaderHero />
      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:pt-28">
        <div className="max-w-3xl">
          <p className="mb-6 text-sm font-medium text-sky-100">A clearer way to work in India</p>
          <h1 className="max-w-2xl text-5xl font-semibold leading-[1.03] tracking-tight sm:text-7xl">Find work that moves you forward.</h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-200">Search open roles from teams hiring across India, with the details you need to make your next move.</p>
          <form onSubmit={search} className="mt-10 grid max-w-3xl gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-md sm:grid-cols-[1.3fr_1fr_auto]">
            <label className="sr-only" htmlFor="hero-keyword">Job title or keyword</label>
            <input id="hero-keyword" value={q} onChange={e => setQ(e.target.value)} placeholder="Job title or keyword" className="border-white/20 bg-white text-slate-900 placeholder:text-slate-500" />
            <label className="sr-only" htmlFor="hero-location">Location</label>
            <input id="hero-location" value={location} onChange={e => setLocation(e.target.value)} placeholder="City or remote" className="border-white/20 bg-white text-slate-900 placeholder:text-slate-500" />
            <button className="rounded-lg bg-saffron px-6 py-3 font-semibold text-slate-950 hover:bg-amber-300">Search jobs</button>
          </form>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-200"><span className="text-slate-300">Popular:</span>{cities.map(city => <Link key={city} href={`/jobs?location=${encodeURIComponent(city)}`} className="underline-offset-4 hover:text-white hover:underline">{city}</Link>)}</div>
        </div>
        <Link href={user?.role === "employer" ? "/employer/jobs/new" : "/register"} className="mt-16 inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-medium hover:bg-white/10">Post a job <span aria-hidden="true">↗</span></Link>
      </div>
    </section>
    <div className="mx-auto max-w-7xl px-5">
      {total !== null && <p className="border-b border-slate-200 py-5 text-sm text-slate-600"><span className="font-semibold text-indigo-950">{total.toLocaleString("en-IN")}</span> open roles waiting for their next person</p>}
      <section className="py-20"><div className="flex items-end justify-between gap-4"><div><p className="text-sm font-medium text-teal-700">Fresh on the board</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-indigo-950">Latest jobs</h2></div><Link href="/jobs" className="text-sm font-medium text-indigo-700 hover:underline">View all jobs →</Link></div><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{jobs.length ? jobs.map(job => <JobCard key={job.id} job={job} />) : Array.from({ length: 6 }, (_, i) => <div key={i} className="h-44 animate-pulse rounded-xl bg-slate-200" />)}</div></section>
      <section className="border-t border-slate-200 py-20"><p className="text-sm font-medium text-teal-700">Start somewhere good</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-indigo-950">Browse by city</h2><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">{cities.map(city => <Link key={city} href={`/jobs?location=${encodeURIComponent(city)}`} className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-teal-400"><span className="block font-heading text-lg font-medium text-indigo-950 group-hover:text-teal-700">{city}</span></Link>)}</div></section>
      <section className="border-t border-slate-200 py-20"><p className="text-sm font-medium text-teal-700">A simple path</p><h2 className="mt-2 text-3xl font-semibold tracking-tight text-indigo-950">How it works</h2><div className="mt-8 grid gap-5 md:grid-cols-2"><div className="rounded-2xl bg-indigo-950 p-7 text-white"><h3 className="text-xl font-semibold">For candidates</h3><ol className="mt-6 space-y-5 text-slate-300">{["Search roles that fit your goals.", "Read the details and apply.", "Keep your next move moving."].map((step, i) => <li key={step} className="flex gap-4"><span className="font-heading text-saffron">0{i + 1}</span><span>{step}</span></li>)}</ol></div><div className="rounded-2xl border border-slate-200 p-7"><h3 className="text-xl font-semibold text-indigo-950">For employers</h3><ol className="mt-6 space-y-5 text-slate-600">{["Create your employer profile.", "Post a clear, useful role.", "Meet the people who fit."].map((step, i) => <li key={step} className="flex gap-4"><span className="font-heading text-teal-700">0{i + 1}</span><span>{step}</span></li>)}</ol></div></div></section>
      <section className="mb-20 rounded-2xl bg-saffron p-8 sm:p-12"><div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center"><div><h2 className="text-3xl font-semibold tracking-tight text-slate-950">Build your next team here.</h2><p className="mt-2 max-w-lg text-slate-700">Reach people who are ready to do meaningful work in India.</p></div><Link href={user?.role === "employer" ? "/employer/jobs/new" : "/register"} className="rounded-lg bg-indigo-950 px-5 py-3 font-medium text-white hover:bg-indigo-900">Post a job</Link></div></section>
      <footer className="flex flex-col justify-between gap-3 border-t border-slate-200 py-8 text-sm text-slate-500 sm:flex-row"><span className="font-heading font-semibold text-indigo-950">work/india</span><span>Find your next opportunity.</span></footer>
    </div>
  </div>;
}
