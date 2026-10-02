import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Mail, CheckCircle2, FileCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'DMCA Takedown Policy - PinterClip',
  description: 'Digital Millennium Copyright Act (DMCA) Notice and Takedown Procedure for PinterClip.com.',
  alternates: {
    canonical: 'https://pinterclip.com/dmca',
  },
};

export default function DmcaPage() {
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
        <div className="space-y-3 border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e60023]/10 border border-[#e60023]/30 text-[#e60023] text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Copyright & Intellectual Property</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">DMCA Takedown Notice & Policy</h1>
          <p className="text-xs text-slate-400">Digital Millennium Copyright Act (17 U.S.C. § 512)</p>
        </div>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#e60023]" />
            1. Respect for Intellectual Property
          </h2>
          <p>
            At <strong>PinterClip.com</strong>, we strictly respect the intellectual property rights of content creators and comply with the provisions of the <em>Digital Millennium Copyright Act (DMCA)</em>.
          </p>
          <div className="p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-2 text-xs">
            <p className="font-semibold text-slate-200">
              📌 Important Technical Clarification:
            </p>
            <p className="text-slate-400">
              PinterClip <strong>does not host, archive, index, or store any video, audio, or image files on its servers</strong>. The platform acts as an automated technological utility that enables users to download publicly hosted media directly from Pinterest’s official distribution infrastructure to their local devices.
            </p>
          </div>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#e60023]" />
            2. Notice and Takedown Procedure
          </h2>
          <p>
            If you are a copyright owner or authorized representative and believe that any Pinterest media accessible via our tool infringes upon your copyright, you may submit a formal request to have <strong>the specific Pin URL blocked from our parsing engine</strong>.
          </p>
          <p>To ensure prompt processing, please provide the following details:</p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>The exact Pinterest URL you request to be blacklisted on our platform.</li>
            <li>Your contact information (legal name, company, email address, and phone number).</li>
            <li>
              A statement that you have a good-faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
            </li>
            <li>
              A statement, under penalty of perjury, that the information in the notification is accurate, and that you are authorized to act on behalf of the owner.
            </li>
            <li>A physical or electronic signature of the copyright owner or authorized representative.</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            3. Response Time & Designated Agent
          </h2>
          <p>
            All legitimate takedown requests are investigated and processed within <strong>24 to 48 business hours</strong>, applying automated blacklist filters to prevent downloads of the reported links.
          </p>
          <div className="p-5 bg-gradient-to-r from-slate-900 to-[#161b22] border border-[#e60023]/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase font-bold text-[#e60023] tracking-wider">Designated DMCA Agent</p>
              <p className="text-base font-bold text-white">PinterClip Legal & Copyright Operations</p>
              <p className="text-xs text-slate-400">contact@pinterclip.com</p>
            </div>
            <a
              href="mailto:contact@pinterclip.com?subject=DMCA%20Notice%20-%20PinterClip"
              className="px-5 py-2.5 bg-[#e60023] hover:bg-[#d0001f] text-white rounded-xl text-xs font-bold transition shadow-lg shrink-0"
            >
              Submit DMCA Notice
            </a>
          </div>
        </section>
      </main>

      <footer className="w-full bg-[#0b0e14] border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 PinterClip.com. All rights reserved.</p>
      </footer>
    </div>
  );
}
