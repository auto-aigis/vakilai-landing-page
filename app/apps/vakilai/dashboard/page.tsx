"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, BookOpen, FileText, Clock, ChevronRight, AlertCircle, Key } from "lucide-react";
import Navbar from "../_components/Navbar";
import { useAuth } from "../_components/AuthProvider";
import { apiFetch } from "../_lib/api";
import type { DashboardData } from "../_lib/api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function matterLabel(type: string) {
  return type === "bail" ? "Bail" : type === "legal_notice" ? "Legal Notice" : type === "cheque_bounce" ? "Cheque Bounce" : type;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/apps/vakilai/login");
    }
  }, [user, authLoading, router]);

  // Guard: redirect non-activated users to onboarding
  useEffect(() => {
    if (user) {
      apiFetch<{ is_activated: boolean }>("/api/onboarding/status")
        .then((s) => {
          if (!s.is_activated) {
            router.replace("/apps/vakilai/onboarding");
          }
        })
        .catch(() => {}); // if backend unreachable, let dashboard load normally
    }
  }, [user, router]);

  useEffect(() => {
    if (user) {
      apiFetch<DashboardData>("/api/dashboard")
        .then(setData)
        .catch((e) => setError(e.message));
    }
  }, [user]);


  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading...</div>
      </div>
    );
  }

  const trialColor =
    (data?.trial_days_remaining ?? user.trial_days_remaining) <= 5
      ? "bg-red-50 border-red-200 text-red-700"
      : (data?.trial_days_remaining ?? user.trial_days_remaining) <= 10
      ? "bg-amber-50 border-amber-200 text-amber-700"
      : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Welcome, {user.full_name || "Advocate"}
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">{user.bar_council_state || "Your legal workspace"}</p>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium border ${trialColor}`}>
            <Clock className="w-4 h-4" />
            {data?.trial_days_remaining ?? user.trial_days_remaining} days trial remaining
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Link
            href="/apps/vakilai/mapper"
            className="bg-indigo-600 text-white rounded-xl p-5 hover:bg-indigo-700 transition-colors group"
          >
            <Zap className="w-6 h-6 mb-3 opacity-80" />
            <div className="font-semibold">Section Mapper</div>
            <div className="text-indigo-200 text-xs mt-1">IPC → BNS, CrPC → BNSS, Evidence → BSA</div>
          </Link>
          <Link
            href="/apps/vakilai/summarizer"
            className="bg-emerald-600 text-white rounded-xl p-5 hover:bg-emerald-700 transition-colors group"
          >
            <BookOpen className="w-6 h-6 mb-3 opacity-80" />
            <div className="font-semibold">Judgment Summarizer</div>
            <div className="text-emerald-200 text-xs mt-1">Upload PDF or paste judgment text</div>
          </Link>
          <Link
            href="/apps/vakilai/petition"
            className="bg-amber-500 text-white rounded-xl p-5 hover:bg-amber-600 transition-colors group"
          >
            <FileText className="w-6 h-6 mb-3 opacity-80" />
            <div className="font-semibold">Petition Draft</div>
            <div className="text-amber-100 text-xs mt-1">Bail, Legal Notice, Cheque Bounce</div>
          </Link>
        </div>

        {/* API key warning */}
        {data && (
          <ApiKeyBanner />
        )}

        {/* Recent activity */}
        {!data ? (
          <div className="grid md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Recent Lookups */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-500" /> Section Lookups
                </h2>
                <Link href="/apps/vakilai/mapper" className="text-xs text-indigo-600 hover:underline">View all</Link>
              </div>
              {data.recent_lookups.length === 0 ? (
                <EmptyState label="No lookups yet" href="/apps/vakilai/mapper" cta="Try mapper →" />
              ) : (
                <div className="space-y-2">
                  {data.recent_lookups.map((item) => (
                    <Link
                      key={item.id}
                      href={`/apps/vakilai/mapper/${item.id}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-800">
                          {item.old_act} §{item.old_section}
                          {item.new_section && <span className="text-gray-400 mx-1">→</span>}
                          {item.new_section && <span className="text-indigo-700">{item.new_act} §{item.new_section}</span>}
                        </div>
                        <div className="text-xs text-gray-400">{formatDate(item.created_at)}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Summaries */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" /> Summaries
                </h2>
                <Link href="/apps/vakilai/summarizer" className="text-xs text-emerald-600 hover:underline">View all</Link>
              </div>
              {data.recent_summaries.length === 0 ? (
                <EmptyState label="No summaries yet" href="/apps/vakilai/summarizer" cta="Summarize judgment →" />
              ) : (
                <div className="space-y-2">
                  {data.recent_summaries.map((item) => (
                    <Link
                      key={item.id}
                      href={`/apps/vakilai/summarizer/${item.id}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{item.case_name || "Untitled"}</div>
                        <div className="text-xs text-gray-400">{item.court} · {item.judgment_date}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Petitions */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-500" /> Petition Drafts
                </h2>
                <Link href="/apps/vakilai/petition" className="text-xs text-amber-600 hover:underline">View all</Link>
              </div>
              {data.recent_petitions.length === 0 ? (
                <EmptyState label="No drafts yet" href="/apps/vakilai/petition" cta="Generate petition →" />
              ) : (
                <div className="space-y-2">
                  {data.recent_petitions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/apps/vakilai/petition/${item.id}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">
                          <span className="inline-block bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded mr-1">
                            {matterLabel(item.matter_type)}
                          </span>
                          {item.party_names}
                        </div>
                        <div className="text-xs text-gray-400">{formatDate(item.created_at)}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ label, href, cta }: { label: string; href: string; cta: string }) {
  return (
    <div className="text-center py-6">
      <p className="text-gray-400 text-xs mb-2">{label}</p>
      <Link href={href} className="text-indigo-600 text-xs hover:underline">{cta}</Link>
    </div>
  );
}

function ApiKeyBanner() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    apiFetch<{ has_key: boolean; masked_key: string | null }>("/api/settings/apikey")
      .then((d) => setHasKey(d.has_key))
      .catch(() => setHasKey(null));
  }, []);

  if (hasKey === null || hasKey === true) return null;

  return (
    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-amber-800 text-sm">
        <Key className="w-4 h-4 flex-shrink-0" />
        <span>OpenAI API key not configured — AI features require it to work.</span>
      </div>
      <Link
        href="/apps/vakilai/settings"
        className="text-xs bg-amber-600 text-white px-3 py-1.5 rounded-lg hover:bg-amber-700 flex-shrink-0"
      >
        Add Key
      </Link>
    </div>
  );
}
