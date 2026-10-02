import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Cookie, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - PinterClip',
  description: 'Privacy Policy and Cookie information for PinterClip.com Pinterest Media Downloader.',
  alternates: {
    canonical: 'https://pinterclip.com/privacy',
  },
};

export default function PrivacyPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Legal & Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Privacy Policy</h1>
          <p className="text-xs text-slate-400">Last updated: September 2026</p>
        </div>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#e60023]" />
            1. Commitment to Privacy
          </h2>
          <p>
            At <strong>PinterClip.com</strong>, we consider the protection of personal data essential. This Privacy Policy describes the types of information we process, how it is handled, and the technical measures we implement to protect your anonymity.
          </p>
          <p>
            PinterClip is a free service that operates under a strict privacy-first principle: <strong>we do not require user account registration, we do not request email addresses to download, and we do not store logs of the Pinterest links you process or the media files downloaded</strong>.
          </p>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#e60023]" />
            2. Information We Process
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>
              <strong className="text-slate-200">Pinterest Links:</strong> When you submit a public Pinterest URL or pin.it link, our servers temporarily process that link solely to retrieve the media stream directly from Pinterest’s CDN and deliver it in original resolution. Once served, temporary data is automatically purged.
            </li>
            <li>
              <strong className="text-slate-200">Server Logs:</strong> Like standard web infrastructure, we collect temporary non-identifiable technical data such as anonymized IP addresses, browser type, operating system, and request timestamps solely for DDoS mitigation, abuse prevention, and server reliability.
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cookie className="w-5 h-5 text-[#e60023]" />
            3. Advertising & Cookies (Google AdSense)
          </h2>
          <p>
            PinterClip provides free tools supported by third-party advertising partners, including <strong>Google AdSense</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-400">
            <li>
              Google and third-party vendors use cookies to serve ads based on prior visits to this website or other sites across the internet.
            </li>
            <li>
              Users may opt out of personalized advertising by visiting the{' '}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e60023] hover:underline"
              >
                Google Ads Settings
              </a>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#e60023]" />
            4. GDPR & CCPA Compliance
          </h2>
          <p>
            We comply with international data privacy standards, including the EU General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA). You have the right to request information, clarification, or deletion regarding any technical records associated with your browsing session by reaching out to us.
          </p>
        </section>

        <section className="space-y-4 text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-8">
          <h2 className="text-lg font-bold text-white">Privacy Contact</h2>
          <p>
            If you have questions or concerns regarding our privacy practices, please contact us directly at:{' '}
            <a href="mailto:contact@pinterclip.com" className="text-[#e60023] font-bold hover:underline">
              contact@pinterclip.com
            </a>{' '}
            or visit our <Link href="/contact" className="text-[#e60023] hover:underline">Contact Page</Link>.
          </p>
        </section>
      </main>

      <footer className="w-full bg-[#0b0e14] border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 PinterClip.com. All rights reserved.</p>
      </footer>
    </div>
  );
}
