// Helper unique d'inscription newsletter — passe par l'Edge Function
// subscribe-newsletter (audit sécu 2026-06-16, finding H1).
//
// Avant : 5 surfaces front faisaient un INSERT direct dans la table
// newsletter_subscribers via la clé anon publique → email bombing trivial,
// pas de rate-limit, pas de captcha.
//
// Maintenant : un seul point d'entrée, validation + rate-limit côté serveur.

import { supabase } from "@/integrations/supabase/client";

export type SubscribeSource =
  | "landing"
  | "blog-article"
  | "diagnostic"
  | "changelog"
  | "generateur"
  | string;

export interface SubscribeResult {
  ok: boolean;
  /** Erreur traduite côté UI (jamais un message brut serveur). */
  error?: string;
}

/** Inscrit un email à la newsletter. Idempotent. */
export async function subscribeNewsletter(
  email: string,
  source: SubscribeSource,
  honeypot?: string,
): Promise<SubscribeResult> {
  const value = email.trim();
  if (!value) return { ok: false, error: "Email requis." };

  try {
    const { data, error } = await supabase.functions.invoke<{ success: boolean; error?: string }>(
      "subscribe-newsletter",
      { body: { email: value, source, website: honeypot ?? "" } },
    );
    if (error) {
      return { ok: false, error: "Inscription momentanément indisponible." };
    }
    if (data?.success === false) {
      return { ok: false, error: data.error ?? "Inscription momentanément indisponible." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Inscription momentanément indisponible." };
  }
}
