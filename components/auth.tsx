"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { setUnauthorizedHandler } from "@/lib/api";
import type { User } from "@/lib/types";

type AuthContextType = { user: User | null; token: string | null; loading: boolean; signIn: (user: User, token: string) => void; signOut: () => void };
const AuthContext = createContext<AuthContextType | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [token, setToken] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  useEffect(() => { const savedUser = localStorage.getItem("jobboard_user"); const savedToken = localStorage.getItem("jobboard_token"); if (savedUser && savedToken) { setUser(JSON.parse(savedUser)); setToken(savedToken); } setLoading(false); }, []);
  useEffect(() => { setUnauthorizedHandler(() => { localStorage.removeItem("jobboard_user"); localStorage.removeItem("jobboard_token"); setUser(null); setToken(null); window.location.href = "/login"; }); }, []);
  const signIn = (nextUser: User, nextToken: string) => { localStorage.setItem("jobboard_user", JSON.stringify(nextUser)); localStorage.setItem("jobboard_token", nextToken); setUser(nextUser); setToken(nextToken); };
  const signOut = () => { localStorage.removeItem("jobboard_user"); localStorage.removeItem("jobboard_token"); setUser(null); setToken(null); };
  return <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be used inside AuthProvider"); return value; }
