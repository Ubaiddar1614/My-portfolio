"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight, Github, Linkedin, Instagram,
  Database, Server, Code2, Briefcase
} from "lucide-react";
import ContactForm from "./ContactForm";

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
        👇 It&apos;s right here dumbass
        <span className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 block w-3 h-3 bg-[#8B5CF6] rotate-45 rounded-sm" />
      </motion.div>
    )}
  </AnimatePresence>
);

const TooltipWrap = ({ show, children, className }) => (
  <div className={`relative ${className ?? ""}`}>
    <SassyTooltip show={show} />
    {children}
  </div>
);

const Marquee = ({ items }) => (
  <div className="overflow-hidden whitespace-nowrap">
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="inline-flex gap-6"
    >
      {[...items, ...items].map((t, i) => (
        <span key={`marquee-${i}`} className="text-gray-600 text-[11px] font-semibold uppercase tracking-widest">
          {t} <span className="text-emerald-800 mx-1">✦</span>
        </span>
      ))}
    </motion.div>
  </div>
);

const TerminalEgg = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [gitLog, setGitLog] = useState("CONNECTING TO GITHUB API...");

  useEffect(() => {
    fetch("https://api.github.com/users/Ubaiddar1614/events/public")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const pushEvent = data.find((event) => event.type === "PushEvent");
          if (pushEvent) {
            const repo = pushEvent.repo.name.replace("Ubaiddar1614/", "");
            const commitMsg = pushEvent.payload.commits?.[0]?.message || "Pushed updates";
            const time = new Date(pushEvent.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setGitLog(`[${time}] PUSH ${repo} -> "${commitMsg}"`);
          } else {
            setGitLog("[INFO] Active development on Stack Fuse");
          }
        } else {
          setGitLog("[INFO] Active development on Stack Fuse");
        }
      })
      .catch(() => {
        setGitLog("[INFO] Active development on Stack Fuse");
      });
  }, []);

  return (
    <motion.div 
      layout
      onClick={(e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
      }}
      className="text-left font-mono text-[9px] cursor-pointer select-none bg-black/40 border border-emerald-500/20 rounded-xl p-2.5 max-w-[210px] hover:border-emerald-500/40 transition-colors shrink-0 text-emerald-400 shadow-lg"
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
    >
      <div className="flex items-center gap-1.5 mb-1.5 text-[8px] text-emerald-500/60 uppercase tracking-widest font-bold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>git_ops.log</span>
      </div>
      <p className="leading-normal truncate max-w-[190px] font-semibold text-emerald-300">{gitLog}</p>
      
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <pre className="mt-2 text-[8px] leading-relaxed text-emerald-400 bg-black/60 p-2 rounded-lg border border-white/5 whitespace-pre-wrap">
              {JSON.stringify({ status: 200, uptime: "99.9%", available_for_work: true }, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function BentoGrid({ activeTab, isMobile }) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDropped, setIsDropped] = useState(false);

  // animation variants
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
  };
  const tile = {
    hidden: { opacity: 0, y: 38, scale: 0.96, filter: "blur(8px)" },
    visible: {
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 240, damping: 22, mass: 0.9 },
    },
  };

  const techStack = [
    { icon: <Code2 size={12} />, label: "Java" },
    { icon: <Server size={12} />, label: "Spring Boot" },
    { icon: <Database size={12} />, label: "MySQL" },
    { icon: <Code2 size={12} />, label: "REST APIs" },
    { icon: <Server size={12} />, label: "Docker" },
    { icon: <Code2 size={12} />, label: "Node.js" },
  ];

  const workExp = [
    { role: "Co-Founder & Backend Dev", company: "Stack Fuse", stack: ["Java", "Spring Boot", "MySQL", "Docker"], current: true },
    { role: "Full Stack Intern", company: "Division Public School", stack: ["ASP.NET", "C#", "HTML5"], current: false },
  ];

  const aboutWords = "Hi, I'm Ubaid a CS student, co-founder of Stack Fuse, and backend developer who builds real systems. I care about clean architecture, not just getting things to run.".split(" ");
  const marqueeItems = ["Java", "Spring Boot", "MySQL", "REST APIs", "Docker", "System Design", "Backend Dev", "Stack Fuse"];

  // FIX: pre-compute random positions so they're stable across renders
  const wordPositions = useMemo(() =>
    aboutWords.map(() => ({
      x: Math.random() * 80 + 10,
      y: Math.random() * 20 + 65,
      r: (Math.random() - 0.5) * 120,
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [] // compute once on mount
  );

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-2.5 w-full max-w-[1100px] mx-auto"
      >
        {/* row 1 */}

        {/* hero tile */}
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

            <TerminalEgg />
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
            <p className="text-gray-600 text-sm mt-2 font-mono font-medium tracking-tight">— Architected for Scale.</p>
          </div>

          <div className="relative z-10 mt-4 pt-3 border-t border-white/[0.05]">
            <Marquee items={marqueeItems} />
          </div>
        </motion.div>

        {/* portrait tile */}
        <motion.div variants={tile}
          className="col-span-12 md:col-span-4 rounded-[28px] overflow-hidden relative min-h-[260px] bg-[#1A1A1C] group"
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.07 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image 
                src="/profile.jpg" 
                alt="Ubaid Raza Dar" 
                fill 
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 350px"
                className="object-cover object-center grayscale contrast-125 brightness-90" 
              />
            </motion.div>
          </div>
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

        {/* projects tile -> Case Study Case file */}
        <TooltipWrap show={!isMobile && activeTab === "PROJECTS"} className="col-span-12 md:col-span-3">
          <motion.div id="projects" variants={tile}
            className="bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-5 flex flex-col justify-between relative overflow-hidden h-full min-h-[260px] group"
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <p className="text-emerald-400 text-[9px] font-mono tracking-widest uppercase">SYS-INCDNT #04</p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              
              <h3 className="text-white text-sm font-bold tracking-tight mb-2">Stack Fuse Connection Leak</h3>
              <p className="text-gray-400 text-[11px] leading-relaxed mb-3">
                <strong>Incident:</strong> Serverless Mongoose connections exhausted under burst loads, causing cold-start latencies of up to 4.2s.
              </p>
              <p className="text-gray-500 text-[10px] leading-normal font-mono bg-black/30 border border-white/5 rounded-lg p-2">
                RESOLVED: Bound connection promise to global context to cache active sockets. Latency dropped by 88%.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
              <span className="text-[9px] text-gray-500 uppercase font-mono tracking-wide">Spring / Next.js / Mongo</span>
              <a 
                href="https://github.com/ubaiddar1614" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-[10px] font-bold flex items-center gap-1 group/btn transition-colors"
              >
                Docs <ArrowUpRight size={10} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </motion.div>
        </TooltipWrap>

        {/* row 2 */}

        {/* about tile */}
        <TooltipWrap show={!isMobile && activeTab === "ABOUT"} className="col-span-12 md:col-span-5">
          <motion.div id="about" variants={tile}
            className="relative rounded-[28px] overflow-hidden flex flex-col justify-between min-h-[200px]"
          >
            <div className="absolute inset-0 bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] overflow-hidden z-0">
              {/* FIX: use pre-computed stable positions from useMemo */}
              {isDropped && aboutWords.map((word, i) => (
                <motion.span key={`word-${i}`}
                  initial={{ opacity: 0, y: -40 }}
                  animate={{ opacity: 1, left: `${wordPositions[i].x}%`, top: `${wordPositions[i].y}%`, rotate: wordPositions[i].r }}
                  transition={{ type: "spring", bounce: 0.55, duration: 1.4, delay: i * 0.02 }}
                  className={`absolute text-[13px] pointer-events-none select-none ${
                    word.includes("Ubaid") || word.includes("Stack") || word.includes("Fuse")
                      ? "text-emerald-400 font-semibold" : "text-gray-600"
                  }`}
                >{word}</motion.span>
              ))}
            </div>

            <div className="relative z-10 p-6 md:p-7 flex flex-col justify-between h-full gap-4">
              {!isDropped && (
                <p className="text-gray-400 leading-relaxed text-sm md:text-[15px]">
                  <span
                    onClick={() => setIsDropped(true)}
                    className="cursor-pointer text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
                  >Hey, I&apos;m Ubaid.</span>{" "}
                  A CS student and backend engineer running Stack Fuse. I spend my time designing clean APIs, optimizing relational schemas, and stripping away unnecessary latency. I believe code should be easy to read and systems should be built to scale without throwing memory exceptions.
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {techStack.map((t, i) => (
                  <motion.span
                    key={`tech-${i}`}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex items-center gap-1 text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1 cursor-pointer hover:bg-emerald-500/20 hover:border-emerald-500/40 active:bg-emerald-500/30 select-none"
                  >
                    {t.icon} {t.label}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </TooltipWrap>

        {/* contact tile */}
        <TooltipWrap show={!isMobile && activeTab === "CONTACT"} className="col-span-12 md:col-span-4">
          <motion.div id="contact" variants={tile}
            onClick={() => setIsContactOpen(true)}
            className="relative rounded-[24px] md:rounded-[28px] border border-emerald-500 overflow-hidden flex flex-col justify-between cursor-pointer min-h-[160px] md:min-h-[200px] group bg-neutral-900 hover:bg-emerald-900/20 transition-colors duration-300 p-5 md:p-6 text-emerald-400"
          >
            <div className="flex justify-between items-start">
              <span className="text-emerald-500/70 text-sm font-medium leading-snug">Have some<br />questions?</span>
              <motion.div
                whileHover={{ x: 3, y: -3 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <ArrowUpRight size={22} className="text-emerald-400 group-hover:text-emerald-300 transition-colors" />
              </motion.div>
            </div>
            <h3 className="text-emerald-400 text-[32px] md:text-[38px] font-semibold tracking-tight leading-none mt-auto font-mono">Contact me</h3>
          </motion.div>
        </TooltipWrap>

        {/* socials tile */}
        <TooltipWrap show={!isMobile && activeTab === "SOCIALS"} className="col-span-12 md:col-span-3">
          <motion.div id="socials" variants={tile}
            className="bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-5 flex flex-col relative overflow-hidden h-full justify-between"
          >
            <p className="text-gray-500 text-[10px] tracking-widest uppercase mb-2">Find me online</p>

            <div className="flex flex-col gap-1.5 flex-1 justify-center">
              {[
                { icon: <Instagram size={15} />, label: "Instagram", handle: "@ubaid_dar10",   href: "https://instagram.com/ubaid_dar10",         accent: "hover:border-pink-500/30 hover:bg-pink-500/5",  ic: "group-hover/s:text-pink-400"  },
                { icon: <Github    size={15} />, label: "GitHub",    handle: "ubaiddar1614",   href: "https://github.com/ubaiddar1614",            accent: "hover:border-white/20    hover:bg-white/5",     ic: "group-hover/s:text-white"     },
                { icon: <Linkedin  size={15} />, label: "LinkedIn",  handle: "ubaid-raza-dar", href: "https://linkedin.com/in/ubaid-raza-dar",     accent: "hover:border-blue-500/30 hover:bg-blue-500/5",  ic: "group-hover/s:text-blue-400"  },
              ].map((s, i) => (
                <motion.a key={`social-${i}`}
                  href={s.href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className={`flex items-center gap-2.5 py-1.5 px-3 rounded-xl border border-white/[0.05] bg-white/[0.02] transition-all group/s ${s.accent}`}
                >
                  <span className={`text-gray-500 transition-colors ${s.ic}`}>{s.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-gray-300 text-xs font-semibold group-hover/s:text-white transition-colors">{s.label}</p>
                    <p className="text-gray-600 text-[9px] truncate">{s.handle}</p>
                  </div>
                  <ArrowUpRight size={10} className="text-gray-700 group-hover/s:text-emerald-400 ml-auto transition-colors shrink-0" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </TooltipWrap>

        {/* row 3 */}

        {/* experience tile */}
        <motion.div variants={tile}
          className="col-span-12 md:col-span-5 bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-5 flex flex-col gap-2.5 relative overflow-hidden"
        >
          <div className="flex items-center gap-2">
            <Briefcase size={12} className="text-gray-500" />
            <p className="text-gray-500 text-[10px] tracking-widest uppercase">Experience</p>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            {workExp.map((exp, i) => (
              <motion.div key={`exp-${i}`}
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
                    <span key={`stack-${i}-${j}`} className="text-[9px] text-emerald-400/70 bg-emerald-500/10 rounded-md px-1.5 py-0.5 border border-emerald-500/15">{s}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* shipping / operations log tile */}
        <motion.div variants={tile}
          className="col-span-12 md:col-span-4 bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-5 flex flex-col justify-between min-h-[220px]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-gray-400 text-[9px] font-mono uppercase tracking-widest">WEEKLY_SHIP_LOGS</p>
          </div>
          
          <div className="flex flex-col gap-2.5 flex-1 justify-center font-mono">
            {[
              { time: "Mon 14:10", action: "config_auth", details: "Spring OAuth2 JWT pipeline", perf: "[OK]" },
              { time: "Wed 09:42", action: "optmz_db", details: "Indexed message schema key fields", perf: "-112ms" },
              { time: "Thu 16:30", action: "dockr_bld", details: "Created multi-stage Docker file", perf: "-140MB" },
              { time: "Sat 11:15", action: "api_patch", details: "Cached serverless mongo streams", perf: "SEC_OK" }
            ].map((log, i) => (
              <div key={`log-${i}`} className="flex flex-col text-[10px] border-b border-white/[0.02] pb-1.5 last:border-0 last:pb-0">
                <div className="flex justify-between items-center text-gray-500">
                  <span>{log.time} · {log.action}</span>
                  <span className="text-emerald-400/90 text-[9px] font-bold">{log.perf}</span>
                </div>
                <p className="text-gray-300 text-[11px] mt-0.5">{log.details}</p>
              </div>
            ))}
          </div>
          
          <div className="pt-2 border-t border-white/[0.04] text-[9px] font-mono text-gray-600 flex justify-between">
            <span>BRANCH: MAIN</span>
            <span>SHIPPED VIA GIT</span>
          </div>
        </motion.div>

        {/* thesis tile */}
        <motion.div variants={tile}
          whileHover={{ borderColor: "rgba(52,211,153,0.25)" }}
          className="col-span-12 md:col-span-3 relative bg-[#1A1A1C] border border-white/[0.06] rounded-[28px] p-6 flex flex-col justify-between overflow-hidden transition-colors"
        >
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.04, 0.1, 0.04] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 right-0 w-40 h-40 bg-emerald-400 rounded-full blur-[70px] pointer-events-none"
          />
          <div className="flex-1 flex flex-col justify-center relative z-10 pt-4">
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#ef4444]/80" />
              <span className="w-2 h-2 rounded-full bg-[#facc15]/80" />
              <span className="w-2 h-2 rounded-full bg-[#22c55e]/80" />
            </div>
            <p className="text-emerald-400/70 text-[9px] font-mono mb-1.5">root@ubaid:~# cat thesis.sh</p>
            <p className="text-gray-300 text-xs font-semibold leading-relaxed font-mono">
              "If your server takes 500ms to resolve a single query, you don't have a database scale problem. You have an efficiency problem."
            </p>
          </div>
          <div className="relative z-10 pt-3 border-t border-white/[0.05] flex items-center justify-between font-mono text-[9px]">
            <p className="text-gray-500 uppercase tracking-widest">STATUS: ONLINE</p>
            <p className="text-emerald-500/80">LATENCY: 12ms</p>
          </div>
        </motion.div>

      </motion.div>

      <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
}