"use client";

import { useState } from "react";
import BentoGrid from "@/components/BentoGrid";
import { Download, Terminal } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState(null);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setTimeout(() => setActiveTab(null), 2500);
  };

  const navItems = ["ABOUT", "CONTACT", "PROJECTS", "SOCIALS"];

  return (
    <main className="min-h-screen bg-[#101010] font-sans selection:bg-emerald-500/30 flex flex-col">
      
      {/* Subtle background grain */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* ── NAVBAR ── */}
      <nav className="w-full max-w-[1100px] mx-auto relative flex items-center px-4 md:px-0 pt-6 pb-2 z-10">
        {/* Logo — far left */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Terminal size={13} className="text-emerald-400" />
          </div>
          <h1 className="text-white text-xl font-semibold tracking-tight">
            Ubaid<span className="text-emerald-400">.</span>
          </h1>
        </div>

        {/* Nav items — absolutely centered */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="px-4 py-2 rounded-xl text-[11px] md:text-xs text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all font-semibold uppercase tracking-wider"
            >
              {item}
            </button>
          ))}
        </div>

        {/* CV button — far right */}
        <a
          href="/Ubaid_Raza_Dar_CV.pdf"
          download="Ubaid_Raza_Dar_CV.pdf"
          className="ml-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl transition-all font-semibold text-sm active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_28px_rgba(16,185,129,0.4)] shrink-0"
        >
          <Download size={15} />
          Download CV
        </a>
      </nav>

      {/* ── BENTO GRID ── */}
      <div className="flex-1 flex items-start justify-center px-4 md:px-0 py-3 relative z-10">
        <BentoGrid activeTab={activeTab} />
      </div>

      {/* ── FOOTER ── */}
      <footer className="w-full max-w-[1100px] mx-auto px-4 md:px-0 py-5 flex flex-col md:flex-row items-center justify-between gap-3 border-t border-white/[0.05] relative z-10">
        <p className="text-gray-700 text-[11px]">
          © {new Date().getFullYear()} Ubaid Raza Dar · Stack Fuse
        </p>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_#34d399]" />
          <p className="text-gray-700 text-[11px]">Open to freelance & internships · Based in Lahore, PK</p>
        </div>
        <p className="text-gray-700 text-[11px]">
          Built with Next.js · Framer Motion
        </p>
      </footer>
    </main>
  );
}