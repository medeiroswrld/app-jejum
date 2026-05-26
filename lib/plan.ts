import type { UserProfile, GeneratedPlan, ScheduledDay } from './types';

export function generatePlan(profile: UserProfile): GeneratedPlan {
  const { weightGoal, fastingExperience, lastMealTime, morningHunger } = profile;

  // 1. Determina a duração e o nome do plano com base na meta de peso
  let duration = 21;
  let name = 'Protocolo Foco Leve';

  if (weightGoal === '2-4') {
    duration = 21;
    name = 'Protocolo Foco Leve';
  } else if (weightGoal === '5-7') {
    duration = 28;
    name = 'Protocolo Evolução Constante';
  } else if (weightGoal === '8-10') {
    duration = 35;
    name = 'Protocolo Consolidação Avançada';
  } else if (weightGoal === '10+') {
    duration = 42; // Plan de 42 dias dividido em ciclos
    name = 'Protocolo Ciclos Intensivos';
  }

  // 2. Cria o cronograma básico dia a dia
  const dailySchedule: ScheduledDay[] = [];

  for (let day = 1; day <= duration; day++) {
    let baseHours = 12;
    let phaseName = 'Fase de Adaptação';
    let isOptional18hAllowed = false;

    // Regras de Horários e Fases Padrão (Baseadas na Duração/Meta)
    if (duration === 21) {
      if (day <= 3) {
        baseHours = 12;
        phaseName = 'Semana 1: Adaptação Inicial';
      } else if (day <= 10) {
        baseHours = 14;
        phaseName = 'Semana 2: Evolução Gradual';
      } else {
        baseHours = 16;
        phaseName = 'Semana 3: Consolidação';
      }
    } else if (duration === 28) {
      if (day <= 4) {
        baseHours = 12;
        phaseName = 'Semana 1: Adaptação Inicial';
      } else if (day <= 12) {
        baseHours = 14;
        phaseName = 'Semana 2: Evolução Gradual';
      } else {
        baseHours = 16;
        phaseName = 'Semanas 3 & 4: Consolidação';
      }
    } else if (duration === 35) {
      if (day <= 5) {
        baseHours = 12;
        phaseName = 'Semana 1: Adaptação Inicial';
      } else if (day <= 14) {
        baseHours = 14;
        phaseName = 'Semana 2: Evolução Gradual';
      } else if (day <= 28) {
        baseHours = 16;
        phaseName = 'Semanas 3 & 4: Consolidação';
      } else {
        baseHours = 16;
        phaseName = 'Semana 5: Ajuste Final';
        // Opção de 18h se experiente e relatar boa adaptação
        isOptional18hAllowed = fastingExperience === 'experiente';
      }
    } else {
      // 42 dias — Dividido em ciclos
      if (day <= 14) {
        phaseName = 'Ciclo 1: Adaptação';
        if (day <= 5) {
          baseHours = 12;
        } else {
          baseHours = 14;
        }
      } else if (day <= 28) {
        baseHours = 16;
        phaseName = 'Ciclo 2: Consolidação';
      } else {
        baseHours = 16;
        phaseName = 'Ciclo 3: Manutenção';
        // Opção de 18h para usuários experientes
        isOptional18hAllowed = fastingExperience === 'experiente';
      }
    }

    // 3. Aplica modificadores baseados na Experiência do Usuário
    let finalHours = baseHours;

    if (fastingExperience === 'tentou') {
      // Usuários intermediários começam com 14h em vez de 12h
      if (baseHours === 12) {
        finalHours = 14;
      }
    } else if (fastingExperience === 'experiente') {
      // Usuários experientes chegam em 16h muito mais rápido
      if (duration === 21) {
        if (day <= 2) finalHours = 14;
        else finalHours = 16;
      } else if (duration === 28) {
        if (day <= 2) finalHours = 14;
        else finalHours = 16;
      } else if (duration === 35) {
        if (day <= 3) finalHours = 14;
        else finalHours = 16;
      } else {
        // 42 dias
        if (day <= 3) finalHours = 14;
        else finalHours = 16;
      }
    }

    dailySchedule.push({
      day,
      hours: finalHours,
      eatingHours: 24 - finalHours,
      phaseName,
      isOptional18hAllowed,
    });
  }

  return {
    name,
    duration,
    weightGoal,
    lastMealTime,
    morningHunger,
    dailySchedule,
  };
}

/**
 * Retorna uma string elegante no formato "HH:MM" para a primeira refeição,
 * calculando (última refeição + horas de jejum)
 */
export function calculateFirstMealTime(lastMeal: number, fastingHours: number): string {
  const firstMealHour = (lastMeal + fastingHours) % 24;
  return `${firstMealHour}h`;
}
