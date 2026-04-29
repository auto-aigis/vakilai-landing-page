"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Upload, FileText, ChevronRight, AlertCircle, X } from "lucide-react";
import Navbar from "../_components/Navbar";
import { useAuth } from "../_components/AuthProvider";
import { apiFetch, apiFetchForm } from "../_lib/api";
import type { Summary } from "../_lib/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SummarizerPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"upload" | "paste">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Summary | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<Summary[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/apps/vakilai/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setHistoryLoading(true);
      apiFetch<Summary[]>("/api/summarizer")
        .then(setHistory)
        .catch(() => {})
        .finally(() => setHistoryLoading(false));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "upload" && !file) { setError("Please select a PDF file."); return; }
    if (mode === "paste" && !text.trim()) { setError("Please paste the judgment text."); return; }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const fd = new FormData();
      if (mode === "upload" && file) {
        fd.append("file", file);
      } else {
        fd.append("text", text);
      }
      const data = await apiFetchForm<Summary>("/api/summarizer", fd);
      setResult(data);
      setHistory((prev) => [data, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Summarization failed.";
      if (msg.includes("402") || msg.toLowerCase().includes("api key")) {
        setError("OpenAI API key not configured. Please add it in Settings.");
      } else if (msg.includes("413")) {
        setError("File too large. Maximum allowed size is 10MB.");
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
            <BookOpen className="w-6 h-6 text-emerald-600" />
            Judgment Summarizer
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Upload a PDF or paste judgment text — get a structured summary in your preferred language (
            {user.preferred_language}).
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              {/* Mode toggle */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setMode("upload")}
                  className={`flex-1 text-sm py-2 rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                    mode === "upload" ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-300 text-gray-600 hover:border-emerald-400"
                  }`}
                >
                  <Upload className="w-4 h-4" /> Upload PDF
                </button>
                <button
                  type="button"
                  onClick={() => setMode("paste")}
                  className={`flex-1 text-sm py-2 rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                    mode === "paste" ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-300 text-gray-600 hover:border-emerald-400"
                  }`}
                >
                  <FileText className="w-4 h-4" /> Paste Text
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "upload" ? (
                  <div>
                    {file ? (
                      <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 rounded-lg px-4 py-3">
                        <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">{file.name}</div>
                          <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                        <button type="button" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}>
                          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 font-medium">Click to upload PDF</p>
                        <p className="text-xs text-gray-400 mt-1">Maximum 10MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setFile(f);
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Judgment Text</label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Paste the full judgment text here..."
                      rows={10}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1">{text.length} characters</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || (mode === "upload" && !file) || (mode === "paste" && !text.trim())}
                  className="w-full bg-emerald-600 text-white font-semibold py-2.5 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4 h-4" />
                      Generate Summary
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

            {result && <SummaryResult summary={result} lang={user.preferred_language} />}
          </div>

          {/* Right: History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h2 className="font-semibold text-gray-800 text-sm mb-3">Recent Summaries</h2>
              {historyLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <p className="text-gray-400 text-xs text-center py-6">No summaries yet</p>
              ) : (
                <div className="space-y-1">
                  {history.map((item) => (
                    <Link
                      key={item.id}
                      href={`/apps/vakilai/summarizer/${item.id}`}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{item.case_name || "Untitled"}</div>
                        <div className="text-xs text-gray-400 truncate">{item.court} · {item.judgment_date}</div>
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

function SummaryResult({ summary, lang }: { summary: Summary; lang: string }) {
  return (
    <div className="bg-white rounded-xl border border-emerald-200 p-5 space-y-4">
      <div className="flex items-start justify-between">
        <h2 className="font-bold text-gray-900 text-lg leading-tight">{summary.case_name}</h2>
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
          {lang}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-0.5">Court</div>
          <div className="font-medium text-gray-800">{summary.court || "—"}</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-400 mb-0.5">Date</div>
          <div className="font-medium text-gray-800">{summary.judgment_date || "—"}</div>
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Key Holding</div>
        <p className="text-sm text-gray-800 leading-relaxed">{summary.key_holding}</p>
      </div>

      {summary.sections_cited && (
        <div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Sections Cited</div>
          <p className="text-sm text-gray-700">{summary.sections_cited}</p>
        </div>
      )}

      <div>
        <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Full Summary</div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{summary.summary_text}</p>
      </div>

      <div className="flex justify-end">
        <Link
          href={`/apps/vakilai/summarizer/${summary.id}`}
          className="text-xs text-emerald-600 hover:underline"
        >
          View full page →
        </Link>
      </div>
    </div>
  );
}
