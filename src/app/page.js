"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BentoGrid from "@/components/BentoGrid";
import { Download, Terminal, Menu, X } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleNavClick = (tab) => {
    if (isMobile) {
      // close menu first
      setMobileMenuOpen(false);
      // then scroll after animation finishes
      setTimeout(() => {
        const element = document.getElementById(tab.toLowerCase());
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    } else {
      // on desktop, flash tooltip
      setActiveTab(tab);
      setTimeout(() => setActiveTab(null), 2500);
    }
  };

  const navItems = ["ABOUT", "CONTACT", "PROJECTS", "SOCIALS"];

  return (
    <main className="min-h-screen bg-[#101010] font-sans selection:bg-emerald-500/30 flex flex-col">
      
      {/* bg noise texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* navbar */}
      <nav className="w-full max-w-[1100px] mx-auto relative flex items-center justify-between px-4 pt-4 sm:pt-6 pb-2 z-20">
        {/* logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Terminal size={13} className="text-emerald-400" />
          </div>
          <h1 className="text-white text-xl font-semibold tracking-tight">
            Ubaid<span className="text-emerald-400">.</span>
          </h1>
        </div>

        {/* desktop nav */}
        <div className="hidden sm:flex items-center gap-1 bg-white/[0.04] border border-white/[0.07] rounded-2xl p-1 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => handleNavClick(item)}
              className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all font-semibold uppercase tracking-wider"
            >
              {item}
            </button>
          ))}
        </div>

        {/* desktop cv btn */}
        <a
          href="/Ubaid_Raza_Dar_CV.pdf"
          download="Ubaid_Raza_Dar_CV.pdf"
          className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl transition-all font-semibold text-sm active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_28px_rgba(16,185,129,0.4)]"
        >
          <Download size={15} />
          <span>Download CV</span>
        </a>

        {/* mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden text-gray-400 hover:text-white p-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[60px] z-50 sm:hidden bg-[#111113] border-b border-white/[0.05] p-4"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className="text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all font-semibold uppercase tracking-wider"
                >
                  {item}
                </button>
              ))}
              <a
                href="/Ubaid_Raza_Dar_CV.pdf"
                download="Ubaid_Raza_Dar_CV.pdf"
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl transition-all font-semibold mt-2"
              >
                <Download size={18} />
                <span>Download CV</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* bento grid */}
      <div className="flex-1 flex items-start justify-center px-3 sm:px-4 md:px-0 py-2 sm:py-3 relative z-30">
        <BentoGrid activeTab={activeTab} isMobile={isMobile} />
      </div>

      {/* footer */}
      <footer className="w-full max-w-[1100px] mx-auto px-3 sm:px-4 md:px-0 py-4 sm:py-5 flex items-center justify-center border-t border-white/[0.05] relative z-10">
        <p className="text-gray-700 text-[10px] sm:text-[11px]">
          © {new Date().getFullYear()} Ubaid Raza Dar
        </p>
      </footer>
    </main>
  );
}