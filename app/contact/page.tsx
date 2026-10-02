'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Send, CheckCircle2, LifeBuoy } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200 flex flex-col font-sans">
      <header className="sticky top-0 z-40 w-full bg-[#0b0e14]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-sm font-bold text-slate-300 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4 text-[#e60023]" />
            <span>Back to PinterClip</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#e60023] to-[#ff4757] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0b0e14] rounded-[6px] flex items-center justify-center">
                <span className="text-[#e60023] font-black text-xs">P</span>
              </div>
            </div>
            <span className="font-black text-white text-sm">Pinter<span className="text-[#e60023]">Clip</span></span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div className="space-y-3 border-b border-slate-800 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e60023]/10 border border-[#e60023]/30 text-[#e60023] text-xs font-bold uppercase tracking-wider">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Support & Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Contact Us</h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Have questions, feedback, business inquiries, or DMCA requests? Send us a message and our team will get back to you shortly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4 md:col-span-1">
            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-[#e60023]/10 text-[#e60023] flex items-center justify-center mb-1">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Official Email</h3>
              <p className="text-sm font-bold text-white">contact@pinterclip.com</p>
              <p className="text-[11px] text-slate-500">Average response within 24 business hours.</p>
            </div>

            <div className="bg-[#161b22] border border-slate-800 rounded-2xl p-5 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">DMCA Operations</h3>
              <p className="text-sm font-bold text-white">contact@pinterclip.com</p>
              <p className="text-[11px] text-slate-500">Expedited handling for copyright notices.</p>
            </div>
          </div>

          <div className="bg-[#12161d] border border-slate-800 rounded-3xl p-6 md:p-8 md:col-span-2 shadow-2xl">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Thank you for reaching out. We have received your inquiry and will reply to ({email}) soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Smith"
                      className="w-full px-4 py-2.5 bg-[#0b0e14] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#e60023]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 bg-[#0b0e14] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#e60023]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#0b0e14] border border-slate-700/80 rounded-xl text-sm text-white focus:outline-none focus:border-[#e60023]"
                  >
                    <option value="general">General Inquiry / Feedback</option>
                    <option value="dmca">DMCA / Copyright Takedown</option>
                    <option value="advertising">Advertising & Partnerships</option>
                    <option value="bug">Report a Download Issue</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry in detail..."
                    className="w-full px-4 py-2.5 bg-[#0b0e14] border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#e60023] resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-[#e60023] to-[#d0001f] hover:brightness-110 text-white rounded-xl text-sm font-bold transition shadow-lg shadow-[#e60023]/25 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#0b0e14] border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 PinterClip.com. All rights reserved.</p>
      </footer>
    </div>
  );
}
