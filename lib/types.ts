export type WeightGoal = '2-4' | '5-7' | '8-10' | '10+';
export type FastingExperience = 'nunca' | 'tentou' | 'experiente';
export type MorningHunger = 'sim' | 'as_vezes' | 'nao';
export type LastMealTime = 18 | 19 | 20 | 21;

export interface UserProfile {
  name: string;
  email: string;
  weightGoal: WeightGoal;
  fastingExperience: FastingExperience;
  morningHunger: MorningHunger;
  lastMealTime: LastMealTime;
  createdAt: string; // ISO
}

export interface ScheduledDay {
  day: number;
  hours: number;
  eatingHours: number;
  phaseName: string;
  isOptional18hAllowed: boolean;
}

export interface GeneratedPlan {
  name: string;
  duration: number; // 21, 28, 35, 42
  weightGoal: WeightGoal;
  lastMealTime: LastMealTime;
  morningHunger: MorningHunger;
  dailySchedule: ScheduledDay[];
}

export interface FastingSession {
  id: string;
  startISO: string;
  endISO: string | null;
  targetHours: number;
}

export interface DayLog {
  date: string;                  // YYYY-MM-DD
  weightKg?: number;
  fastCompleted: boolean;
  note?: string;
}

export interface AppState {
  profile: UserProfile | null;
  plan: GeneratedPlan | null;
  currentFast: FastingSession | null;
  fastHistory: FastingSession[];
  dayLogs: DayLog[];
  finalPhaseChoice: '16' | '18' | null; // Guardará a escolha entre manter 16h ou subir para 18h no final dos planos longos
}
