import Link from "next/link";
import { Scale, Zap, FileText, BookOpen, ArrowRight, CheckCircle } from "lucide-react";
import Navbar from "./_components/Navbar";
import WhatsAppQR from "./_components/WhatsAppQR";

export default function VakilAILanding() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-600/60 border border-indigo-400/40 rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            30-Day Free Trial — No Payment Required
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            AI Legal Assistant for<br />
            <span className="text-amber-300">Indian District Court Advocates</span>
          </h1>
          <p className="text-indigo-200 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Cut 3–5 hours of daily research & drafting. Summarize judgments, map IPC→BNS sections, and generate court-ready petitions — in Telugu, Hindi, or English.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/apps/vakilai/register"
              className="bg-amber-400 text-gray-900 font-bold px-8 py-3 rounded-lg hover:bg-amber-300 transition-colors text-center"
            >
              Start Free Trial →
            </Link>
            <Link
              href="/apps/vakilai/mapper"
              className="bg-white/10 border border-white/30 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors text-center"
            >
              Try IPC → BNS Mapper
            </Link>
          </div>
        </div>
      </section>

      {/* Quick feature highlights */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Everything a Solo Advocate Needs
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">BNS / BNSS / BSA Mapper</h3>
              <p className="text-gray-600 text-sm mb-3">
                Instantly convert old IPC / CrPC / Evidence Act sections to the new codes. Get plain-language explanations and download stub templates.
              </p>
              <Link
                href="/apps/vakilai/mapper"
                className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                Try Mapper <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Judgment Summarizer</h3>
              <p className="text-gray-600 text-sm mb-3">
                Upload a PDF or paste judgment text. Get structured summaries — case name, court, date, key holding, sections cited — in your language.
              </p>
              <Link
                href="/apps/vakilai/summarizer"
                className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                Summarize Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
              <div className="w-10 h-10 bg-amber-500 text-white rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Petition Draft Generator</h3>
              <p className="text-gray-600 text-sm mb-3">
                Fill a quick form — bail, legal notice, cheque bounce. Get a court-ready English draft with a Telugu or Hindi summary.
              </p>
              <Link
                href="/apps/vakilai/petition"
                className="text-amber-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
              >
                Generate Draft <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp QR — scan-to-trial for live demos */}
      <WhatsAppQR />

      {/* Social proof / checklist */}
      <section className="py-12 px-4 bg-gray-50">

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Built for District Court Practice</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto">
            {[
              "Telugu, Hindi & English output",
              "IPC 302 → BNS 103 in seconds",
              "Works on Android browser",
              "15–25 active matters? Perfect.",
              "Court-ready petition formats",
              "30-day free trial, no credit card",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/apps/vakilai/register"
              className="inline-block bg-indigo-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Activate Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 px-4 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Scale className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-gray-600">VakilAI</span>
        </div>
        <p>AI legal assistant for Indian advocates. Not a substitute for professional legal advice.</p>
      </footer>
    </div>
  );
}
