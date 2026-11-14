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
      color: 'border-[#10B981]/30 hover:border-[#10B981]',
      badgeColor: 'bg-[#10B981]/20 text-[#10B981]',
      rules: [
        'Séries completas liberadas',
        'Intensidade plena (0 a 1 RIR)',
        'Módulo Extra de Terça: Habilitado opcional'
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#18181C] border border-[#2A2A32] rounded-2xl p-6 shadow-2xl relative">
        <div className="flex items-center justify-between pb-4 border-b border-[#2A2A32]">
          <div>
            <h2 className="text-lg font-black text-white">Fase de Readaptação Articular</h2>
            <p className="text-xs text-gym-muted">
              Altera automaticamente o número de séries e as metas de intensidade.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gym-muted hover:text-white p-1 rounded-lg"
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
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer bg-[#0F0F12] ${
                  isSelected
                    ? 'border-[#10B981] bg-[#10B981]/5 shadow-lg shadow-[#10B981]/10'
                    : 'border-[#2A2A32] hover:border-[#3F3F46]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#18181C] text-[#10B981]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        {phase.label}
                        {isSelected && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#10B981] text-black">
                            Ativa
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-gym-muted mt-0.5">{phase.description}</p>
                    </div>
                  </div>
                  {isSelected && <Check size={18} className="text-[#10B981]" />}
                </div>

                <ul className="mt-3 space-y-1.5 pl-9">
                  {phase.rules.map((rule, idx) => (
                    <li key={idx} className="text-xs text-[#F4F4F5] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></span>
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
