import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, CheckCircle2, Circle, Flame, AlertTriangle, ShieldCheck, 
  ArrowLeft, Save, Dumbbell, Info, Zap 
} from 'lucide-react';
import RestTimerModal from './RestTimerModal';
import { getEffectiveSets, checkDoubleProgression, PHASES } from '../lib/progression';
import { saveActiveSessionLocal, clearActiveSessionLocal } from '../lib/supabase';

export default function ActiveWorkout({
  workout,
  userProfile,
  quotes = [],
  previousSessions = [],
  onFinishWorkout,
  onCancelWorkout
}) {
  const currentPhaseId = userProfile?.current_phase || 'week_1';
  const phaseInfo = PHASES[currentPhaseId];

  // Estado da sessão
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [warmupDone, setWarmupDone] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [isFinishing, setIsFinishing] = useState(false);

  // Frase fixa no topo da sessão
  const [stickyQuote] = useState(() => {
    if (quotes.length > 0) {
      const idx = Math.floor(Math.random() * quotes.length);
      return quotes[idx]?.quote_text || quotes[0];
    }
    return "Esse dia não volta. Essa série não volta. Faz valer cada repetição.";
  });

  // Modal do Rest Timer
  const [timerState, setTimerState] = useState({
    isOpen: false,
    initialSeconds: 90,
    exerciseName: '',
    isCompound: false
  });

  // Estrutura de dados das séries por exercício
  // Map: exercise_id -> Array of { set_number, weight_kg, reps, rir, completed }
  const [workoutLogs, setWorkoutLogs] = useState(() => {
    const initialMap = {};
    workout.exercises.forEach((ex) => {
      const numSets = getEffectiveSets(ex.default_sets, currentPhaseId);
      const sets = [];
      for (let i = 1; i <= numSets; i++) {
        sets.push({
          set_number: i,
          weight_kg: '',
          reps: '',
          rir: '',
          completed: false
        });
      }
      initialMap[ex.id] = sets;
    });
    return initialMap;
  });

  // Timer de duração da sessão
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sincronização contínua com LocalStorage (Anti-queda de sinal)
  useEffect(() => {
    const sessionSnapshot = {
      workout_id: workout.id,
      started_at: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      phase_at_time: currentPhaseId,
      warmup_completed: warmupDone,
      notes: sessionNotes,
      workout_logs: workoutLogs,
      elapsed_seconds: elapsedSeconds
    };
    saveActiveSessionLocal(userProfile?.id, sessionSnapshot);
  }, [workoutLogs, warmupDone, sessionNotes, elapsedSeconds, workout.id, currentPhaseId, userProfile?.id]);

  // Atualiza um campo de uma série
  const handleUpdateSet = (exerciseId, setIndex, field, value) => {
    setWorkoutLogs(prev => {
      const currentSets = [...(prev[exerciseId] || [])];
      currentSets[setIndex] = {
        ...currentSets[setIndex],
        [field]: value
      };
      return {
        ...prev,
        [exerciseId]: currentSets
      };
    });
  };

  // Alterna conclusão da série e abre o Rest Timer se marcada como concluída
  const handleToggleSetComplete = (exercise, setIndex) => {
    const currentSets = workoutLogs[exercise.id] || [];
    const currentSet = currentSets[setIndex];
    const willBeCompleted = !currentSet?.completed;

    handleUpdateSet(exercise.id, setIndex, 'completed', willBeCompleted);

    if (willBeCompleted) {
      // Dispara o Rest Timer automático
      setTimerState({
        isOpen: true,
        initialSeconds: exercise.rest_seconds || (exercise.is_compound ? 150 : 90),
        exerciseName: exercise.name,
        isCompound: exercise.is_compound
      });
    }
  };

  // Recupera histórico da última sessão para este exercício
  const getLastSessionStats = (exerciseId) => {
    for (const sess of previousSessions) {
      const logs = (sess.set_logs || []).filter(l => l.exercise_id === exerciseId && l.completed);
      if (logs.length > 0) {
        const lastWeight = Math.max(...logs.map(l => Number(l.weight_kg) || 0));
        const lastReps = logs[0].reps;
        return { logs, summary: `${lastWeight}kg × ${lastReps} reps` };
      }
    }
    return { logs: [], summary: 'Primeiro treino registrado' };
  };

  // Finalização do treino
  const handleFinish = async () => {
    setIsFinishing(true);

    // Achata todos os logs preenchidos
    const flatLogs = [];
    Object.entries(workoutLogs).forEach(([exId, sets]) => {
      sets.forEach((s) => {
        if (s.completed || s.weight_kg || s.reps) {
          flatLogs.push({
            exercise_id: exId,
            set_number: s.set_number,
            weight_kg: Number(s.weight_kg) || 0,
            reps: Number(s.reps) || 0,
            rir: s.rir ? Number(s.rir) : null,
            completed: Boolean(s.completed)
          });
        }
      });
    });

    const payload = {
      workout_id: workout.id,
      started_at: new Date(Date.now() - elapsedSeconds * 1000).toISOString(),
      phase_at_time: currentPhaseId,
      warmup_completed: warmupDone,
      notes: sessionNotes,
      logs: flatLogs
    };

    await onFinishWorkout(payload);
    clearActiveSessionLocal(userProfile?.id);
    setIsFinishing(false);
  };

  // Formatação de minutos e segundos
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-5 animate-fadeIn">
      {/* Top Header Fixo com Tempo e Ações */}
      <div className="sticky top-16 z-30 bg-[#0F0F12]/95 backdrop-blur border-b border-[#2A2A32] -mx-4 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onCancelWorkout}
          className="flex items-center gap-1.5 text-xs text-gym-muted hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-sm font-bold bg-[#18181C] px-3 py-1.5 rounded-full border border-[#2A2A32] text-white">
            <Clock size={15} className="text-[#10B981] animate-spin" style={{ animationDuration: '6s' }} />
            {formatTime(elapsedSeconds)}
          </div>

          <button
            onClick={handleFinish}
            disabled={isFinishing}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#10B981] hover:bg-[#10B981]/90 disabled:opacity-50 text-black font-extrabold text-xs rounded-full transition-all shadow-lg shadow-[#10B981]/20 active:scale-95"
          >
            <Save size={15} />
            {isFinishing ? 'Salvando...' : 'Finalizar Treino'}
          </button>
        </div>
      </div>

      {/* Frase Motivacional Fixa no Topo */}
      <div className="p-4 bg-[#18181C] border-l-4 border-[#F97316] rounded-r-xl shadow-lg">
        <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-[#F97316] mb-1">
          <Flame size={12} /> Hardcore Mindset
        </div>
        <p className="text-sm md:text-base font-black italic text-white leading-snug">
          "{stickyQuote}"
        </p>
      </div>

      {/* Info do Treino e Badge de Fase */}
      <div className="bg-[#18181C] border border-[#2A2A32] rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold text-[#10B981] uppercase tracking-wider">
              {workout.day_name} • {workout.focus}
            </span>
            <h1 className="text-2xl font-black text-white mt-0.5">{workout.title}</h1>
          </div>
          <div className="text-right">
            <span className="inline-block text-[11px] font-bold px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
              {phaseInfo.badge}
            </span>
          </div>
        </div>

        {/* Lembrete de Cadência Obrigatório */}
        <div className="mt-4 p-3 bg-[#0F0F12] border border-[#2A2A32] rounded-xl flex items-start gap-2.5">
          <Info size={16} className="text-[#10B981] shrink-0 mt-0.5" />
          <p className="text-xs text-[#A1A1AA] leading-relaxed">
            <strong className="text-white">Cadência de Ferro:</strong> 2–3s na descida, micro-pausa no alongamento, zero quique. Nunca use carga para menos de 8 reps em exercícios de braço.
          </p>
        </div>
      </div>

      {/* Checklist de Aquecimento Articular (Se for Treino Upper) */}
      {workout.is_upper_body && (
        <div className={`p-4 rounded-2xl border transition-all ${
          warmupDone 
            ? 'bg-[#10B981]/10 border-[#10B981]/40' 
            : 'bg-[#18181C] border-amber-500/40'
        }`}>
          <div className="flex items-start gap-3">
            <button
              onClick={() => setWarmupDone(!warmupDone)}
              className="mt-0.5 text-gym-muted hover:text-white transition-colors"
            >
              {warmupDone ? (
                <CheckCircle2 size={22} className="text-[#10B981]" />
              ) : (
                <Circle size={22} className="text-amber-500 animate-pulse" />
              )}
            </button>
            <div className="flex-1 cursor-pointer" onClick={() => setWarmupDone(!warmupDone)}>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className={warmupDone ? 'text-[#10B981]' : 'text-amber-500'} />
                <h3 className="text-xs font-black uppercase tracking-wider text-white">
                  Aquecimento Articular Obrigatório de Cotovelo & Ombro
                </h3>
              </div>
              <p className="text-xs text-[#F4F4F5] mt-1 font-medium">
                2× 15–20 reps leves de Tríceps Corda + Rosca na Polia (super-série sem fadiga).
              </p>
              {!warmupDone && (
                <span className="inline-block text-[10px] text-amber-400 mt-1 font-bold">
                  ⚠️ Marque como concluído antes do primeiro exercício pesado!
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Exercícios */}
      <div className="space-y-4">
        {workout.exercises.map((exercise, exIndex) => {
          const sets = workoutLogs[exercise.id] || [];
          const totalSetsCount = sets.length;
          const { logs: lastLogs, summary: lastSummary } = getLastSessionStats(exercise.id);
          const progression = checkDoubleProgression(lastLogs, exercise);

          return (
            <React.Fragment key={exercise.id}>
              <div
                className="bg-[#18181C] border border-[#2A2A32] rounded-2xl p-5 shadow-lg relative overflow-hidden"
              >
              {/* Header do Exercício */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#222228] border border-[#2A2A32] flex items-center justify-center text-xs font-black text-white shrink-0 mt-0.5">
                    {exIndex + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-black text-white">{exercise.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[11px] font-mono text-[#10B981] font-bold">
                        {totalSetsCount} séries × {exercise.min_reps}–{exercise.max_reps} reps
                      </span>
                      <span className="text-gym-border text-xs">•</span>
                      <span className="text-[11px] text-gym-muted">
                        Descanso: {exercise.rest_seconds || 90}s
                      </span>
                      {exercise.is_compound && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#F97316]/20 text-[#F97316] font-bold">
                          Composto
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nota biomecânica */}
              {exercise.execution_notes && (
                <p className="text-xs text-gym-muted bg-[#0F0F12] p-2.5 rounded-xl border border-[#2A2A32] mb-3 leading-relaxed">
                  💡 <strong className="text-white">Nota de Execução:</strong> {exercise.execution_notes}
                </p>
              )}

              {/* Informação do Treino Anterior & Badge de Dupla Progressão */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-[#0F0F12] rounded-xl border border-[#2A2A32] mb-4">
                <div className="text-xs text-gym-muted flex items-center gap-1.5">
                  <Dumbbell size={14} />
                  <span>Última vez: <strong className="text-white">{lastSummary}</strong></span>
                </div>

                {progression.triggered && (
                  <div className="flex items-center gap-1 text-xs font-black text-[#10B981] bg-[#10B981]/15 px-2.5 py-1 rounded-lg border border-[#10B981]/40 animate-pulse">
                    <Zap size={14} className="text-[#F97316]" />
                    {progression.message}
                  </div>
                )}
              </div>

              {/* Tabela de Séries Mobile-First */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[11px] font-mono font-bold text-gym-muted uppercase px-2">
                  <div className="col-span-2 text-center">Série</div>
                  <div className="col-span-4 text-center">Peso (kg)</div>
                  <div className="col-span-4 text-center">Reps</div>
                  <div className="col-span-2 text-center">OK</div>
                </div>

                {sets.map((set, setIdx) => {
                  const isLastSet = setIdx === totalSetsCount - 1;

                  return (
                    <div key={setIdx} className="space-y-1">
                      <div
                        className={`grid grid-cols-12 gap-2 items-center p-2 rounded-xl border transition-all ${
                          set.completed
                            ? 'bg-[#10B981]/10 border-[#10B981]/40'
                            : 'bg-[#0F0F12] border-[#2A2A32]'
                        }`}
                      >
                        {/* Número da Série */}
                        <div className="col-span-2 flex items-center justify-center font-black text-sm text-white">
                          #{set.set_number}
                        </div>

                        {/* Input Peso */}
                        <div className="col-span-4">
                          <input
                            type="number"
                            step="0.5"
                            value={set.weight_kg}
                            placeholder="0"
                            onChange={(e) => handleUpdateSet(exercise.id, setIdx, 'weight_kg', e.target.value)}
                            className="w-full h-11 text-center font-bold text-base bg-[#18181C] border border-[#2A2A32] focus:border-[#10B981] rounded-lg text-white outline-none"
                          />
                        </div>

                        {/* Input Repetições */}
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={set.reps}
                            placeholder={`${exercise.min_reps}-${exercise.max_reps}`}
                            onChange={(e) => handleUpdateSet(exercise.id, setIdx, 'reps', e.target.value)}
                            className="w-full h-11 text-center font-bold text-base bg-[#18181C] border border-[#2A2A32] focus:border-[#10B981] rounded-lg text-white outline-none"
                          />
                        </div>

                        {/* Checkbox de Conclusão */}
                        <div className="col-span-2 flex justify-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSetComplete(exercise, setIdx)}
                            className={`w-11 h-11 rounded-lg flex items-center justify-center transition-all ${
                              set.completed
                                ? 'bg-[#10B981] text-black shadow-md shadow-[#10B981]/30 scale-105'
                                : 'bg-[#222228] text-gym-muted hover:text-white'
                            }`}
                          >
                            <CheckCircle2 size={22} />
                          </button>
                        </div>
                      </div>

                      {/* Alerta de Última Série Obrigatório */}
                      {isLastSet && (
                        <div className="px-3 py-1 bg-[#F97316]/10 border border-[#F97316]/30 rounded-lg text-[11px] font-bold text-[#F97316] flex items-center gap-1.5">
                          <Flame size={13} />
                          <span>Última série deste exercício. Não negocie com a fraqueza.</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Frase Motivacional Brutal entre Exercícios */}
            {exIndex < workout.exercises.length - 1 && (
              <div className="my-2 p-3.5 bg-gradient-to-r from-[#18181C] via-[#1c1c22] to-[#18181C] border border-[#2A2A32] border-l-4 border-l-[#F97316] rounded-xl flex items-center gap-3 shadow-md">
                <div className="p-1.5 rounded-lg bg-[#F97316]/10 text-[#F97316] shrink-0">
                  <Flame size={16} />
                </div>
                <p className="text-xs md:text-sm font-black italic text-[#F4F4F5] tracking-tight leading-snug">
                  "{quotes[(exIndex + 1) % quotes.length]?.quote_text || quotes[0]?.quote_text || 'O ferro não mente, não tem pena e não aceita desculpas.'}"
                </p>
              </div>
            )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Notas da Sessão */}
      <div className="bg-[#18181C] border border-[#2A2A32] rounded-2xl p-5">
        <label className="text-xs font-bold text-gym-muted uppercase tracking-wider block mb-2">
          Anotações Rápidas da Sessão (Opcional)
        </label>
        <textarea
          value={sessionNotes}
          onChange={(e) => setSessionNotes(e.target.value)}
          placeholder="Ex: Articulação do ombro 100% solta. Consegui subir carga na remada..."
          rows={2}
          className="w-full bg-[#0F0F12] border border-[#2A2A32] focus:border-[#10B981] rounded-xl p-3 text-sm text-white placeholder-gym-muted outline-none"
        />
      </div>

      {/* Rest Timer Modal */}
      <RestTimerModal
        isOpen={timerState.isOpen}
        onClose={() => setTimerState(prev => ({ ...prev, isOpen: false }))}
        initialSeconds={timerState.initialSeconds}
        exerciseName={timerState.exerciseName}
        isCompound={timerState.isCompound}
        quotes={quotes}
      />
    </div>
  );
}
