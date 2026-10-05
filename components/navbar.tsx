"use client";
import Link from "next/link";
import { useAuth } from "./auth";
export function Navbar() {
  const { user, loading, signOut } = useAuth();
  return <header className="border-b border-slate-200 bg-white/90 backdrop-blur"><nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><div className="flex items-center gap-8"><Link href="/" className="font-heading text-xl font-bold tracking-tight text-indigo-950">Swift</Link><Link href="/jobs" className="hidden text-sm font-medium text-slate-600 hover:text-indigo-700 sm:block">Browse jobs</Link></div>{!loading && <div className="flex items-center gap-4 text-sm">{user?.role === "candidate" && <Link href="/my-applications" className="hidden text-slate-600 sm:block">My applications</Link>}{user?.role === "employer" && <><Link href="/employer/jobs" className="hidden text-slate-600 sm:block">My jobs</Link><Link href="/employer/company" className="hidden text-slate-600 sm:block">Company</Link></>}{user ? <button onClick={signOut} className="btn-secondary">Sign out</button> : <><Link href="/login">Log in</Link><Link href="/register" className="btn-primary">Register</Link></>}</div>}</nav></header>;
}
