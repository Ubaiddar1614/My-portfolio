"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  ArrowUpRight, Github, Linkedin, Instagram,
  Database, Server, Code2, Briefcase, BookOpen
} from "lucide-react";
import ContactForm from "./ContactForm";

/* ─────────────────────────────────────────────
   Tooltip — rendered in a wrapper div that sits
   ABOVE the tile (no overflow-hidden parent)
───────────────────────────────────────────── */
const SassyTooltip = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -4, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 340, damping: 24 }}
        className="absolute -top-11 left-1/2 -translate-x-1/2 bg-[#8B5CF6] text-white text-[11px] font-bold py-2 px-4 rounded-xl shadow-2xl whitespace-nowrap z-[999] pointer-events-none"
      >
        👇 It's right here dumbass
        {/* arrow pointing DOWN */}
        <span className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 block w-3 h-3 bg-[#8B5CF6] rotate-45 rounded-sm" />
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── wrapper that gives each tile a tooltip-safe overflow context ─── */
const TooltipWrap = ({ show, children, className }) => (
  <div className={`relative ${className ?? ""}`}>
    <SassyTooltip show={show} />
    {children}
  </div>
);

/* ─── 3-D Tilt Card ─── */
const TiltCard = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), { stiffness: 280, damping: 28 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Scrolling Marquee ─── */
const Marquee = ({ items }) => (
  <div className="overflow-hidden whitespace-nowrap">
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="inline-flex gap-6"
    >
      {[...items, ...items].map((t, i) => (
        <span key={i} className="text-gray-600 text-[11px] font-semibold uppercase tracking-widest">
          {t} <span className="text-emerald-800 mx-1">✦</span>
        </span>
      ))}
    </motion.div>
  </div>
);

/* ════════════════════════════════════════════ */
export default function BentoGrid({ activeTab }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDropped, setIsDropped]         = useState(false);

  /* contact tile mouse tracking */
  const contactTileRef                        = useRef(null);
  const [mousePos, setMousePos]               = useState({ x: 0, y: 0 });
  const [isHoveringContact, setHoverContact]  = useState(false);

  const container = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
  };
  const tile = {
    hidden:  { opacity: 0, y: 38, scale: 0.96, filter: "blur(8px)" },
    visible: {
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 240, damping: 22, mass: 0.9 },
    },
  };

  const techStack = [
    { icon: <Code2    size={12} />, label: "Java"       },
    { icon: <Server   size={12} />, label: "Spring Boot" },
    { icon: <Database size={12} />, label: "MySQL"       },
    { icon: <Code2    size={12} />, label: "REST APIs"   },
    { icon: <Server   size={12} />, label: "Docker"      },
    { icon: <Code2    size={12} />, label: "Node.js"     },
  ];

  const workExp = [
    { role: "Co-Founder & Backend Dev", company: "Stack Fuse",           stack: ["Java","Spring Boot","MySQL"],  current: true  },
    { role: "Full Stack Intern",         company: "Division Public School", stack: ["ASP.NET","C#","HTML5"],       current: false },
  ];

  const aboutWords    = "Hi, I'm Ubaid a CS student, co-founder of Stack Fuse, and backend developer who builds real systems. I care about clean architecture, not just getting things to run.".split(" ");
  const marqueeItems  = ["Java","Spring Boot","MySQL","REST APIs","Docker","System Design","Backend Dev","Stack Fuse"];

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-2.5 w-full max-w-[1100px] mx-auto"
      >
        {/* ══ ROW 1 ══════════════════════════════════════════════════════ */}

        {/* 1 · HERO ── no tooltip needed */}
        <motion.div variants={tile}
          className="col-span-12 md:col-span-5 bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-7 relative overflow-hidden flex flex-col justify-between min-h-[260px]"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -right-20 w-72 h-72 bg-emerald-500 rounded-full blur-[90px] pointer-events-none"
          />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1.5">
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"
              />
              <span className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">Available</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-[9px] text-gray-500 uppercase tracking-wider">Now Playing</p>
                <p className="text-[11px] text-white font-medium">A Sky Full of Stars</p>
                <p className="text-[9px] text-gray-500">Coldplay</p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="relative w-11 h-11 rounded-full border border-white/10 overflow-hidden shadow-lg shrink-0"
              >
                <div className="absolute inset-0 bg-[#0a0a0a]" />
                <img src="/vinyl.jpg" alt="vinyl" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-[#1A1A1C] rounded-full border border-gray-700" />
                </div>
              </motion.div>
            </div>
          </div>

          <div className="relative z-10 mt-4">
            <p className="text-gray-500 text-[10px] font-semibold tracking-widest uppercase mb-2">Backend Dev · Lahore, PK</p>
            <h1 className="text-white text-[40px] md:text-[50px] font-semibold leading-[1.04] tracking-tight">
              Systems Over
              <br />
              <motion.span
                animate={{ color: ["#34d399", "#6ee7b7", "#34d399"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="italic font-light inline-block"
              >
                Surfaces.
              </motion.span>
            </h1>
            <p className="text-gray-500 text-sm mt-2 font-medium">— Beautifully Coded.</p>
          </div>

          <div className="relative z-10 mt-4 pt-3 border-t border-white/[0.05]">
            <Marquee items={marqueeItems} />
          </div>
        </motion.div>

        {/* 2 · PORTRAIT ── no tooltip */}
        <motion.div variants={tile}
          className="col-span-12 md:col-span-4 rounded-[28px] overflow-hidden relative min-h-[260px] bg-[#1A1A1C] group"
        >
          <motion.img
            src="/profile.jpg" alt="Ubaid Raza Dar"
            className="absolute inset-0 w-full h-full object-cover object-center z-0"
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent z-10 pointer-events-none" />
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-5 z-20"
          >
            <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase">Ubaid Raza Dar</p>
            <p className="text-white/75 text-sm">Backend Dev · Stack Fuse</p>
          </motion.div>
        </motion.div>

        {/* 3 · PROJECTS — TooltipWrap so tooltip is NOT clipped */}
        <TooltipWrap show={activeTab === "PROJECTS"} className="col-span-12 md:col-span-3">
          <motion.div variants={tile}
            className="bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-5 flex flex-col relative overflow-hidden h-full min-h-[260px]"
          >
            <p className="text-gray-500 text-[10px] tracking-widest uppercase mb-3">Projects</p>

            {/* centered message */}
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-2">
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
              >
                <span className="text-emerald-400 text-lg">⚒</span>
              </motion.div>
              <p className="text-gray-300 text-sm font-semibold leading-snug">
                Projects will be<br />live soon
              </p>
              <p className="text-gray-600 text-[11px]">Currently in the build.</p>
            </div>

            <motion.div
              initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
              className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-900/15 to-transparent pointer-events-none rounded-b-[28px]"
            />
          </motion.div>
        </TooltipWrap>

        {/* ══ ROW 2 ══════════════════════════════════════════════════════ */}

        {/* 4 · ABOUT — TooltipWrap */}
        <TooltipWrap show={activeTab === "ABOUT"} className="col-span-12 md:col-span-5">
          <motion.div variants={tile}
            className="relative rounded-[28px] overflow-hidden flex flex-col justify-between min-h-[200px]"
          >
            <div className="absolute inset-0 bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] overflow-hidden z-0">
              {isDropped && aboutWords.map((word, i) => {
                const rX = Math.random() * 80 + 10;
                const rY = Math.random() * 20 + 65;
                const rR = (Math.random() - 0.5) * 120;
                return (
                  <motion.span key={i}
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, left: `${rX}%`, top: `${rY}%`, rotate: rR }}
                    transition={{ type: "spring", bounce: 0.55, duration: 1.4, delay: i * 0.02 }}
                    className={`absolute text-[13px] pointer-events-none select-none ${
                      word.includes("Ubaid") || word.includes("Stack") || word.includes("Fuse")
                        ? "text-emerald-400 font-semibold" : "text-gray-600"
                    }`}
                  >{word}</motion.span>
                );
              })}
            </div>

            <div className="relative z-10 p-6 md:p-7 flex flex-col justify-between h-full gap-4">
              <p className="text-gray-700 text-[10px] tracking-[0.2em] uppercase font-mono">
                FRAMER ✦ TAILWIND ✦ SPRING BOOT ✦ MYSQL
              </p>
              {!isDropped && (
                <p className="text-gray-400 leading-relaxed text-sm md:text-[15px]">
                  <span
                    onClick={() => setIsDropped(true)}
                    className="cursor-pointer text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                  >Hi, I'm Ubaid</span>{" "}
                  — a CS student, co-founder of{" "}
                  <span className="text-white font-medium">Stack Fuse</span>, and backend developer who builds real systems. I care about clean architecture, not just getting things to run.
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {techStack.map((t, i) => (
                  <motion.span key={i}
                    whileHover={{ scale: 1.12, backgroundColor: "rgba(52,211,153,0.18)" }}
                    className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 cursor-default"
                  >
                    {t.icon} {t.label}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </TooltipWrap>

        {/* 5 · CONTACT — TooltipWrap + full rebuild of mouse tracking */}
        <TooltipWrap show={activeTab === "CONTACT"} className="col-span-12 md:col-span-4">
          <motion.div variants={tile}
            ref={contactTileRef}
            onMouseMove={(e) => {
              if (!contactTileRef.current) return;
              const r = contactTileRef.current.getBoundingClientRect();
              setMousePos({ x: e.clientX - r.left, y: e.clientY - r.top });
            }}
            onMouseEnter={() => setHoverContact(true)}
            onMouseLeave={() => setHoverContact(false)}
            onClick={() => setIsContactOpen(true)}
            className="relative rounded-[28px] overflow-hidden flex flex-col justify-between cursor-pointer min-h-[200px] group"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* background */}
            <div className="absolute inset-0 bg-emerald-600 group-hover:bg-emerald-700 transition-colors duration-300" />

            {/* ── emerald cursor ball ── lives inside overflow-hidden so stays clipped to tile */}
            <motion.div
              className="absolute w-40 h-40 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, #6ee7b7 0%, #34d399 40%, transparent 70%)",
                filter: "blur(30px)",
                top:  mousePos.y - 80,
                left: mousePos.x - 80,
              }}
              animate={{ opacity: isHoveringContact ? 0.55 : 0, scale: isHoveringContact ? 1 : 0.3 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />

            {/* content */}
            <div className="relative z-10 p-6 flex flex-col justify-between h-full min-h-[200px]">
              <div className="flex justify-between items-start">
                <span className="text-white/80 text-sm font-medium leading-snug">Have some<br />questions?</span>
                <motion.div
                  animate={{ x: isHoveringContact ? 3 : 0, y: isHoveringContact ? -3 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <ArrowUpRight
                    size={22}
                    style={{ color: isHoveringContact ? "#000" : "#fff", transition: "color 0.2s" }}
                  />
                </motion.div>
              </div>
              <h3 className="text-white text-[38px] font-semibold tracking-tight leading-none">Contact me</h3>
            </div>
          </motion.div>
        </TooltipWrap>

        {/* 6 · SOCIALS — TooltipWrap */}
        <TooltipWrap show={activeTab === "SOCIALS"} className="col-span-12 md:col-span-3">
          <motion.div variants={tile}
            className="bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-5 flex flex-col relative overflow-hidden h-full"
          >
            <p className="text-gray-500 text-[10px] tracking-widest uppercase mb-3">Find me online</p>

            <div className="flex flex-col gap-2 flex-1 justify-center">
              {[
                { icon: <Instagram size={17} />, label: "Instagram", handle: "@ubaid_dar10",     href: "https://instagram.com/ubaid_dar10",            accent: "hover:border-pink-500/30 hover:bg-pink-500/5",  ic: "group-hover/s:text-pink-400"  },
                { icon: <Github    size={17} />, label: "GitHub",    handle: "ubaiddar1614",     href: "https://github.com/ubaiddar1614",               accent: "hover:border-white/20    hover:bg-white/5",     ic: "group-hover/s:text-white"     },
                { icon: <Linkedin  size={17} />, label: "LinkedIn",  handle: "ubaid-raza-dar",   href: "https://linkedin.com/in/ubaid-raza-dar",        accent: "hover:border-blue-500/30 hover:bg-blue-500/5",  ic: "group-hover/s:text-blue-400"  },
              ].map((s, i) => (
                <motion.a key={i}
                  href={s.href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border border-white/[0.05] bg-white/[0.02] transition-all group/s ${s.accent}`}
                >
                  <span className={`text-gray-500 transition-colors ${s.ic}`}>{s.icon}</span>
                  <div className="min-w-0">
                    <p className="text-gray-300 text-xs font-medium group-hover/s:text-white transition-colors">{s.label}</p>
                    <p className="text-gray-600 text-[10px] truncate">{s.handle}</p>
                  </div>
                  <ArrowUpRight size={11} className="text-gray-700 group-hover/s:text-emerald-400 ml-auto transition-colors shrink-0" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </TooltipWrap>

        {/* ══ ROW 3 ══════════════════════════════════════════════════════ */}

        {/* 7 · EXPERIENCE — no tooltip needed per spec */}
        <motion.div variants={tile}
          className="col-span-12 md:col-span-5 bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-5 flex flex-col gap-2.5 relative overflow-hidden"
        >
          <div className="flex items-center gap-2">
            <Briefcase size={12} className="text-gray-500" />
            <p className="text-gray-500 text-[10px] tracking-widest uppercase">Experience</p>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {workExp.map((exp, i) => (
              <motion.div key={i}
                whileHover={{ scale: 1.015, borderColor: exp.current ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)" }}
                transition={{ type: "spring", stiffness: 360, damping: 24 }}
                className={`rounded-2xl p-3.5 border flex flex-col gap-2 ${
                  exp.current ? "bg-emerald-500/5 border-emerald-500/20" : "bg-white/[0.02] border-white/[0.05]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={`text-[13px] font-semibold ${exp.current ? "text-emerald-300" : "text-gray-200"}`}>{exp.role}</p>
                    <p className="text-gray-500 text-[11px] mt-0.5">{exp.company}</p>
                  </div>
                  {exp.current ? (
                    <span className="flex items-center gap-1 text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5 whitespace-nowrap">
                      <motion.span
                        animate={{ scale: [1, 1.6, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                      />
                      Live
                    </span>
                  ) : (
                    <span className="text-[9px] text-gray-600">Model Town</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {exp.stack.map((s, j) => (
                    <span key={j} className="text-[9px] text-emerald-400/70 bg-emerald-500/10 rounded-md px-1.5 py-0.5 border border-emerald-500/15">{s}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 8 · CURRENTLY LEARNING */}
        <motion.div variants={tile}
          className="col-span-12 md:col-span-4 bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2">
            <BookOpen size={12} className="text-gray-500" />
            <p className="text-gray-500 text-[10px] tracking-widest uppercase">Currently Learning</p>
          </div>
          <div className="flex flex-col gap-3 flex-1 justify-center">
            {[
              { label: "Spring Boot + JPA",  progress: 72 },
              { label: "MySQL Optimization", progress: 65 },
              { label: "Docker & Deploy",    progress: 40 },
              { label: "System Design",      progress: 30 },
            ].map((p, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-[11px]">{p.label}</span>
                  <span className="text-emerald-400/60 text-[10px]">{p.progress}%</span>
                </div>
                <div className="h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.progress}%` }}
                    transition={{ duration: 1.5, delay: 0.5 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-gradient-to-r from-emerald-700 to-emerald-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-700 text-[10px] pt-2 border-t border-white/[0.04]">
            Java → Spring → MySQL → REST → Docker → System Design
          </p>
        </motion.div>

        {/* 9 · QUOTE */}
        <motion.div variants={tile}
          whileHover={{ borderColor: "rgba(52,211,153,0.25)" }}
          className="col-span-12 md:col-span-3 relative bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-6 flex flex-col justify-between overflow-hidden transition-colors"
        >
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.04, 0.1, 0.04] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-40 h-40 bg-emerald-400 rounded-full blur-[70px] pointer-events-none"
          />
          <p className="text-[54px] text-emerald-500/15 font-serif leading-none select-none relative z-10">"</p>
          <div className="flex-1 flex flex-col justify-center relative z-10 -mt-6">
            <p className="text-gray-300 text-sm leading-relaxed italic">Build things that matter.</p>
            <motion.p
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-emerald-400 text-sm font-semibold not-italic mt-1"
            >
              Ship. Iterate. Master.
            </motion.p>
          </div>
          <div className="relative z-10 pt-3 border-t border-white/[0.05] flex items-center justify-between">
            <p className="text-gray-700 text-[10px] uppercase tracking-widest">Ubaid Raza Dar</p>
            <p className="text-emerald-700 text-[10px]">Freelance · Open</p>
          </div>
        </motion.div>

      </motion.div>

      <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}