import React, { useState, useMemo } from 'react';
import { 
  Play, Flame, Shuffle, Plus, Calendar, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Dumbbell, ShieldAlert, Zap 
} from 'lucide-react';
import { SYSTEM_WORKOUTS } from '../lib/workoutData';
import { PHASES } from '../lib/progression';

export default function Dashboard({
  userProfile,
  quotes = [],
  sessions = [],
  onStartWorkout,
  onOpenPhaseSelector,
  onOpenQuotesManager
}) {
  const currentPhaseId = userProfile?.current_phase || 'week_1';
  const currentPhase = PHASES[currentPhaseId];

  // Frase em destaque com shuffle
  const [quoteIndex, setQuoteIndex] = useState(0);
  const currentQuote = useMemo(() => {
    if (quotes.length === 0) return "O ferro não mente, não tem pena e não aceita desculpas.";
    return quotes[quoteIndex % quotes.length]?.quote_text || quotes[0].quote_text;
  }, [quotes, quoteIndex]);

  const handleShuffleQuote = () => {
    setQuoteIndex(prev => prev + 1);
  };

  // Identificação do Dia e Seletor de Qualquer Dia da Semana
  const todayDayNumber = new Date().getDay();
  const defaultTodayIndex = todayDayNumber === 0 ? 1 : todayDayNumber;
  const [selectedDayNumber, setSelectedDayNumber] = useState(defaultTodayIndex);

  const selectedWorkout = SYSTEM_WORKOUTS.find(w => w.day_of_week === selectedDayNumber) || SYSTEM_WORKOUTS[0];

  // Checagem de disponibilidade da Terça-feira com base na fase
  const isTuesday = selectedWorkout.day_of_week === 2;
  const isTuesdayBlocked = isTuesday && currentPhaseId === 'week_1';
  const isTuesdaySkip = isTuesday && currentPhaseId === 'week_2';

  // Modal de confirmação de dor no ombro/cotovelo para terça-feira na Semana 3+
  const [tuesdayConfirmModal, setTuesdayConfirmModal] = useState(false);

  const handleTriggerWorkout = (workout) => {
    if (workout.day_of_week === 2) {
      if (currentPhaseId === 'week_1') {
        alert('O Módulo Extra de Terça está bloqueado na Semana 1 (Readaptação Articular) para poupar tendões.');
        return;
      }
      if (currentPhaseId === 'week_2') {
        const proceed = window.confirm('Na Semana 2 a recomendação é pular este módulo. Deseja realizar mesmo assim?');
        if (!proceed) return;
      }
      if (currentPhaseId === 'week_3_plus') {
        setTuesdayConfirmModal(true);
        return;
      }
    }
    onStartWorkout(workout);
  };

  // Cálculo da Frequência / Streak do Mês Atual
  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Conjunto com os dias que tiveram treino no mês
    const trainedDaysSet = new Set();
    let tuesdayBonusCount = 0;

    sessions.forEach(sess => {
      const sessDate = new Date(sess.completed_at);
      if (sessDate.getFullYear() === currentYear && sessDate.getMonth() === currentMonth) {
        trainedDaysSet.add(sessDate.getDate());
        if (sessDate.getDay() === 2) {
          tuesdayBonusCount++;
        }
      }
    });

    return {
      daysInMonth,
      trainedDaysCount: trainedDaysSet.size,
      trainedDaysSet,
      tuesdayBonusCount,
      targetDays: 20 // ~5 treinos por semana
    };
  }, [sessions]);

  return (
    <div className="max-w-4xl w-full mx-auto space-y-5 sm:space-y-6 animate-fadeIn pb-12 overflow-x-hidden">
      {/* 1. Banner de Impacto (Hardcore Mindset) */}
      <div className="bg-[#18181C] border border-[#2A2A32] border-l-4 border-l-[#F97316] rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-[#F97316]" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#F97316] uppercase">
              Mentalidade Brutal • Anti-Autossabotagem
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShuffleQuote}
              className="p-1.5 text-gym-muted hover:text-white rounded-lg hover:bg-[#222228] transition-colors"
              title="Sortear outra frase"
            >
              <Shuffle size={15} />
            </button>
            <button
              onClick={onOpenQuotesManager}
              className="p-1.5 text-gym-muted hover:text-[#10B981] rounded-lg hover:bg-[#222228] transition-colors"
              title="Adicionar ou gerenciar frases"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <p className="text-sm sm:text-base md:text-lg font-black italic text-white leading-relaxed">
          "{currentQuote}"
        </p>
      </div>

      {/* 2. Seletor Rápido de Qualquer Dia da Semana (Seg a Sáb) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-gym-muted">
            Selecione o Dia para Treinar
          </span>
          <span className="text-[11px] text-[#10B981] font-bold">
            {selectedWorkout.day_name} selecionada
          </span>
        </div>

        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {SYSTEM_WORKOUTS.map((w) => {
            const isSelected = w.day_of_week === selectedDayNumber;
            const isToday = w.day_of_week === defaultTodayIndex;

            return (
              <button
                key={w.id}
                type="button"
                onClick={() => setSelectedDayNumber(w.day_of_week)}
                className={`py-2 px-1 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-[#10B981] text-black border-[#10B981] shadow-lg shadow-[#10B981]/25 font-black scale-[1.02]'
                    : isToday
                    ? 'bg-[#18181C] text-white border-[#10B981]/50 font-bold hover:border-[#10B981]'
                    : 'bg-[#18181C] text-gym-muted hover:text-white border-[#2A2A32] font-medium'
                }`}
              >
                <div className="text-[10px] sm:text-xs uppercase font-mono tracking-wider font-extrabold">
                  {w.day_name.slice(0, 3)}
                </div>
                <div className="text-[11px] sm:text-xs truncate font-bold mt-0.5">
                  {w.slug === 'modulo-extra' ? 'Extra' : w.title.replace('Upper ', 'U-').replace('Lower ', 'L-')}
                </div>
                {isToday && (
                  <div className={`text-[8px] uppercase tracking-widest font-black ${
                    isSelected ? 'text-black' : 'text-[#10B981]'
                  }`}>
                    Hoje
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Card em Destaque do Treino Selecionado */}
      <div className="bg-gradient-to-br from-[#18181C] to-[#222228] border-2 border-[#10B981]/50 rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#10B981] text-black text-xs font-black rounded-full uppercase tracking-wider">
                {selectedDayNumber === defaultTodayIndex ? 'Treino de Hoje' : 'Treino Selecionado'}
              </span>
              <span className="text-xs font-mono text-gym-muted font-bold">
                {selectedWorkout.day_name}
              </span>
              {selectedWorkout.is_optional && (
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#F97316]/20 text-[#F97316]">
                  Módulo Opcional
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {selectedWorkout.title}
            </h2>

            <p className="text-xs sm:text-sm text-gym-muted font-medium">
              Foco: <span className="text-white font-bold">{selectedWorkout.focus}</span> • {selectedWorkout.exercises.length} exercícios • ~{selectedWorkout.estimated_duration_min} min
            </p>

            {/* Status específico de fase para terça */}
            {isTuesday && (
              <div className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20 inline-block">
                {currentPhase.tuesdayBadge}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => handleTriggerWorkout(selectedWorkout)}
              className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-[#10B981] hover:bg-[#10B981]/90 text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#10B981]/25 flex items-center justify-center gap-2.5 active:scale-95"
            >
              <Play size={18} fill="currentColor" />
              Iniciar {selectedWorkout.title}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Calendário de Frequência (Streak & Heatmap Mensal) */}
      <div className="bg-[#18181C] border border-[#2A2A32] rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Calendar size={16} className="text-[#10B981]" />
              Frequência do Mês ({currentMonthStats.trainedDaysCount} dias treinados)
            </h3>
            <p className="text-xs text-gym-muted mt-0.5">
              Meta principal: 5 treinos fixos/semana (Seg, Qua, Qui, Sex, Sáb). Terça = Módulo Opcional.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-gym-muted">
              <span className="w-3 h-3 rounded bg-[#10B981]"></span> Treinado
            </span>
            <span className="flex items-center gap-1.5 text-gym-muted">
              <span className="w-3 h-3 rounded bg-[#0F0F12] border border-[#2A2A32]"></span> Descanso
            </span>
          </div>
        </div>

        {/* Heatmap Grid dos dias do mês */}
        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-2">
          {Array.from({ length: currentMonthStats.daysInMonth }, (_, i) => i + 1).map((day) => {
            const isTrained = currentMonthStats.trainedDaysSet.has(day);
            const isToday = new Date().getDate() === day;

            return (
              <div
                key={day}
                className={`h-10 rounded-lg flex flex-col items-center justify-center text-xs font-mono font-bold transition-all ${
                  isTrained
                    ? 'bg-[#10B981] text-black shadow-md shadow-[#10B981]/20'
                    : isToday
                    ? 'bg-[#18181C] text-white border-2 border-[#10B981]'
                    : 'bg-[#0F0F12] border border-[#2A2A32] text-gym-muted'
                }`}
                title={`Dia ${day}: ${isTrained ? 'Treino Realizado' : 'Sem registro'}`}
              >
                <span>{day}</span>
                {isTrained && <CheckCircle2 size={10} className="stroke-[3]" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Grade Semanal da Divisão de 6 Dias */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-gym-muted">
            Divisão Completa do Programa
          </h3>
          <span className="text-xs text-gym-muted">
            Clique em qualquer ficha para abrir
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SYSTEM_WORKOUTS.map((workout) => {
            const isCurrentToday = workout.day_of_week === defaultTodayIndex;
            const isTuesdayCard = workout.day_of_week === 2;

            return (
              <div
                key={workout.id}
                onClick={() => handleTriggerWorkout(workout)}
                className={`p-4 rounded-xl border bg-[#18181C] hover:bg-[#222228] transition-all cursor-pointer group ${
                  isCurrentToday ? 'border-[#10B981]/40' : 'border-[#2A2A32]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#10B981] font-bold">
                        {workout.day_name}
                      </span>
                      {workout.is_optional && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#F97316]/20 text-[#F97316]">
                          Opcional
                        </span>
                      )}
                      {isCurrentToday && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#10B981]/20 text-[#10B981]">
                          Hoje
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-white text-base mt-1 group-hover:text-[#10B981] transition-colors">
                      {workout.title}
                    </h4>
                    <p className="text-xs text-gym-muted mt-0.5">{workout.focus}</p>
                  </div>

                  <div className="p-2 rounded-lg bg-[#0F0F12] border border-[#2A2A32] text-gym-muted group-hover:text-white group-hover:border-[#10B981] transition-colors">
                    <ChevronRight size={18} />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#2A2A32] text-xs text-gym-muted">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock size={13} /> {workout.estimated_duration_min} min
                  </span>
                  <span>•</span>
                  <span>{workout.exercises.length} exercícios</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal de Confirmação de Terça-feira (Semana 3+) */}
      {tuesdayConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#18181C] border border-[#2A2A32] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#F97316]">
              <ShieldAlert size={28} />
              <h3 className="text-lg font-black text-white">Checagem Articular Obrigatória</h3>
            </div>
            <p className="text-sm text-gym-muted leading-relaxed">
              O Módulo Estético de Terça-feira é de baixa fadiga, mas exige integridade dos tendões.
            </p>
            <div className="p-3 bg-[#0F0F12] rounded-xl border border-[#2A2A32] text-sm text-white font-bold">
              "Cotovelo e ombros estão 100% sem dor hoje?"
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setTuesdayConfirmModal(false)}
                className="py-3 bg-[#222228] hover:bg-[#2A2A32] text-xs font-bold rounded-xl text-white transition-all"
              >
                Pular Treino (Descansar)
              </button>
              <button
                onClick={() => {
                  setTuesdayConfirmModal(false);
                  onStartWorkout(SYSTEM_WORKOUTS.find(w => w.day_of_week === 2));
                }}
                className="py-3 bg-[#10B981] hover:bg-[#10B981]/90 text-xs font-black text-black rounded-xl transition-all shadow-lg shadow-[#10B981]/20"
              >
                100% Sem Dor (Iniciar)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
