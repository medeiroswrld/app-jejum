'use client';
import { useState, useEffect, useCallback } from 'react';
import type { AppState } from './types';

const STORAGE_KEY = 'femreset_state_v1';

const emptyState: AppState = {
  profile: null,
  plan: null,
  currentFast: null,
  fastHistory: [],
  dayLogs: [],
  finalPhaseChoice: null,
};

function loadState(): AppState {
  if (typeof window === 'undefined') return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed = JSON.parse(raw);
    return {
      profile: parsed?.profile || null,
      plan: parsed?.plan || null,
      currentFast: parsed?.currentFast || null,
      fastHistory: Array.isArray(parsed?.fastHistory) ? parsed.fastHistory : [],
      dayLogs: Array.isArray(parsed?.dayLogs) ? parsed.dayLogs : [],
      finalPhaseChoice: parsed?.finalPhaseChoice || null,
    };
  } catch {
    return emptyState;
  }
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(emptyState);
  const [hydrated, setHydrated] = useState(false);

  // Carrega do localStorage só no cliente (evita mismatch de SSR)
  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  // Salva a cada mudança
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* localStorage cheio ou indisponível — ignora no MVP */
    }
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(emptyState);
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  return { state, update, reset, hydrated };
}
