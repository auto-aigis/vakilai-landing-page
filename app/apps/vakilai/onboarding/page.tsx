"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Scale,
  Zap,
  FileText,
  ArrowRight,
  Download,
  CheckCircle,
  Send,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../_components/AuthProvider";
import { apiFetch } from "../_lib/api";
import type { SectionLookup, Petition, ActivationStatus } from "../_lib/api";

// ─── Practice-area seed data ────────────────────────────────────────────────
// Maps bar council states to a pre-seeded IPC section relevant to local
// district court practice. Falls back to IPC 302 for unknown states.
const STATE_SEED: Record<string, { section: string; act: string; label: string }> = {
  Telangana: { section: "420", act: "IPC", label: "IPC 420 — Cheating (most common in Hyderabad district courts)" },
  "Andhra Pradesh": { section: "420", act: "IPC", label: "IPC 420 — Cheating" },
  "Uttar Pradesh": { section: "498A", act: "IPC", label: "IPC 498A — Cruelty (high filing rate in UP)" },
  Delhi: { section: "138", act: "Evidence Act", label: "Evidence Act 138 — Cross-examination" },
  Maharashtra: { section: "406", act: "IPC", label: "IPC 406 — Criminal breach of trust" },
  Gujarat: { section: "138", act: "Evidence Act", label: "Evidence Act 138 — Cross-examination" },
  Karnataka: { section: "302", act: "IPC", label: "IPC 302 — Murder (Sessions Court)" },
  Kerala: { section: "307", act: "IPC", label: "IPC 307 — Attempt to murder" },
  "Tamil Nadu": { section: "420", act: "IPC", label: "IPC 420 — Cheating" },
  "West Bengal": { section: "302", act: "IPC", label: "IPC 302 — Murder" },
  "Punjab & Haryana": { section: "302", act: "IPC", label: "IPC 302 — Murder" },
  Haryana: { section: "498A", act: "IPC", label: "IPC 498A — Cruelty" },
  Rajasthan: { section: "302", act: "IPC", label: "IPC 302 — Murder" },
  "Madhya Pradesh": { section: "376", act: "IPC", label: "IPC 376 — Rape" },
  Bihar: { section: "302", act: "IPC", label: "IPC 302 — Murder" },
  Jharkhand: { section: "302", act: "IPC", label: "IPC 302 — Murder" },
  Odisha: { section: "302", act: "IPC", label: "IPC 302 — Murder" },
  Chhattisgarh: { section: "302", act: "IPC", label: "IPC 302 — Murder" },
  Assam: { section: "302", act: "IPC", label: "IPC 302 — Murder" },
};

const DEFAULT_SEED = {
  section: "302",
  act: "IPC",
  label: "IPC 302 — Murder (most common district court section)",
};

function getSeed(state: string | null) {
  if (!state) return DEFAULT_SEED;
  return STATE_SEED[state] ?? DEFAULT_SEED;
}

function whatsappShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-8">
      <div className={`flex items-center gap-1.5 text-sm font-semibold ${step >= 1 ? "text-indigo-700" : "text-gray-400"}`}>
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            step > 1 ? "bg-green-500 text-white" : step === 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"
          }`}
        >
          {step > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
        </div>
        Section Lookup
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300" />
      <div className={`flex items-center gap-1.5 text-sm font-semibold ${step >= 2 ? "text-indigo-700" : "text-gray-400"}`}>
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
            step === 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-400"
          }`}
        >
          2
        </div>
        Petition Stub
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [lookup, setLookup] = useState<SectionLookup | null>(null);
  const [petition, setPetition] = useState<Petition | null>(null);

  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [petitionLoading, setPetitionLoading] = useState(false);
  const [petitionError, setPetitionError] = useState("");

  const [activating, setActivating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [shared, setShared] = useState(false);

  // Guard: redirect unauthenticated users; skip gate if already activated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/apps/vakilai/login");
      return;
    }
    if (user) {
      apiFetch<ActivationStatus>("/api/onboarding/status")
        .then((s) => {
          if (s.is_activated) {
            router.replace("/apps/vakilai/dashboard");
          }
        })
        .catch(() => {});
    }
  }, [user, authLoading, router]);

  // Step 1: auto-run seeded BNS lookup when user loads
  const runLookup = useCallback(async () => {
    if (!user || lookup) return;
    const seed = getSeed(user.bar_council_state);
    setLookupLoading(true);
    setLookupError("");
    try {
      const data = await apiFetch<SectionLookup>("/api/mapper", {
        method: "POST",
        body: JSON.stringify({ old_section: seed.section, old_act: seed.act }),
      });
      setLookup(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Lookup failed.";
      if (msg.includes("402") || msg.toLowerCase().includes("api key")) {
        setLookupError("OpenAI API key not configured — please add it in Settings, then return here.");
      } else {
        setLookupError(msg);
      }
    } finally {
      setLookupLoading(false);
    }
  }, [user, lookup]);

  useEffect(() => {
    if (user && !lookup && !lookupLoading) {
      runLookup();
    }
  }, [user, lookup, lookupLoading, runLookup]);

  // Step 2: auto-generate petition stub from the lookup result
  const runPetition = useCallback(async () => {
    if (!lookup || petition) return;
    setPetitionLoading(true);
    setPetitionError("");
    try {
      const partyNames = `Petitioner: ${user?.full_name || "Advocate's Client"}, Respondent: State`;
      const keyFacts =
        `Matter involves ${lookup.old_act} Section ${lookup.old_section} ` +
        `(now ${lookup.new_act || "BNS"} Section ${lookup.new_section || "—"}). ` +
        lookup.explanation.slice(0, 300);
      const data = await apiFetch<Petition>("/api/petition", {
        method: "POST",
        body: JSON.stringify({ matter_type: "bail", party_names: partyNames, key_facts: keyFacts }),
      });
      setPetition(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed.";
      if (msg.includes("402") || msg.toLowerCase().includes("api key")) {
        setPetitionError("OpenAI API key not configured — please add it in Settings, then return here.");
      } else {
        setPetitionError(msg);
      }
    } finally {
      setPetitionLoading(false);
    }
  }, [lookup, petition, user]);

  const handleProceedToStep2 = () => {
    setStep(2);
    if (!petition && !petitionLoading) {
      runPetition();
    }
  };

  // Record activation and go to dashboard
  const handleActivate = useCallback(async () => {
    if (!lookup || !petition) return;
    setActivating(true);
    try {
      await apiFetch<ActivationStatus>("/api/onboarding/activate", {
        method: "POST",
        body: JSON.stringify({ lookup_id: lookup.id, petition_id: petition.id }),
      });
    } catch {
      // best-effort; don't block the user
    } finally {
      setActivating(false);
      router.push("/apps/vakilai/dashboard");
    }
  }, [lookup, petition, router]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

  const handleDownload = () => {
    if (!petition) return;
    window.open(`${API_URL}/api/petition/${petition.id}/download?fmt=txt`, "_blank");
    setDownloaded(true);
  };

  const handleWhatsApp = () => {
    if (!petition) return;
    const snippet = petition.draft_text.slice(0, 600) + (petition.draft_text.length > 600 ? "..." : "");
    const msg = `[VakilAI — Petition Stub]\n\n${snippet}\n\nGenerated via VakilAI: https://vakilai-landing-page.onrender.com`;
    window.open(whatsappShareUrl(msg), "_blank");
    setShared(true);
  };

  const canFinish = downloaded || shared;

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  const seed = getSeed(user.bar_council_state);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 px-4 py-10">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 text-indigo-700 font-bold text-xl mb-3">
            <Scale className="w-6 h-6" />
            VakilAI
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-snug">
            Your practice is <span className="text-indigo-600">almost ready</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
            Complete two quick steps to unlock your dashboard and experience the full power of VakilAI.
          </p>
        </div>

        <StepIndicator step={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Step 1 — BNS Section Lookup</h2>
                <p className="text-xs text-gray-500">
                  Auto-selected for {user.bar_council_state || "your state"}
                </p>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-4">
              <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">
                Pre-seeded section
              </p>
              <p className="text-sm font-semibold text-indigo-800">{seed.label}</p>
            </div>

            {lookupLoading && (
              <div className="flex items-center gap-3 text-indigo-700 bg-indigo-50 rounded-xl p-4">
                <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Running BNS lookup…</p>
                  <p className="text-xs text-indigo-500 mt-0.5">
                    Mapping {seed.act} §{seed.section} → new code with AI explanation
                  </p>
                </div>
              </div>
            )}

            {lookupError && !lookupLoading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                <p className="font-semibold mb-1">Lookup failed</p>
                <p>{lookupError}</p>
                <button
                  onClick={runLookup}
                  className="mt-3 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Retry →
                </button>
              </div>
            )}

            {lookup && !lookupLoading && (
              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-xl p-4 flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500">{lookup.old_act}</div>
                    <div className="text-xl font-bold text-gray-800">§{lookup.old_section}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <div className="text-center">
                    <div className="text-xs text-gray-500">{lookup.new_act || "BNS"}</div>
                    <div className="text-xl font-bold text-indigo-700">
                      §{lookup.new_section || "—"}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Mapped
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    AI Explanation ({user.preferred_language})
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
                    {lookup.explanation}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800 font-medium">
                    Step 1 complete — BNS lookup done ✓
                  </p>
                </div>

                <button
                  onClick={handleProceedToStep2}
                  className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Step 2
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Step 2 — Your First Petition Stub</h2>
                <p className="text-xs text-gray-500">
                  Auto-generated from the section mapping above
                </p>
              </div>
            </div>

            {lookup && (
              <div className="flex items-center gap-2 text-xs bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-800 font-medium">
                  {lookup.old_act} §{lookup.old_section} → {lookup.new_act} §{lookup.new_section} mapped
                </span>
              </div>
            )}

            {petitionLoading && (
              <div className="flex items-center gap-3 text-amber-700 bg-amber-50 rounded-xl p-4">
                <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Generating petition stub…</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    AI drafting a court-ready bail petition in English
                    {user.preferred_language !== "English" ? ` + ${user.preferred_language} summary` : ""}
                  </p>
                </div>
              </div>
            )}

            {petitionError && !petitionLoading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                <p className="font-semibold mb-1">Generation failed</p>
                <p>{petitionError}</p>
                <button
                  onClick={runPetition}
                  className="mt-3 text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Retry →
                </button>
              </div>
            )}

            {petition && !petitionLoading && (
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Generated Petition (preview)
                  </p>
                  <pre className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-700 max-h-48 overflow-y-auto whitespace-pre-wrap font-sans leading-relaxed">
                    {petition.draft_text.slice(0, 800)}
                    {petition.draft_text.length > 800 ? "\n…[truncated]" : ""}
                  </pre>
                </div>

                {petition.regional_summary && user.preferred_language !== "English" && (
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                      {user.preferred_language} Summary
                    </p>
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-gray-800 leading-relaxed line-clamp-3">
                      {petition.regional_summary}
                    </div>
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-amber-800 mb-1">
                    Download or share this stub to complete activation
                  </p>
                  <p className="text-xs text-amber-700">
                    Choose at least one option below. Your dashboard unlocks immediately after.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                      downloaded
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:border-indigo-400 hover:text-indigo-700"
                    }`}
                  >
                    {downloaded ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Downloaded ✓
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download .txt
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                      shared
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white border-gray-300 text-gray-700 hover:border-green-400 hover:text-green-700"
                    }`}
                  >
                    {shared ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Shared ✓
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Share via WhatsApp
                      </>
                    )}
                  </button>
                </div>

                {canFinish && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3">
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-800 font-medium">
                        Both steps complete — you&apos;re activated! 🎉
                      </p>
                    </div>
                    <button
                      onClick={handleActivate}
                      disabled={activating}
                      className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3.5 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-60"
                    >
                      {activating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Setting up your dashboard…
                        </>
                      ) : (
                        <>
                          Go to My Dashboard
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-6">
          This activation is a one-time step. Your dashboard stays unlocked permanently.
        </p>
      </div>
    </div>
  );
}
