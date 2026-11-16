import React from 'react';
import { X, Check, ShieldAlert, Award, Zap } from 'lucide-react';
import { PHASES } from '../lib/progression';

export default function PhaseSelectorModal({
  isOpen,
  onClose,
  currentPhaseId,
  onSelectPhase
}) {
  if (!isOpen) return null;

  const phaseOptions = [
    {
      ...PHASES.week_1,
      icon: ShieldAlert,
      color: 'border-amber-500/30 hover:border-amber-500',
      badgeColor: 'bg-amber-500/20 text-amber-400',
      rules: [
        'Subtrai 1 série de todos os exercícios',
        'Meta: Parar 3 a 4 reps antes da falha (3–4 RIR)',
        'Módulo Extra de Terça: Bloqueado nesta semana'
      ]
    },
    {
      ...PHASES.week_2,
      icon: Award,
      color: 'border-blue-500/30 hover:border-blue-500',
      badgeColor: 'bg-blue-500/20 text-blue-400',
      rules: [
        'Séries completas prescritas na ficha',
        'Meta: Parar 2 reps antes da falha (2 RIR)',
        'Módulo Extra de Terça: Pular nesta semana'
      ]
    },
    {
      ...PHASES.week_3_plus,
      icon: Zap,
      color: 'border-[#FF6B00]/30 hover:border-[#FF6B00]',
      badgeColor: 'bg-[#FF6B00]/20 text-[#FF6B00]',
      rules: [
        'Séries completas liberadas',
        'Intensidade plena (0 a 1 RIR)',
        'Módulo Extra de Terça: Habilitado opcional'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#121215] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h2 className="text-lg font-black text-white">Fase de Readaptação Articular</h2>
            <p className="text-xs text-[#A1A1AA]">
              Altera automaticamente o número de séries e as metas de intensidade.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white p-1 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {phaseOptions.map((phase) => {
            const Icon = phase.icon;
            const isSelected = currentPhaseId === phase.id;

            return (
              <div
                key={phase.id}
                onClick={() => {
                  onSelectPhase(phase.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-[#09090B] ${
                  isSelected
                    ? 'border-[#FF6B00] bg-[#FF6B00]/5 shadow-lg shadow-[#FF6B00]/10'
                    : 'border-white/[0.08] hover:border-white/[0.16]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#18181D] text-[#FF6B00]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        {phase.label}
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-[#FF6B00] text-black">
                            Ativa
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-[#A1A1AA] mt-0.5">{phase.description}</p>
                    </div>
                  </div>
                  {isSelected && <Check size={18} className="text-[#FF6B00]" />}
                </div>

                <ul className="mt-3 space-y-1.5 pl-9">
                  {phase.rules.map((rule, idx) => (
                    <li key={idx} className="text-xs text-white/90 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]"></span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
