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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#121215] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#FF6B00]/15 text-[#FF6B00]">
              <Zap size={20} />
            </div>
            <div>
              <h2 className="text-base font-black text-white">Calculadora de Feeder Sets</h2>
              <p className="text-[11px] text-[#A1A1AA] truncate max-w-[220px]">
                {exerciseName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-white/[0.06] transition-colors"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input da Carga Alvo Principal */}
        <div className="my-4 p-3.5 bg-[#09090B] border border-white/[0.08] rounded-xl flex items-center justify-between gap-3">
          <div>
            <label className="text-[11px] font-bold text-[#A1A1AA] uppercase block">
              Sua Carga Alvo de Trabalho
            </label>
            <span className="text-[10px] text-[#A1A1AA]">Peso com que fará as séries válidas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              step="1"
              value={targetWeight}
              onChange={(e) => setTargetWeight(Number(e.target.value) || 0)}
              className="w-24 h-12 text-center font-black font-mono tabular-nums text-lg bg-[#121215] border border-[#FF6B00] rounded-xl text-white outline-none focus:ring-2 focus:ring-[#FF6B00]/40"
            />
            <span className="text-xs font-bold text-[#A1A1AA] font-mono">kg</span>
          </div>
        </div>

        {/* Lista de Séries Calculadas */}
        <div className="space-y-2.5 my-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A1A1AA] block px-1">
            Pirâmide Preparatória (Sem queima de glicogênio)
          </span>

          {rampSets.map((s, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-white/[0.08] bg-[#09090B] flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white">{s.label}</span>
                  <span className="text-[10px] text-[#A1A1AA] font-mono tabular-nums flex items-center gap-1">
                    <Clock size={11} /> Descanso: {s.rest}s
                  </span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] leading-tight">{s.note}</p>
              </div>

              <div className="text-right shrink-0 bg-[#121215] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                <div className="text-base font-black text-[#FF6B00] font-mono tabular-nums">
                  {s.weight} <span className="text-[10px] text-white font-normal">kg</span>
                </div>
                <div className="text-[10px] font-bold text-white font-mono tabular-nums">
                  {s.reps} reps
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lembrete de Ouro */}
        <div className="p-3 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-xl flex items-start gap-2.5 text-xs text-[#FF6B00]">
          <ShieldCheck size={16} className="shrink-0 mt-0.5" />
          <span className="text-[11px] leading-snug">
            <strong>Regra:</strong> Feeder sets não contam como séries da ficha. Elas apenas acordam o sistema nervoso sem gerar acúmulo de ácido lático.
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 h-12 bg-[#FF6B00] hover:bg-[#EA580C] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#FF6B00]/25 active:scale-95 flex items-center justify-center"
        >
          Entendido, Iniciar Treino
        </button>
      </div>
    </div>
  );
}
