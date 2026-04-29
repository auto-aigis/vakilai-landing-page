"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Settings, Key, Eye, EyeOff, Trash2, Check, AlertCircle, User, Save } from "lucide-react";
import Navbar from "../_components/Navbar";
import { useAuth } from "../_components/AuthProvider";
import { apiFetch } from "../_lib/api";
import type { ApiKeyStatus, User as UserType } from "../_lib/api";

const BAR_COUNCIL_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab & Haryana", "Rajasthan",
  "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

export default function SettingsPage() {
  const { user, loading: authLoading, refresh } = useAuth();
  const router = useRouter();

  // API key state
  const [keyStatus, setKeyStatus] = useState<ApiKeyStatus | null>(null);
  const [newKey, setNewKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [keySaving, setKeySaving] = useState(false);
  const [keyDeleting, setKeyDeleting] = useState(false);
  const [keyMsg, setKeyMsg] = useState("");
  const [keyError, setKeyError] = useState("");

  // Profile state
  const [profile, setProfile] = useState({ full_name: "", bar_council_state: "", preferred_language: "English" as "English" | "Telugu" | "Hindi" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/apps/vakilai/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setProfile({
        full_name: user.full_name || "",
        bar_council_state: user.bar_council_state || "",
        preferred_language: user.preferred_language,
      });
      apiFetch<ApiKeyStatus>("/api/settings/apikey")
        .then(setKeyStatus)
        .catch(() => {});
    }
  }, [user]);

  const handleSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.startsWith("sk-")) {
      setKeyError("API key must start with 'sk-'");
      return;
    }
    setKeyError("");
    setKeyMsg("");
    setKeySaving(true);
    try {
      const res = await apiFetch<ApiKeyStatus & { message: string }>("/api/settings/apikey", {
        method: "POST",
        body: JSON.stringify({ api_key: newKey }),
      });
      setKeyStatus(res);
      setKeyMsg(res.message || "API key saved.");
      setNewKey("");
    } catch (err: unknown) {
      setKeyError(err instanceof Error ? err.message : "Failed to save key.");
    } finally {
      setKeySaving(false);
    }
  };

  const handleDeleteKey = async () => {
    if (!confirm("Remove the stored OpenAI API key? AI features will stop working.")) return;
    setKeyError("");
    setKeyMsg("");
    setKeyDeleting(true);
    try {
      const res = await apiFetch<ApiKeyStatus & { message: string }>("/api/settings/apikey", {
        method: "DELETE",
      });
      setKeyStatus(res);
      setKeyMsg(res.message || "API key removed.");
    } catch (err: unknown) {
      setKeyError(err instanceof Error ? err.message : "Failed to delete key.");
    } finally {
      setKeyDeleting(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileMsg("");
    setProfileSaving(true);
    try {
      await apiFetch<UserType>("/api/me", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      await refresh();
      setProfileMsg("Profile updated successfully.");
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setProfileSaving(false);
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
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
          <Settings className="w-5 h-5 text-gray-600" />
          Settings
        </h1>

        <div className="space-y-6">
          {/* Profile section */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
              <User className="w-4 h-4 text-indigo-500" />
              Profile
            </h2>

            {profileMsg && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> {profileMsg}
              </div>
            )}
            {profileError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {profileError}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Your full name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bar Council State</label>
                <select
                  value={profile.bar_council_state}
                  onChange={(e) => setProfile({ ...profile, bar_council_state: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="">Select state...</option>
                  {BAR_COUNCIL_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
                <div className="flex gap-2">
                  {(["English", "Telugu", "Hindi"] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setProfile({ ...profile, preferred_language: lang })}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                        profile.preferred_language === lang
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-300 text-gray-700 hover:border-indigo-400"
                      }`}
                    >
                      {lang === "Telugu" ? "తెలుగు" : lang === "Hindi" ? "हिन्दी" : "English"}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1">AI responses will be generated in this language.</p>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {user.email && <span>Email: {user.email}</span>}
                    {user.phone && <span>Phone: {user.phone}</span>}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {profileSaving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>

          {/* API Key section */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-amber-500" />
              OpenAI API Key
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Required for all AI features (summarizer, section mapper, petition generator).{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Get your key →
              </a>
            </p>

            {keyMsg && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                <Check className="w-4 h-4" /> {keyMsg}
              </div>
            )}
            {keyError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {keyError}
              </div>
            )}

            {/* Current key status */}
            {keyStatus && (
              <div className="mb-4 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${keyStatus.has_key ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className="text-sm text-gray-700">
                    {keyStatus.has_key ? (
                      <>
                        API key stored:{" "}
                        <code className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">
                          {keyStatus.masked_key}
                        </code>
                      </>
                    ) : (
                      "No API key configured"
                    )}
                  </span>
                </div>
                {keyStatus.has_key && (
                  <button
                    onClick={handleDeleteKey}
                    disabled={keyDeleting}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 transition-colors disabled:opacity-60"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {keyDeleting ? "Removing..." : "Remove"}
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSaveKey} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {keyStatus?.has_key ? "Update API Key" : "Add API Key"}
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    placeholder="sk-proj-..."
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Your key is encrypted at rest and never returned in plain text.</p>
              </div>

              <button
                type="submit"
                disabled={keySaving || !newKey}
                className="flex items-center gap-2 bg-amber-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-60"
              >
                <Key className="w-4 h-4" />
                {keySaving ? "Saving..." : keyStatus?.has_key ? "Update Key" : "Save Key"}
              </button>
            </form>
          </div>

          {/* Trial info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Trial Status</h2>
            <div className="flex items-center gap-3">
              <div
                className={`text-2xl font-bold ${
                  user.trial_days_remaining <= 5 ? "text-red-600" : user.trial_days_remaining <= 10 ? "text-amber-600" : "text-green-600"
                }`}
              >
                {user.trial_days_remaining}
              </div>
              <div className="text-sm text-gray-600">days remaining in your free trial</div>
            </div>
            <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  user.trial_days_remaining <= 5 ? "bg-red-500" : user.trial_days_remaining <= 10 ? "bg-amber-500" : "bg-green-500"
                }`}
                style={{ width: `${Math.min(100, (user.trial_days_remaining / 30) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">30-day trial. Payment/upgrade coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
