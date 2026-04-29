"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, ArrowLeft, AlertCircle } from "lucide-react";
import Navbar from "../../_components/Navbar";
import { useAuth } from "../../_components/AuthProvider";
import { apiFetch } from "../../_lib/api";
import type { Summary } from "../../_lib/api";

export default function SummaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/apps/vakilai/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && id) {
      apiFetch<Summary>(`/api/summarizer/${id}`)
        .then(setData)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [user, id]);

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
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link
          href="/apps/vakilai/summarizer"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Summarizer
        </Link>

        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Judgment Summary
        </h1>

        {loading && (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">
            Loading...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {data && (
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-emerald-200 p-5">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{data.case_name || "Untitled"}</h2>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">
                  {data.source_type === "pdf" ? "PDF" : "Text"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-0.5">Court</div>
                  <div className="font-medium text-gray-800">{data.court || "—"}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-0.5">Date of Judgment</div>
                  <div className="font-medium text-gray-800">{data.judgment_date || "—"}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Key Holding</div>
                  <p className="text-sm text-gray-800 leading-relaxed bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                    {data.key_holding}
                  </p>
                </div>

                {data.sections_cited && (
                  <div>
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Sections Cited</div>
                    <p className="text-sm text-gray-700">{data.sections_cited}</p>
                  </div>
                )}

                <div>
                  <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Full Summary</div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{data.summary_text}</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-400 text-right">
              Summarized on {new Date(data.created_at).toLocaleString("en-IN")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
