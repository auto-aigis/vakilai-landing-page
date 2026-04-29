const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    let detail = `API error: ${res.status}`;
    try {
      const body = await res.json();
      if (body.detail) detail = body.detail;
    } catch {}
    const err = new Error(detail) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export async function apiFetchForm<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  if (!res.ok) {
    let detail = `API error: ${res.status}`;
    try {
      const body = await res.json();
      if (body.detail) detail = body.detail;
    } catch {}
    const err = new Error(detail) as Error & { status: number };
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export function getDownloadUrl(path: string): string {
  return `${API_URL}${path}`;
}

// Types

export interface User {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  bar_council_state: string | null;
  preferred_language: "Telugu" | "Hindi" | "English";
  trial_days_remaining: number;
  is_activated?: boolean;
}

export interface ActivationStatus {
  is_activated: boolean;
  lookup_id: string | null;
  petition_id: string | null;
  activated_at: string | null;
}


export interface SectionLookup {
  id: string;
  old_section: string;
  old_act: string;
  new_section: string | null;
  new_act: string | null;
  explanation: string;
  stub_template_text: string;
  created_at: string;
}

export interface Summary {
  id: string;
  source_type: "pdf" | "text";
  case_name: string;
  court: string;
  judgment_date: string;
  key_holding: string;
  sections_cited: string;
  summary_text: string;
  created_at: string;
}

export interface Petition {
  id: string;
  matter_type: "bail" | "legal_notice" | "cheque_bounce";
  party_names: string;
  key_facts: string;
  draft_text: string;
  regional_summary: string;
  created_at: string;
}

export interface DashboardData {
  trial_days_remaining: number;
  recent_summaries: Array<{
    id: string;
    case_name: string;
    court: string;
    judgment_date: string;
    created_at: string;
  }>;
  recent_lookups: Array<{
    id: string;
    old_section: string;
    old_act: string;
    new_section: string | null;
    new_act: string | null;
    created_at: string;
  }>;
  recent_petitions: Array<{
    id: string;
    matter_type: string;
    party_names: string;
    created_at: string;
  }>;
}

export interface ApiKeyStatus {
  has_key: boolean;
  masked_key: string | null;
}
