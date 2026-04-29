"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Download, ChevronRight, AlertCircle, ArrowRight } from "lucide-react";
import Navbar from "../_components/Navbar";
import { useAuth } from "../_components/AuthProvider";
import { apiFetch, getDownloadUrl } from "../_lib/api";
import type { SectionLookup } from "../_lib/api";

const ACT_OPTIONS = ["IPC", "CrPC", "Evidence Act"] as const;
type OldAct = typeof ACT_OPTIONS[number];

const COMMON_EXAMPLES: Array<{ section: string; act: OldAct; label: string }> = [
  { section: "302", act: "IPC", label: "IPC 302 (Murder)" },
  { section: "307", act: "IPC", label: "IPC 307 (Attempt to murder)" },
  { section: "376", act: "IPC", label: "IPC 376 (Rape)" },
  { section: "420", act: "IPC", label: "IPC 420 (Cheating)" },
  { section: "498A", act: "IPC", label: "IPC 498A (Cruelty)" },
  { section: "138", act: "Evidence Act", label: "Evidence 138 (Cross-exam)" },
  { section: "161", act: "CrPC", label: "CrPC 161 (Statement)" },
  { section: "437", act: "CrPC", label: "CrPC 437 (Bail)" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MapperPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [section, setSection] = useState("");
  const [act, setAct] = useState<OldAct>("IPC");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SectionLookup | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<SectionLookup[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/apps/vakilai/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setHistoryLoading(true);
      apiFetch<SectionLookup[]>("/api/mapper")
        .then(setHistory)
        .catch(() => {})
        .finally(() => setHistoryLoading(false));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!section.trim()) return;
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await apiFetch<SectionLookup>("/api/mapper", {
        method: "POST",
        body: JSON.stringify({ old_section: section.trim(), old_act: act }),
      });
      setResult(data);
      setHistory((prev) => [data, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lookup failed.";
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
            <Zap className="w-6 h-6 text-indigo-600" />
            BNS / BNSS / BSA Section Mapper
          </h1>
          <p className="text-gray-500 text-sm mt-1">Convert old IPC / CrPC / Evidence Act sections to new codes with plain-language explanations.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Form + Result */}
          <div className="lg:col-span-3 space-y-4">
            {/* Input form */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Number</label>
                    <input
                      type="text"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      placeholder="e.g. 302, 420, 138"
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Act</label>
                    <select
                      value={act}
                      onChange={(e) => setAct(e.target.value as OldAct)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    >
                      {ACT_OPTIONS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                {/* Quick examples */}
                <div>
                  <p className="text-xs text-gray-400 mb-2">Quick examples:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_EXAMPLES.map((ex) => (
                      <button
                        key={`${ex.act}-${ex.section}`}
                        type="button"
                        onClick={() => { setSection(ex.section); setAct(ex.act); }}
                        className="text-xs px-2.5 py-1 border border-gray-200 rounded-full text-gray-600 hover:border-indigo-400 hover:text-indigo-700 transition-colors"
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !section.trim()}
                  className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Map Section
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

            {/* Result */}
            {result && <MapperResult result={result} />}
          </div>

          {/* Right: History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-800 text-sm mb-3">Recent Lookups</h2>
              {historyLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-6">No lookups yet</p>
              ) : (
                <div className="space-y-1">
                  {history.map((item) => (
                    <Link
                      key={item.id}
                      href={`/apps/vakilai/mapper/${item.id}`}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-800 flex items-center gap-1">
                          {item.old_act} §{item.old_section}
                          {item.new_section && (
                            <>
                              <ArrowRight className="w-3 h-3 text-gray-400" />
                              <span className="text-indigo-700">{item.new_act} §{item.new_section}</span>
                            </>
                          )}
                        </div>
                        <div className="text-xs text-gray-400">{formatDate(item.created_at)}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400" />
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

function MapperResult({ result }: { result: SectionLookup }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  return (
    <div className="bg-white rounded-xl border border-indigo-200 p-5 space-y-4">
      {/* Mapping banner */}
      <div className="bg-indigo-50 rounded-lg p-4 flex items-center gap-4">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-0.5">{result.old_act}</div>
          <div className="text-xl font-bold text-gray-800">§ {result.old_section}</div>
        </div>
        <ArrowRight className="w-6 h-6 text-indigo-400 flex-shrink-0" />
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-0.5">{result.new_act || "—"}</div>
          <div className="text-xl font-bold text-indigo-700">§ {result.new_section || "Not found"}</div>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Explanation</h3>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result.explanation}</p>
      </div>

      {/* Download stub template */}
      {result.stub_template_text && (
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Stub Petition Template</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600 max-h-32 overflow-y-auto font-mono whitespace-pre-wrap">
            {result.stub_template_text.slice(0, 500)}{result.stub_template_text.length > 500 ? "..." : ""}
          </div>
          <div className="flex gap-2 mt-3">
            <a
              href={`${API_URL}/api/mapper/${result.id}/download?fmt=txt`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download .txt
            </a>
            <a
              href={`${API_URL}/api/mapper/${result.id}/download?fmt=docx`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download .docx
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
