import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, AlertTriangle, ShieldCheck, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - PinterClip',
  description: 'Terms of Service and Conditions of Use for PinterClip.com Pinterest Media Downloader.',
  alternates: {
    canonical: 'https://pinterclip.com/terms',
  },
};

export default function TermsPage() {
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
            <BookOpen className="w-3.5 h-3.5" />
            <span>Terms of Use</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Terms of Service</h1>
          <p className="text-xs text-slate-400">Last updated: September 2026</p>
        </div>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#e60023]" />
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and utilizing <strong>PinterClip.com</strong> (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue use of this platform immediately.
          </p>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#e60023]" />
            2. Nature of Service & No Hosting Policy
          </h2>
          <p>
            PinterClip is an independent technological utility created to assist users in saving publicly accessible media files from Pinterest.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>
              <strong>No Hosting:</strong> PinterClip does not host, store, archive, or distribute copyrighted media on its servers.
            </li>
            <li>
              <strong>Direct Client-Server Streaming:</strong> Media files are retrieved directly from Pinterest’s official content delivery network (CDN) to the user’s local device.
            </li>
            <li>
              <strong>Non-Affiliation:</strong> PinterClip is not affiliated, endorsed, sponsored, or officially connected in any way with Pinterest, Inc.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#e60023]" />
            3. Acceptable Use & Copyright
          </h2>
          <p>
            The user assumes full legal responsibility for any content downloaded through PinterClip:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>
              The service must be used solely for personal, non-commercial, and fair-use educational purposes.
            </li>
            <li>
              You agree not to use this tool to infringe upon any copyright or intellectual property rights of third parties.
            </li>
            <li>
              Automated high-frequency scraping, abuse, or denial-of-service attempts against PinterClip infrastructure are strictly prohibited.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-8">
          <h2 className="text-lg font-bold text-white">Legal Inquiries</h2>
          <p>
            For questions or legal communications regarding these Terms of Service, please reach out to:{' '}
            <a href="mailto:contact@pinterclip.com" className="text-[#e60023] font-bold hover:underline">
              contact@pinterclip.com
            </a>.
          </p>
        </section>
      </main>

      <footer className="w-full bg-[#0b0e14] border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 PinterClip.com. All rights reserved.</p>
      </footer>
    </div>
  );
}
