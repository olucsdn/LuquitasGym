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
      <header className="sticky top-0 z-40 bg-[#09090B]/90 backdrop-blur-md border-b border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#121215] border border-white/[0.12] p-0.5 flex items-center justify-center shadow-lg group-hover:border-[#FF6B00]/50 transition-all">
              <Dumbbell className="text-[#FF6B00] group-hover:scale-110 transition-transform" size={17} />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg tracking-tight text-white flex items-center">
                LUQUITAS<span className="text-[#FF6B00] ml-0.5">GYM</span>
              </span>
              <div className="hidden sm:flex items-center gap-1.5 text-[9px] text-[#A1A1AA] -mt-1 font-mono tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse"></span>
                HARDCORE TRACKER
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-[#121215] p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-black text-[#FF6B00] border border-[#FF6B00]/40 shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Treinos
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-black text-[#FF6B00] border border-[#FF6B00]/40 shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <BarChart3 size={14} />
              <span>Evolução</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'quotes'
                  ? 'bg-black text-[#FF6B00] border border-[#FF6B00]/40 shadow-sm'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              <Quote size={14} />
              <span>Mindset</span>
            </button>
          </nav>

          {/* Right Actions (Compact for Mobile) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Seletor de Fase Ativa */}
            <button
              onClick={onOpenPhaseSelector}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#121215] hover:bg-[#18181D] border border-white/[0.08] hover:border-[#FF6B00]/40 rounded-full text-xs font-bold text-white transition-all shrink-0"
              title="Alterar fase de readaptação"
            >
              <Flame size={13} className="text-[#FF6B00]" />
              <span className="text-[11px] sm:text-xs">{currentPhase.shortLabel}</span>
            </button>

            {/* Indicador de Conexão Supabase / Local */}
            <div 
              className="hidden lg:flex items-center gap-1 text-[11px] text-[#A1A1AA] px-2.5 py-1 rounded-full bg-[#121215] border border-white/[0.08]"
              title={isSupabaseConfigured ? 'Conectado ao Supabase' : 'Modo Offline / LocalStorage'}
            >
              {isSupabaseConfigured ? (
                <span className="text-white font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} className="text-[#FF6B00]" /> Nuvem
                </span>
              ) : (
                <span className="text-[#FF6B00] font-medium flex items-center gap-1">
                  <CloudOff size={12} /> Local
                </span>
              )}
            </div>

            {/* Botão Instalar PWA */}
            <button
              onClick={onInstallApp}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FF6B00]/15 hover:bg-[#FF6B00]/25 border border-[#FF6B00]/30 rounded-full text-xs font-bold text-[#FF6B00] transition-all shrink-0"
              title="Instalar no celular"
            >
              <Smartphone size={13} />
              <span className="hidden sm:inline">Instalar</span>
            </button>

            {/* Logout */}
            {user && (
              <button
                onClick={onLogout}
                className="p-1.5 text-[#A1A1AA] hover:text-red-400 rounded-lg hover:bg-[#121215] transition-colors shrink-0"
                title="Sair da conta"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#09090B]/95 backdrop-blur-md border-t border-white/[0.08] h-14 flex items-center justify-around px-2">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'dashboard'
              ? 'text-[#FF6B00] font-black'
              : 'text-[#A1A1AA] hover:text-white'
          }`}
        >
          <Dumbbell size={18} />
          <span className="text-[10px]">Treinos</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'text-[#FF6B00] font-black'
              : 'text-[#A1A1AA] hover:text-white'
          }`}
        >
          <BarChart3 size={18} />
          <span className="text-[10px]">Evolução</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'quotes'
              ? 'text-[#FF6B00] font-black'
              : 'text-[#A1A1AA] hover:text-white'
          }`}
        >
          <Quote size={18} />
          <span className="text-[10px]">Mindset</span>
        </button>
      </div>
    </>
  );
}
