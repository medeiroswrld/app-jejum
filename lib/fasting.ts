import type { FastingSession } from './types';

export interface Stage {
  fromHours: number;
  label: string;
  desc: string;
}

// Estágios baseados em tempo decorrido. Linguagem cuidadosa: "muitas pessoas
// relatam", "começa a" — sem promessas médicas absolutas.
export const FASTING_STAGES: Stage[] = [
  { fromHours: 0,  label: 'Digestão',
    desc: 'Seu corpo está processando a última refeição.' },
  { fromHours: 4,  label: 'Estabilização',
    desc: 'A glicose no sangue começa a baixar e a se estabilizar.' },
  { fromHours: 8,  label: 'Transição',
    desc: 'As reservas de energia do fígado começam a ser utilizadas.' },
  { fromHours: 12, label: 'Queima de gordura',
    desc: 'O corpo passa a recorrer mais à gordura como fonte de energia.' },
  { fromHours: 16, label: 'Foco e leveza',
    desc: 'Muitas pessoas relatam mais clareza mental e disposição nesta fase.' },
];

export function elapsedHours(session: FastingSession, now: Date = new Date()): number {
  const start = new Date(session.startISO).getTime();
  const end = session.endISO ? new Date(session.endISO).getTime() : now.getTime();
  return Math.max(0, (end - start) / 3_600_000);
}

export function currentStage(hours: number): Stage {
  let stage = FASTING_STAGES[0];
  for (const s of FASTING_STAGES) if (hours >= s.fromHours) stage = s;
  return stage;
}

export function progressPct(session: FastingSession, now: Date = new Date()): number {
  const pct = (elapsedHours(session, now) / session.targetHours) * 100;
  return Math.min(100, Math.max(0, pct));
}

export function formatHM(hours: number): string {
  const totalMin = Math.floor(hours * 60);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${String(m).padStart(2, '0')}min`;
}

export function newSession(targetHours: number): FastingSession {
  return {
    id: crypto.randomUUID(),
    startISO: new Date().toISOString(),
    endISO: null,
    targetHours,
  };
}
