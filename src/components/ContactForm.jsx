"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";

export default function ContactForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");

  // close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) return;
    
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          setFormData({ name: "", email: "", phone: "", message: "" });
          onClose();
        }, 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* modal wrapper */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-lg sm:max-w-4xl h-[90vh] sm:h-auto sm:max-h-[90vh] bg-[#111113] border border-white/10 rounded-t-2xl sm:rounded-2xl shadow-2xl z-10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5 bg-[#1C1C1E] shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Get In Touch</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-1"
              >
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col sm:flex-row">
                {/* Info Text - Hidden on mobile */}
                <div className="hidden sm:flex sm:w-5/12 bg-[#1C1C1E] p-8 flex-col justify-center border-r border-white/5">
                  <p className="text-gray-400 text-[15px] leading-relaxed mb-6">
                    I'd love to hear from you! Whether you have a project in mind, want to collaborate, or just want to say hello.
                  </p>
                  <div className="flex flex-col gap-3 text-sm text-gray-500">
                    <p>• I typically respond within 24–48 hours</p>
                    <p>• Open to freelance and full-time opportunities</p>
                  </div>
                </div>

                {/* Form */}
                <div className="w-full sm:w-7/12 p-4 sm:p-8 bg-[#111113]">
                  {status === "success" ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-emerald-400"
                    >
                      <CheckCircle2 size={56} className="mb-4" />
                      <p className="text-xl font-medium text-white">Message sent!</p>
                      <p className="text-sm text-gray-400 mt-2">I'll get back to you shortly.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-gray-400">Name <span className="text-red-500">*</span></label>
                          <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                            placeholder="John"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-gray-400">Email <span className="text-red-500">*</span></label>
                          <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                            placeholder="john@email.com"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-400">Phone <span className="text-red-500">*</span></label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                          placeholder="+92 300 1234567"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-400">Message <span className="text-red-500">*</span></label>
                        <textarea
                          required
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-[#1C1C1E] border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                          placeholder="Hi Ubaid, I found your portfolio..."
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
                      >
                        {status === "loading" ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          "Send Message"
                        )}
                      </button>

                      {status === "error" && (
                        <p className="text-red-400 text-sm text-center">Something went wrong. Try again.</p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}