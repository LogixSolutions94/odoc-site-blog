// Client Supabase côté landing.
//
// Tolérant aux env vars manquantes (post-mortem 17/06) : si VITE_SUPABASE_URL
// ou VITE_SUPABASE_PUBLISHABLE_KEY n'est pas injecté au build (oubli .env,
// .dockerignore qui mange .env, etc.), on retombe sur des constantes
// publiques par défaut au lieu de jeter au module load. Sans ce filet,
// `createClient(undefined, undefined)` explose et toute page qui importe
// supabase devient un écran noir (la page /fonctionnalites, qui ne touche
// pas supabase, restait seule debout). Voir HANDOFF_SECURITY_2026-06-16.
//
// Les valeurs sont VOLONTAIREMENT publiques (clé anon = JWT public par
// design, URL = sous-domaine public). Ne rien mettre de secret ici.

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const FALLBACK_URL = 'https://api.odocpilot.com';
const FALLBACK_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgwNTMyMDQ2LCJleHAiOjQ5MTk3MDA0ODB9.TA4krWhaC4us2hA8Dz-GLUxUuxZ-IPKo92P24X6_9_E';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || FALLBACK_ANON_KEY;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  // Pas de throw — on log et on continue avec les fallbacks publics.
  // Un throw ici cascaderait en écran noir sur toute page qui touche supabase.
  // eslint-disable-next-line no-console
  console.warn(
    '[supabase] VITE_SUPABASE_URL/VITE_SUPABASE_PUBLISHABLE_KEY absents du build — fallback sur valeurs publiques. Vérifier l\'injection des ARG dans le Dockerfile.',
  );
}

// Use memory storage instead of localStorage to avoid sandbox/iframe blocking issues
const memoryStorage: Record<string, string> = {};
const customStorage = {
  getItem: (key: string) => memoryStorage[key] ?? null,
  setItem: (key: string, value: string) => { memoryStorage[key] = value; },
  removeItem: (key: string) => { delete memoryStorage[key]; },
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: customStorage,
    persistSession: false,
    autoRefreshToken: true,
  }
});
