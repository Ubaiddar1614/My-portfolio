"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, CheckCircle2, Phone, Mail, User } from "lucide-react";

export default function ContactForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState("idle");

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && isOpen) handleSubmit(e);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, formData]);

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container - Wider for split layout */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative w-full max-w-4xl bg-[#111113] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col md:flex-row"
          >
            {/* Close Button - Desktop (Absolute to top right) */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-500 hover:text-white transition-colors z-20"
            >
              <X size={24} />
            </button>

            {/* LEFT COLUMN: Info & Text */}
            <div className="w-full md:w-5/12 bg-[#1C1C1E] p-8 md:p-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                Get In Touch
              </h2>
              <p className="text-gray-400 text-[15px] leading-relaxed mb-8">
                I'd love to hear from you! Whether you have a project in mind, want to collaborate, or just want to say hello, I'm always excited to connect with new people.
              </p>
              
              <div className="flex flex-col gap-4 text-sm text-gray-500 font-medium">
                <p>- I typically respond within 24–48 hours</p>
                <p>- Open to freelance and full-time opportunities</p>
                <p>- Let's build something amazing together!</p>
              </div>
            </div>

            {/* RIGHT COLUMN: The Form */}
            <div className="w-full md:w-7/12 p-8 md:p-10 flex flex-col justify-center bg-[#111113]">
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                         Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#1C1C1E] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#1C1C1E] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#1C1C1E] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#1C1C1E] border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all resize-none"
                      placeholder="Hi Ubaid, I found your portfolio and would love to connect..."
                    />
                  </div>

                  {/* Submit Button & Keyboard Hints */}
                  <div className="mt-2">
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {status === "loading" ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        "Send Message"
                      )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-6 mt-4 text-[11px] text-gray-500">
                      <span>Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-400 mx-1">ESC</kbd> to close</span>
                      <span>Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-400 mx-1">CTRL</kbd> + <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-gray-400 mx-1">ENTER</kbd> to send</span>
                    </div>

                    {status === "error" && (
                      <p className="text-red-400 text-sm text-center mt-3">Something went wrong. Please try again.</p>
                    )}
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}