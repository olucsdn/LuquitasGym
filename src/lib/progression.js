// Motor de Dupla Progressão & Protocolo de Fases Articulares

export const PHASES = {
  week_1: {
    id: 'week_1',
    label: 'Semana 1 (Readaptação)',
    shortLabel: 'Semana 1',
    badge: 'Meta: Parar 3 a 4 reps antes da falha (3–4 RIR)',
    rir: '3-4 RIR',
    setModifier: -1, // Subtrai 1 série de cada exercício
    tuesdayStatus: 'locked', // Bloqueada/Pular nesta semana
    tuesdayBadge: 'Bloqueada na Semana 1',
    description: 'Volume reduzido (-1 série) para restauração do tecido conjuntivo e tendões.'
  },
  week_2: {
    id: 'week_2',
    label: 'Semana 2 (Consolidação)',
    shortLabel: 'Semana 2',
    badge: 'Meta: Parar 2 reps antes da falha (2 RIR)',
    rir: '2 RIR',
    setModifier: 0, // Séries integrais
    tuesdayStatus: 'skip', // Pular nesta semana
    tuesdayBadge: 'Pular na Semana 2',
    description: 'Séries completas com intensidade moderada (2 reps na reserva).'
  },
  week_3_plus: {
    id: 'week_3_plus',
    label: 'Semana 3+ (Programa Completo)',
    shortLabel: 'Semana 3+',
    badge: 'Programa Completo (0–1 RIR)',
    rir: '0-1 RIR',
    setModifier: 0, // Séries integrais
    tuesdayStatus: 'optional', // Habilitada opcionalmente
    tuesdayBadge: 'Módulo Opcional Liberado',
    description: 'Carga e volume plenos. Módulo extra de terça liberado com checagem articular.'
  }
};

/**
 * Calcula o número de séries efetivas para o exercício com base na fase ativa do usuário.
 */
export function getEffectiveSets(defaultSets, phaseId) {
  const phase = PHASES[phaseId] || PHASES.week_1;
  const sets = defaultSets + phase.setModifier;
  return Math.max(1, sets);
}

/**
 * Verifica se a Dupla Progressão foi atingida na sessão anterior do usuário para um exercício específico.
 * Regra: se em todas as séries válidas da última sessão o usuário atingiu ou superou max_reps.
 * @param {Array} previousSetLogs - logs das séries da última sessão concluída deste exercício
 * @param {Object} exercise - metadados do exercício (min_reps, max_reps)
 */
export function checkDoubleProgression(previousSetLogs, exercise) {
  if (!previousSetLogs || previousSetLogs.length === 0) {
    return {
      triggered: false,
      message: null,
      lastWeight: 0,
      lastReps: 0
    };
  }

  const validSets = previousSetLogs.filter(s => s.completed && s.reps > 0);
  if (validSets.length === 0) {
    return {
      triggered: false,
      message: null,
      lastWeight: 0,
      lastReps: 0
    };
  }

  // Todas as séries atingiram ou superaram max_reps?
  const allHitMax = validSets.every(s => Number(s.reps) >= Number(exercise.max_reps));
  const maxWeight = Math.max(...validSets.map(s => Number(s.weight_kg) || 0));
  const avgReps = Math.round(validSets.reduce((acc, s) => acc + Number(s.reps), 0) / validSets.length);

  if (allHitMax) {
    return {
      triggered: true,
      message: `🔥 Meta batida! Suba +1 a 2 kg (ou 1 placa) hoje e volte para ${exercise.min_reps} reps.`,
      lastWeight: maxWeight,
      lastReps: avgReps
    };
  }

  return {
    triggered: false,
    message: null,
    lastWeight: maxWeight,
    lastReps: avgReps
  };
}
