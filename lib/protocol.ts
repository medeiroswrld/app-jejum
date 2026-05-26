import type { GeneratedPlan } from './types';

export const SAFETY_WARNING = 
  'Este protocolo é educativo e não substitui orientação médica ou nutricional. Pessoas com diabetes, gestantes, lactantes, menores de 18 anos, pessoas com histórico de transtornos alimentares ou condições médicas devem consultar um profissional antes de iniciar.';

export const OBJECTIVE_STATEMENT = 
  'Este plano foi criado para apoiar sua jornada de emagrecimento. Os resultados podem variar de pessoa para pessoa. Para metas maiores, o app recomenda mais tempo de consistência.';

export const PROTOCOL_RULES = {
  duringFasting: {
    allowed: [
      'Água pura e água com gás',
      'Café preto (sem açúcar, adoçante ou leite)',
      'Chás naturais (hortelã, camomila, chá verde, sem açúcar)',
      'Água morna com algumas gotas de limão'
    ],
    avoid: [
      'Açúcar, mel e adoçantes artificiais',
      'Leite, natas e bebidas vegetais',
      'Sucos de frutas, mesmo sem açúcar',
      'Refrigerantes comuns ou zero',
      'Bebidas alcoólicas',
      'Qualquer alimento sólido'
    ]
  },
  duringWindow: {
    prioritize: [
      'Ovos inteiros e carnes magras (frango, patinho)',
      'Peixes grelhados (salmão, tilápia, atum)',
      'Verduras de folhas escuras e legumes variados',
      'Gorduras saudáveis (abacate, azeite de oliva, castanhas)',
      'Carboidratos complexos (batata-doce, arroz integral, aveia)',
      'Iogurte natural integral sem açúcar'
    ],
    avoid: [
      'Doces, chocolates e açúcar refinado',
      'Frituras, óleos vegetais refinados e empanados',
      'Biscoitos salgados, bolachas e pães brancos',
      'Comidas congeladas e ultraprocessadas',
      'Compensar o jejum comendo exageradamente na janela'
    ]
  }
};

/**
 * Retorna a frase motivacional curta com base na quantidade de horas de jejum
 */
export function getMotivationMessage(hours: number): string {
  switch (hours) {
    case 12:
      return 'Ótimo começo! Seu corpo está se acostumando a descansar durante a noite.';
    case 14:
      return 'Excelente! Você está ativando a queima de gordura e o controle da fome.';
    case 16:
      return 'Foco total! Você atingiu a janela de ouro do jejum e da autofagia celular.';
    case 18:
      return 'Nível avançado! Metabolismo super acelerado e máxima regeneração celular.';
    default:
      return 'Mantenha o foco! Cada hora de jejum fortalece sua saúde e consistência.';
  }
}

/**
 * Obtém a configuração exata de jejum do dia, aplicando a escolha de 18h se aplicável e selecionada
 */
export function getDayConfiguration(
  day: number,
  plan: GeneratedPlan,
  finalPhaseChoice: '16' | '18' | null
): {
  hours: number;
  eatingHours: number;
  phaseName: string;
  isOptional18hAllowed: boolean;
} {
  const clampedDay = Math.min(plan?.duration || 21, Math.max(1, day));
  const baseDayConfig = Array.isArray(plan?.dailySchedule)
    ? plan.dailySchedule.find((s) => s.day === clampedDay)
    : undefined;

  if (!baseDayConfig) {
    return {
      hours: 14,
      eatingHours: 10,
      phaseName: 'Fase Ativa',
      isOptional18hAllowed: false,
    };
  }

  // Se o dia permite escolha de 18h e a escolha foi feita
  if (baseDayConfig.isOptional18hAllowed && finalPhaseChoice) {
    const hours = Number(finalPhaseChoice);
    return {
      ...baseDayConfig,
      hours,
      eatingHours: 24 - hours,
    };
  }

  return baseDayConfig;
}
