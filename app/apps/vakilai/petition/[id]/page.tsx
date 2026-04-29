"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, ArrowLeft, AlertCircle, Copy, Check, Download } from "lucide-react";
import Navbar from "../../_components/Navbar";
import { useAuth } from "../../_components/AuthProvider";
import { apiFetch } from "../../_lib/api";
import type { Petition } from "../../_lib/api";

function matterLabel(type: string) {
  return type === "bail" ? "Bail" : type === "legal_notice" ? "Legal Notice" : type === "cheque_bounce" ? "Cheque Bounce" : type;
}

export default function PetitionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [data, setData] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

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
      apiFetch<Petition>(`/api/petition/${id}`)
        .then(setData)
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [user, id]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const handleCopy = async () => {
    if (!data) return;
    const text = data.draft_text + (data.regional_summary ? "\n\n---\n" + data.regional_summary : "");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link
          href="/apps/vakilai/petition"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Petition Generator
        </Link>

        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-amber-500" />
          Petition Draft
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
            {/* Meta */}
            <div className="bg-white rounded-xl border border-amber-200 p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-amber-100 text-amber-700 text-sm font-semibold px-3 py-1 rounded-full">
                  {matterLabel(data.matter_type)}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 text-sm mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-0.5">Parties</div>
                  <div className="font-medium text-gray-800">{data.party_names}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-0.5">Key Facts</div>
                  <div className="text-gray-700 text-xs whitespace-pre-wrap">{data.key_facts}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Draft"}
                </button>
                <a
                  href={`${API_URL}/api/petition/${data.id}/download?fmt=txt`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download .txt
                </a>
                <a
                  href={`${API_URL}/api/petition/${data.id}/download?fmt=docx`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download .docx
                </a>
              </div>
            </div>

            {/* Draft text */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">English Draft</h2>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-700 overflow-auto whitespace-pre-wrap font-sans leading-relaxed">
                {data.draft_text}
              </pre>
            </div>

            {/* Regional summary */}
            {data.regional_summary && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">
                  Regional Language Summary
                </h2>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {data.regional_summary}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-400 text-right">
              Generated on {new Date(data.created_at).toLocaleString("en-IN")}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
