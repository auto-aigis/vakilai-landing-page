"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ChevronRight, AlertCircle, Copy, Check, Download } from "lucide-react";
import Navbar from "../_components/Navbar";
import { useAuth } from "../_components/AuthProvider";
import { apiFetch } from "../_lib/api";
import type { Petition } from "../_lib/api";

type MatterType = "bail" | "legal_notice" | "cheque_bounce";

const MATTER_TYPES: Array<{ value: MatterType; label: string; desc: string }> = [
  { value: "bail", label: "Bail Application", desc: "High Court / Sessions Court bail petition" },
  { value: "legal_notice", label: "Legal Notice", desc: "Formal legal notice under relevant sections" },
  { value: "cheque_bounce", label: "Cheque Bounce", desc: "Complaint under NI Act Section 138" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function matterLabel(type: string) {
  return type === "bail" ? "Bail" : type === "legal_notice" ? "Legal Notice" : type === "cheque_bounce" ? "Cheque Bounce" : type;
}

export default function PetitionPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<{ matter_type: MatterType; party_names: string; key_facts: string }>({
    matter_type: "bail",
    party_names: "",
    key_facts: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Petition | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<Petition[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/apps/vakilai/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setHistoryLoading(true);
      apiFetch<Petition[]>("/api/petition")
        .then(setHistory)
        .catch(() => {})
        .finally(() => setHistoryLoading(false));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.party_names.trim() || !form.key_facts.trim()) {
      setError("Party names and key facts are required.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await apiFetch<Petition>("/api/petition", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setResult(data);
      setHistory((prev) => [data, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed.";
      if (msg.includes("402") || msg.toLowerCase().includes("api key")) {
        setError("OpenAI API key not configured. Please add it in Settings.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-500" />
            Petition Draft Generator
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill the form below to generate a court-ready English petition draft
            {user.preferred_language !== "English" && ` with a ${user.preferred_language} summary`}.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Form + Result */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Matter type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Matter Type</label>
                  <div className="grid grid-cols-1 gap-2">
                    {MATTER_TYPES.map((mt) => (
                      <button
                        key={mt.value}
                        type="button"
                        onClick={() => setForm({ ...form, matter_type: mt.value })}
                        className={`text-left p-3 rounded-lg border transition-colors ${
                          form.matter_type === mt.value
                            ? "bg-amber-50 border-amber-400 text-amber-800"
                            : "border-gray-200 hover:border-amber-200 text-gray-700"
                        }`}
                      >
                        <div className="font-medium text-sm">{mt.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{mt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Party names */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Party Names <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.party_names}
                    onChange={(e) => setForm({ ...form, party_names: e.target.value })}
                    placeholder="e.g. Petitioner: Suresh Rao, Respondent: State of Telangana"
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Key facts */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Key Facts <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.key_facts}
                    onChange={(e) => setForm({ ...form, key_facts: e.target.value })}
                    placeholder="Briefly describe 2–3 key facts relevant to this matter. E.g. date of arrest, sections alleged, prior bail history, etc."
                    rows={5}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.key_facts.length} characters</p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !form.party_names.trim() || !form.key_facts.trim()}
                  className="w-full bg-amber-500 text-white font-semibold py-2.5 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Generating draft...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Generate Petition
                    </>
                  )}
                </button>
              </form>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  {error}{" "}
                  {error.includes("API key") && (
                    <Link href="/apps/vakilai/settings" className="underline font-medium">Go to Settings →</Link>
                  )}
                </span>
              </div>
            )}

            {result && <PetitionResult petition={result} lang={user.preferred_language} />}
          </div>

          {/* Right: History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-800 text-sm mb-3">Recent Drafts</h2>
              {historyLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />)}
                </div>
              ) : history.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-6">No drafts yet</p>
              ) : (
                <div className="space-y-1">
                  {history.map((item) => (
                    <Link
                      key={item.id}
                      href={`/apps/vakilai/petition/${item.id}`}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
                          <span className="inline-block bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded flex-shrink-0">
                            {matterLabel(item.matter_type)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">{item.party_names}</div>
                        <div className="text-xs text-gray-300">{formatDate(item.created_at)}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PetitionResult({ petition, lang }: { petition: Petition; lang: string }) {
  const [copied, setCopied] = useState(false);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const handleCopy = async () => {
    const text = petition.draft_text + (petition.regional_summary ? "\n\n---\n" + petition.regional_summary : "");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-amber-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-800">Generated Draft</h2>
        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
          {matterLabel(petition.matter_type)}
        </span>
      </div>

      {/* English draft */}
      <div>
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2 flex items-center justify-between">
          <span>English Draft</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <a
              href={`${API_URL}/api/petition/${petition.id}/download?fmt=txt`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800"
            >
              <Download className="w-3.5 h-3.5" /> .txt
            </a>
            <a
              href={`${API_URL}/api/petition/${petition.id}/download?fmt=docx`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800"
            >
              <Download className="w-3.5 h-3.5" /> .docx
            </a>
          </div>
        </div>
        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-700 overflow-auto max-h-64 whitespace-pre-wrap font-sans leading-relaxed">
          {petition.draft_text}
        </pre>
      </div>

      {/* Regional summary */}
      {petition.regional_summary && lang !== "English" && (
        <div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">
            {lang} Summary ({lang === "Telugu" ? "తెలుగు" : "हिन्दी"})
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
            {petition.regional_summary}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Link
          href={`/apps/vakilai/petition/${petition.id}`}
          className="text-xs text-amber-600 hover:underline"
        >
          View full page →
        </Link>
      </div>
    </div>
  );
}
