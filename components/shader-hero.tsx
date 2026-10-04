"use client";
import { useEffect, useRef } from "react";

export default function ShaderHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    let frame = 0; let running = false; let start = performance.now();
    const resize = () => { const ratio = Math.min(window.devicePixelRatio || 1, 1.5); canvas.width = window.innerWidth * ratio; canvas.height = canvas.offsetHeight * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0); };
    const draw = (time: number) => { if (!running) return; const width = canvas.offsetWidth; const height = canvas.offsetHeight; const progress = (time - start) / 10000; const gradient = context.createLinearGradient(0, 0, width, height); gradient.addColorStop(0, "#17223b"); gradient.addColorStop(0.48, "#243b80"); gradient.addColorStop(1, "#087f8c"); context.fillStyle = gradient; context.fillRect(0, 0, width, height); const glow = context.createRadialGradient(width * (0.72 + Math.sin(progress) * 0.04), height * 0.22, 0, width * 0.72, height * 0.22, width * 0.42); glow.addColorStop(0, "rgba(241,163,60,.42)"); glow.addColorStop(1, "rgba(241,163,60,0)"); context.fillStyle = glow; context.fillRect(0, 0, width, height); frame = requestAnimationFrame(draw); };
    const observer = new IntersectionObserver(([entry]) => { running = entry.isIntersecting && !document.hidden; if (running) { start = performance.now(); frame = requestAnimationFrame(draw); } else cancelAnimationFrame(frame); }, { threshold: 0.05 });
    const visibility = () => { running = !document.hidden; if (running) frame = requestAnimationFrame(draw); else cancelAnimationFrame(frame); };
    resize(); observer.observe(canvas); document.addEventListener("visibilitychange", visibility); window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); observer.disconnect(); document.removeEventListener("visibilitychange", visibility); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_75%_25%,#087f8c_0%,transparent_34%),linear-gradient(120deg,#17223b,#243b80_55%,#087f8c)]" />;
}
