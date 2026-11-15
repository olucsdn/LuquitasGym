import React from 'react';
import { Dumbbell, BarChart3, Quote, Flame, LogOut, CheckCircle2, CloudOff, Smartphone } from 'lucide-react';
import { PHASES } from '../lib/progression';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Navbar({
  user,
  profile,
  activeTab,
  setActiveTab,
  onOpenPhaseSelector,
  onInstallApp,
  onLogout
}) {
  const currentPhase = PHASES[profile?.current_phase || 'week_1'];

  return (
    <>
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0F0F12]/95 backdrop-blur border-b border-[#2A2A32]">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#F97316] p-0.5 flex items-center justify-center shadow-lg shadow-[#10B981]/10">
              <div className="w-full h-full bg-[#18181C] rounded-[9px] flex items-center justify-center">
                <Dumbbell className="text-[#10B981] group-hover:scale-110 transition-transform" size={18} />
              </div>
            </div>
            <div>
              <span className="font-black text-base sm:text-xl tracking-tight text-white flex items-center">
                LUQUITAS<span className="text-[#10B981]">GYM</span>
              </span>
              <div className="hidden sm:flex items-center gap-1.5 text-[9px] text-gym-muted -mt-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                HARDCORE TRACKER
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#18181C] text-white border border-[#2A2A32]'
                  : 'text-gym-muted hover:text-white'
              }`}
            >
              Treinos
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#18181C] text-white border border-[#2A2A32]'
                  : 'text-gym-muted hover:text-white'
              }`}
            >
              <BarChart3 size={15} />
              <span>Evolução</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'quotes'
                  ? 'bg-[#18181C] text-white border border-[#2A2A32]'
                  : 'text-gym-muted hover:text-white'
              }`}
            >
              <Quote size={15} />
              <span>Mindset</span>
            </button>
          </nav>

          {/* Right Actions (Compact for Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Seletor de Fase Ativa */}
            <button
              onClick={onOpenPhaseSelector}
              className="flex items-center gap-1 px-2 py-1 bg-[#18181C] hover:bg-[#222228] border border-[#2A2A32] rounded-full text-xs font-bold text-white transition-all shrink-0"
              title="Alterar fase de readaptação"
            >
              <Flame size={13} className="text-[#F97316]" />
              <span className="text-[11px] sm:text-xs">{currentPhase.shortLabel}</span>
            </button>

            {/* Indicador de Conexão Supabase / Local */}
            <div 
              className="hidden lg:flex items-center gap-1 text-[11px] text-gym-muted px-2 py-1 rounded bg-[#18181C] border border-[#2A2A32]"
              title={isSupabaseConfigured ? 'Conectado ao Supabase' : 'Modo Offline / LocalStorage'}
            >
              {isSupabaseConfigured ? (
                <span className="text-[#10B981] font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> Nuvem
                </span>
              ) : (
                <span className="text-[#F97316] font-medium flex items-center gap-1">
                  <CloudOff size={12} /> Local
                </span>
              )}
            </div>

            {/* Botão Instalar PWA */}
            <button
              onClick={onInstallApp}
              className="flex items-center gap-1 px-2 py-1 bg-[#10B981]/15 hover:bg-[#10B981]/25 border border-[#10B981]/30 rounded-full text-xs font-bold text-[#10B981] transition-all shrink-0"
              title="Instalar no celular"
            >
              <Smartphone size={13} />
              <span className="hidden sm:inline">Instalar</span>
            </button>

            {/* Logout */}
            {user && (
              <button
                onClick={onLogout}
                className="p-1.5 text-gym-muted hover:text-red-400 rounded-lg hover:bg-[#18181C] transition-colors shrink-0"
                title="Sair da conta"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#18181C]/95 backdrop-blur border-t border-[#2A2A32] h-14 flex items-center justify-around px-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'dashboard'
              ? 'text-[#10B981] font-extrabold'
              : 'text-gym-muted hover:text-white'
          }`}
        >
          <Dumbbell size={18} />
          <span className="text-[10px]">Treinos</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'text-[#10B981] font-extrabold'
              : 'text-gym-muted hover:text-white'
          }`}
        >
          <BarChart3 size={18} />
          <span className="text-[10px]">Evolução</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'quotes'
              ? 'text-[#10B981] font-extrabold'
              : 'text-gym-muted hover:text-white'
          }`}
        >
          <Quote size={18} />
          <span className="text-[10px]">Mindset</span>
        </button>
      </div>
    </>
  );
}
