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

  // Identificação de Data Atual e Seleção de Dia do Mês / Dia da Semana
  const today = new Date();
  const todayDateNumber = today.getDate();
  const todayMonthNumber = today.getMonth();
  const todayYearNumber = today.getFullYear();
  const todayDayNumber = today.getDay();
  const defaultTodayIndex = todayDayNumber === 0 ? 1 : todayDayNumber;

  // Estado do Dia do Mês Escolhido (Permite escolher qualquer dia de 1 a 31 do mês)
  const [selectedMonthDay, setSelectedMonthDay] = useState(todayDateNumber);
  const [selectedDayNumber, setSelectedDayNumber] = useState(defaultTodayIndex);

  // Objeto Date correspondente ao dia do mês selecionado
  const selectedDateObj = useMemo(() => {
    return new Date(todayYearNumber, todayMonthNumber, selectedMonthDay);
  }, [todayYearNumber, todayMonthNumber, selectedMonthDay]);

  const isSelectedDayToday = selectedMonthDay === todayDateNumber;

  // Ao selecionar um dia do mês, sincroniza automaticamente com o treino padrão daquele dia da semana
  const handleSelectMonthDay = (day) => {
    setSelectedMonthDay(day);
    const dateObj = new Date(todayYearNumber, todayMonthNumber, day);
    const dayOfWeek = dateObj.getDay();
    const mappedDay = dayOfWeek === 0 ? 1 : dayOfWeek; // Domingo mapeia para Seg por padrão
    setSelectedDayNumber(mappedDay);
  };

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
    onStartWorkout(workout, selectedDateObj);
  };

  // Sessões realizadas no dia do mês selecionado
  const sessionsOnSelectedDay = useMemo(() => {
    return sessions.filter(sess => {
      const sessDate = new Date(sess.completed_at);
      return (
        sessDate.getFullYear() === todayYearNumber &&
        sessDate.getMonth() === todayMonthNumber &&
        sessDate.getDate() === selectedMonthDay
      );
    });
  }, [sessions, todayYearNumber, todayMonthNumber, selectedMonthDay]);

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
      {/* 1. Card em Destaque do Treino de Hoje / Selecionado */}
      <div className="bg-[#121215] border border-white/[0.12] rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-52 h-52 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 bg-[#FF6B00] text-black text-xs font-black rounded-full uppercase tracking-wider">
                {isSelectedDayToday ? 'Treino de Hoje' : `Treino para Dia ${selectedMonthDay}`}
              </span>
              <span className="text-xs font-mono text-[#A1A1AA] font-bold">
                {selectedWorkout.day_name}
              </span>
              {selectedWorkout.is_optional && (
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 font-mono">
                  Módulo Opcional
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {selectedWorkout.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#A1A1AA] font-medium leading-relaxed">
              Foco: <strong className="text-white">{selectedWorkout.focus}</strong> • {selectedWorkout.exercises.length} exercícios • ~{selectedWorkout.estimated_duration_min} min
            </p>

            {/* Status específico de fase para terça */}
            {isTuesday && (
              <div className="text-xs font-bold text-[#FF6B00] bg-[#FF6B00]/10 px-3 py-1.5 rounded-xl border border-[#FF6B00]/30 inline-block font-mono">
                {currentPhase.tuesdayBadge}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => handleTriggerWorkout(selectedWorkout)}
              className="w-full sm:w-auto px-7 py-4 bg-[#FF6B00] hover:bg-[#EA580C] text-black font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#FF6B00]/25 flex items-center justify-center gap-2.5 active:scale-95 min-h-[48px]"
            >
              <Play size={18} fill="currentColor" />
              <span>Iniciar Treino Agora</span>
            </button>
          </div>
        </div>

        {/* Seletor Rápido de Dias da Semana (Seg a Sáb) */}
        <div className="mt-5 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-2 px-0.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#A1A1AA]">
              Trocar Ficha do Treino:
            </span>
            <span className="text-[11px] text-[#FF6B00] font-bold font-mono">
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
                  className={`py-2 px-1 rounded-xl border text-center transition-all min-h-[44px] flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-[#FF6B00] text-black border-[#FF6B00] shadow-md shadow-[#FF6B00]/25 font-black scale-[1.02]'
                      : isToday
                      ? 'bg-[#18181D] text-white border-[#FF6B00]/50 font-bold hover:border-[#FF6B00]'
                      : 'bg-[#121215] text-[#A1A1AA] hover:text-white border-white/[0.08] font-medium'
                  }`}
                >
                  <div className="text-[10px] sm:text-xs uppercase font-mono tracking-wider font-extrabold">
                    {w.day_name.slice(0, 3)}
                  </div>
                  <div className="text-[10px] sm:text-[11px] truncate font-bold mt-0.5 max-w-full">
                    {w.slug === 'modulo-extra' ? 'Extra' : w.title.replace('Upper ', 'U-').replace('Lower ', 'L-')}
                  </div>
                  {isToday && (
                    <div className={`text-[8px] uppercase tracking-widest font-black ${
                      isSelected ? 'text-black' : 'text-[#FF6B00]'
                    }`}>
                      Hoje
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Banner de Impacto (Hardcore Mindset) */}
      <div className="bg-[#121215] border border-white/[0.08] border-l-4 border-l-[#FF6B00] rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-[#FF6B00]" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#FF6B00] uppercase">
              Mentalidade Brutal • Anti-Autossabotagem
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShuffleQuote}
              className="p-1.5 text-[#A1A1AA] hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
              title="Sortear outra frase"
            >
              <Shuffle size={15} />
            </button>
            <button
              onClick={onOpenQuotesManager}
              className="p-1.5 text-[#A1A1AA] hover:text-[#FF6B00] rounded-lg hover:bg-white/[0.06] transition-colors"
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

      {/* 3. Calendário de Frequência (Streak & Heatmap Mensal Interativo) */}
      <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Calendar size={16} className="text-[#FF6B00]" />
              Frequência do Mês ({currentMonthStats.trainedDaysCount} de {currentMonthStats.targetDays} dias recomendados)
            </h3>
            <p className="text-xs text-[#A1A1AA] mt-0.5">
              Toque em qualquer dia para ver sessões passadas ou registrar treinos retroativos.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-[#A1A1AA]">
              <span className="w-3 h-3 rounded bg-[#FF6B00]"></span> Treinado
            </span>
            <span className="flex items-center gap-1.5 text-[#A1A1AA]">
              <span className="w-3 h-3 rounded bg-[#09090B] border border-white/[0.08]"></span> Descanso
            </span>
          </div>
        </div>

        {/* Heatmap Grid dos dias do mês (Todos clicáveis) */}
        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-2">
          {Array.from({ length: currentMonthStats.daysInMonth }, (_, i) => i + 1).map((day) => {
            const isTrained = currentMonthStats.trainedDaysSet.has(day);
            const isToday = todayDateNumber === day;
            const isSelected = selectedMonthDay === day;

            return (
              <button
                key={day}
                type="button"
                onClick={() => handleSelectMonthDay(day)}
                className={`h-11 rounded-lg flex flex-col items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#FF6B00] ring-offset-2 ring-offset-[#09090B] scale-105 z-10'
                    : 'hover:border-[#FF6B00]/50'
                } ${
                  isTrained
                    ? 'bg-[#FF6B00] text-black shadow-md shadow-[#FF6B00]/20'
                    : isToday
                    ? 'bg-[#18181D] text-white border-2 border-[#FF6B00]'
                    : 'bg-[#09090B] border border-white/[0.08] text-[#A1A1AA]'
                }`}
                title={`Dia ${day}: Toque para selecionar`}
              >
                <span>{day}</span>
                {isTrained ? (
                  <CheckCircle2 size={10} className="stroke-[3]" />
                ) : isToday ? (
                  <span className="text-[7px] font-black uppercase tracking-tighter text-[#FF6B00]">Hoje</span>
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Detalhes do Dia Selecionado no Heatmap */}
        <div className="mt-4 p-3 bg-[#09090B] border border-white/[0.08] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-mono font-bold text-white">Dia {selectedMonthDay}:</span>
            {sessionsOnSelectedDay.length > 0 ? (
              <span className="text-[#FF6B00] font-bold flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                {sessionsOnSelectedDay.length} treino(s) registrado(s) ({sessionsOnSelectedDay.map(s => {
                  const w = SYSTEM_WORKOUTS.find(sw => sw.id === s.workout_id);
                  return w ? w.title : 'Treino Concluído';
                }).join(', ')})
              </span>
            ) : (
              <span className="text-[#A1A1AA]">Nenhum treino registrado neste dia.</span>
            )}
          </div>

          {!isSelectedDayToday ? (
            <button
              type="button"
              onClick={() => handleSelectMonthDay(todayDateNumber)}
              className="text-xs font-bold text-[#FF6B00] hover:underline shrink-0"
            >
              Voltar para Hoje &rarr;
            </button>
          ) : (
            <span className="text-[11px] font-mono text-[#A1A1AA]">
              Sessão de hoje pronta para execução
            </span>
          )}
        </div>
      </div>

      {/* 4. Grade Semanal da Divisão de 6 Dias */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1AA]">
            Divisão Completa do Programa (Fichas Oficiais)
          </h3>
          <span className="text-xs text-[#A1A1AA]">
            Toque em qualquer ficha para abrir detalhes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {SYSTEM_WORKOUTS.map((workout) => {
            const isCurrentToday = workout.day_of_week === defaultTodayIndex;

            return (
              <div
                key={workout.id}
                onClick={() => handleTriggerWorkout(workout)}
                className={`p-4 rounded-xl border bg-[#121215] hover:bg-[#18181D] transition-all cursor-pointer group ${
                  isCurrentToday ? 'border-[#FF6B00]/40' : 'border-white/[0.08]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-[#FF6B00] font-bold">
                        {workout.day_name}
                      </span>
                      {workout.is_optional && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 font-mono">
                          Opcional
                        </span>
                      )}
                      {isCurrentToday && (
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 font-mono">
                          Hoje
                        </span>
                      )}
                    </div>
                    <h4 className="font-black text-white text-base mt-1 group-hover:text-[#FF6B00] transition-colors">
                      {workout.title}
                    </h4>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">{workout.focus}</p>
                  </div>

                  <div className="p-2 rounded-lg bg-[#09090B] border border-white/[0.08] text-[#A1A1AA] group-hover:text-white group-hover:border-[#FF6B00] transition-colors">
                    <ChevronRight size={18} />
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/[0.08] text-xs text-[#A1A1AA]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-[#121215] border border-white/[0.08] rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-[#FF6B00]">
              <ShieldAlert size={28} />
              <h3 className="text-lg font-black text-white">Checagem Articular Obrigatória</h3>
            </div>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              O Módulo Estético de Terça-feira é de baixa fadiga, mas exige integridade dos tendões.
            </p>
            <div className="p-3 bg-[#09090B] rounded-xl border border-white/[0.08] text-sm text-white font-bold">
              "Cotovelo e ombros estão 100% sem dor hoje?"
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setTuesdayConfirmModal(false)}
                className="py-3 bg-[#18181D] hover:bg-[#222228] text-xs font-bold rounded-xl text-white transition-all border border-white/[0.08]"
              >
                Pular Treino (Descansar)
              </button>
              <button
                onClick={() => {
                  setTuesdayConfirmModal(false);
                  onStartWorkout(SYSTEM_WORKOUTS.find(w => w.day_of_week === 2), selectedDateObj);
                }}
                className="py-3 bg-[#FF6B00] hover:bg-[#EA580C] text-xs font-black text-black rounded-xl transition-all shadow-lg shadow-[#FF6B00]/20"
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
