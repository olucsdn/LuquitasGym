import { describe, it, expect } from 'vitest';
import { 
  getEffectiveSets, 
  checkDoubleProgression, 
  calculateWarmupRamp, 
  PHASES 
} from '../progression';

describe('Motor de Fases Articulares (getEffectiveSets)', () => {
  it('deve subtrair 1 série na Semana 1 (Readaptação)', () => {
    expect(getEffectiveSets(4, 'week_1')).toBe(3);
    expect(getEffectiveSets(3, 'week_1')).toBe(2);
  });

  it('nunca deve retornar menos de 1 série mesmo com redução', () => {
    expect(getEffectiveSets(1, 'week_1')).toBe(1);
    expect(getEffectiveSets(0, 'week_1')).toBe(1);
  });

  it('deve manter séries integrais nas Semanas 2 e 3+', () => {
    expect(getEffectiveSets(4, 'week_2')).toBe(4);
    expect(getEffectiveSets(3, 'week_3_plus')).toBe(3);
  });
});

describe('Motor de Dupla Progressão (checkDoubleProgression)', () => {
  const mockExercise = {
    id: 'ex-bench-press',
    name: 'Supino Reto',
    min_reps: 8,
    max_reps: 10
  };

  it('deve acionar progressão se todas as séries atingirem o teto de reps (10)', () => {
    const logs = [
      { completed: true, weight_kg: 80, reps: 10 },
      { completed: true, weight_kg: 80, reps: 10 },
      { completed: true, weight_kg: 80, reps: 11 }
    ];

    const result = checkDoubleProgression(logs, mockExercise);
    expect(result.triggered).toBe(true);
    expect(result.message).toContain('Meta batida! Suba +1 a 2 kg');
    expect(result.lastWeight).toBe(80);
  });

  it('NÃO deve acionar progressão se alguma série ficar abaixo de max_reps', () => {
    const logs = [
      { completed: true, weight_kg: 80, reps: 10 },
      { completed: true, weight_kg: 80, reps: 9 }, // Falhou em atingir 10
      { completed: true, weight_kg: 80, reps: 10 }
    ];

    const result = checkDoubleProgression(logs, mockExercise);
    expect(result.triggered).toBe(false);
    expect(result.message).toBeNull();
  });

  it('deve ignorar séries não concluídas ou vazias', () => {
    const logs = [
      { completed: false, weight_kg: 80, reps: 12 },
      { completed: true, weight_kg: 80, reps: 0 }
    ];

    const result = checkDoubleProgression(logs, mockExercise);
    expect(result.triggered).toBe(false);
  });

  it('deve retornar valores zerados com segurança para logs vazios', () => {
    const result = checkDoubleProgression([], mockExercise);
    expect(result.triggered).toBe(false);
    expect(result.lastWeight).toBe(0);
  });
});

describe('Calculadora de Feeder Sets sem Fadiga (calculateWarmupRamp)', () => {
  it('deve calcular rampa de 3 séries preparatórias para cargas convencionais (ex: 80kg)', () => {
    const ramp = calculateWarmupRamp(80);
    expect(ramp).toHaveLength(3);
    expect(ramp[0].weight).toBe(40); // 50%
    expect(ramp[1].weight).toBe(56); // 70%
    expect(ramp[2].weight).toBe(68); // 85%
  });

  it('deve calcular rampa simplificada de 2 séries para cargas muito baixas (<= 10kg)', () => {
    const ramp = calculateWarmupRamp(10);
    expect(ramp).toHaveLength(2);
    expect(ramp[0].weight).toBe(5);
    expect(ramp[1].weight).toBe(8);
  });
});
