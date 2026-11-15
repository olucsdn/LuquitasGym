import React, { useState } from 'react';
import { X, Zap, Dumbbell, Clock, Info, ShieldCheck } from 'lucide-react';
import { calculateWarmupRamp } from '../lib/progression';

export default function WarmupRampModal({
  isOpen,
  onClose,
  exerciseName,
  defaultTargetWeight = 40
}) {
  const [targetWeight, setTargetWeight] = useState(defaultTargetWeight || 40);

  if (!isOpen) return null;

  const rampSets = calculateWarmupRamp(targetWeight);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#18181C] border border-[#2A2A32] rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2A2A32]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F97316]/10 text-[#F97316]">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Calculadora de Feeder Sets</h2>
              <p className="text-[11px] text-gym-muted truncate max-w-[220px]">
                {exerciseName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gym-muted hover:text-white p-1 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input da Carga Alvo Principal */}
        <div className="my-4 p-3 bg-[#0F0F12] border border-[#2A2A32] rounded-xl flex items-center justify-between gap-3">
          <div>
            <label className="text-[11px] font-bold text-gym-muted uppercase block">
              Sua Carga Alvo de Trabalho
            </label>
            <span className="text-[10px] text-gym-muted">Peso com que fará as séries válidas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(Number(e.target.value) || 0)}
              className="w-20 h-10 text-center font-black text-lg bg-[#18181C] border border-[#10B981] rounded-lg text-white outline-none"
            />
            <span className="text-xs font-bold text-gym-muted">kg</span>
          </div>
        </div>

        {/* Lista de Séries Calculadas */}
        <div className="space-y-2.5 my-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gym-muted block px-1">
            Pirâmide Preparatória (Sem queima de glicogênio)
          </span>

          {rampSets.map((s, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-[#2A2A32] bg-[#0F0F12] flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">{s.label}</span>
                  <span className="text-[10px] text-gym-muted font-mono flex items-center gap-1">
                    <Clock size={11} /> Descanso: {s.rest}s
                  </span>
                </div>
                <p className="text-[11px] text-gym-muted leading-tight">{s.note}</p>
              </div>

              <div className="text-right shrink-0 bg-[#18181C] px-3 py-1.5 rounded-lg border border-[#2A2A32]">
                <div className="text-base font-black text-[#10B981] font-mono">
                  {s.weight} <span className="text-[10px] text-white font-normal">kg</span>
                </div>
                <div className="text-[10px] font-bold text-white font-mono">
                  {s.reps} reps
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lembrete de Ouro */}
        <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-2 text-xs text-amber-400">
          <ShieldCheck size={16} className="shrink-0 mt-0.5" />
          <span className="text-[11px] leading-snug">
            <strong>Regra:</strong> Feeder sets não contam como séries da ficha. Elas apenas acordam o sistema nervoso sem gerar acúmulo de ácido lático.
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-[#10B981] hover:bg-[#10B981]/90 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#10B981]/20"
        >
          Entendido, Iniciar Treino
        </button>
      </div>
    </div>
  );
}
