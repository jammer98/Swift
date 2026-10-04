import "./globals.css";
import { AuthProvider } from "@/components/auth";
import { Navbar } from "@/components/navbar";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import { cn } from "@/lib/utils";

const headingFont = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-heading" });
const bodyFont = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = { title: "Job Board", description: "Find your next opportunity" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" className={cn(headingFont.variable, bodyFont.variable)}><body><AuthProvider><Navbar /><main>{children}</main></AuthProvider></body></html>;
}
