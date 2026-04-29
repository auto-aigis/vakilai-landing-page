"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, ArrowLeft, Download, ArrowRight, AlertCircle } from "lucide-react";
import Navbar from "../../_components/Navbar";
import { useAuth } from "../../_components/AuthProvider";
import { apiFetch } from "../../_lib/api";
import type { SectionLookup } from "../../_lib/api";

export default function MapperDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [data, setData] = useState<SectionLookup | null>(null);
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
      apiFetch<SectionLookup>(`/api/mapper/${id}`)
        .then(setData)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [user, id]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

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
          href="/apps/vakilai/mapper"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Mapper
        </Link>

        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-indigo-600" />
          Section Lookup Result
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
            {/* Mapping card */}
            <div className="bg-white rounded-xl border border-indigo-200 p-5">
              <div className="bg-indigo-50 rounded-lg p-4 flex items-center gap-6 mb-5">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-0.5">{data.old_act}</div>
                  <div className="text-2xl font-bold text-gray-800">§ {data.old_section}</div>
                </div>
                <ArrowRight className="w-6 h-6 text-indigo-400 flex-shrink-0" />
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-0.5">{data.new_act || "—"}</div>
                  <div className="text-2xl font-bold text-indigo-700">§ {data.new_section || "Not mapped"}</div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Plain-Language Explanation</h2>
                <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{data.explanation}</p>
              </div>
            </div>

            {/* Stub template */}
            {data.stub_template_text && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Stub Petition Template</h2>
                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-600 overflow-auto max-h-64 whitespace-pre-wrap font-mono">
                  {data.stub_template_text}
                </pre>
                <div className="flex gap-2 mt-3">
                  <a
                    href={`${API_URL}/api/mapper/${data.id}/download?fmt=txt`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .txt
                  </a>
                  <a
                    href={`${API_URL}/api/mapper/${data.id}/download?fmt=docx`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download .docx
                  </a>
                </div>
              </div>
            )}

            <div className="text-xs text-gray-400 text-right">
              Looked up on {new Date(data.created_at).toLocaleString("en-IN")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
