"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TerminalEgg() {
  const [isExpanded, setIsExpanded] = useState(false);

  const jsonStatus = {
    status: 200,
    uptime: "99.9%",
    available_for_work: true,
  };

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className="cursor-pointer select-none rounded-2xl border border-neutral-800 bg-neutral-900 p-5 font-mono text-sm text-emerald-400 shadow-2xl hover:border-emerald-500/20 transition-all duration-300 w-full"
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
    >
      <div className="flex items-center gap-1.5 text-[9px] text-emerald-500/60 uppercase tracking-widest font-bold mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>sys_monitor.sh</span>
      </div>

      <p className="font-semibold text-emerald-300">
        {isExpanded ? "> GET /api/v1/status --verbose" : "> GET /api/v1/status"}
      </p>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <pre className="mt-4 overflow-x-auto text-xs leading-relaxed text-emerald-400 bg-black/40 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
              {JSON.stringify(jsonStatus, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
