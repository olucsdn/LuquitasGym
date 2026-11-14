import React from 'react';
import { Dumbbell, BarChart3, Quote, Flame, LogOut, CheckCircle2, CloudOff } from 'lucide-react';
import { PHASES } from '../lib/progression';
import { isSupabaseConfigured } from '../lib/supabase';

export default function Navbar({
  user,
  profile,
  activeTab,
  setActiveTab,
  onOpenPhaseSelector,
  onLogout
}) {
  const currentPhase = PHASES[profile?.current_phase || 'week_1'];

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F12]/95 backdrop-blur border-b border-[#2A2A32]">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#10B981] to-[#F97316] p-0.5 flex items-center justify-center shadow-lg shadow-[#10B981]/10">
            <div className="w-full h-full bg-[#18181C] rounded-[10px] flex items-center justify-center">
              <Dumbbell className="text-[#10B981] group-hover:scale-110 transition-transform" size={22} />
            </div>
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-white flex items-center gap-1">
              LUQUITAS<span className="text-[#10B981]">GYM</span>
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-gym-muted -mt-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              HARDCORE TRACKER
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Mobile & Desktop) */}
        <nav className="flex items-center gap-1">
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
            <span className="hidden sm:inline">Evolução</span>
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
            <span className="hidden sm:inline">Mindset</span>
          </button>
        </nav>

        {/* Phase Pill & Profile Info */}
        <div className="flex items-center gap-2">
          {/* Seletor de Fase Ativa */}
          <button
            onClick={onOpenPhaseSelector}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#18181C] hover:bg-[#222228] border border-[#2A2A32] rounded-full text-xs font-bold text-white transition-all"
            title="Alterar fase de readaptação"
          >
            <Flame size={13} className="text-[#F97316]" />
            <span className="hidden md:inline">{currentPhase.shortLabel}</span>
          </button>

          {/* Indicador de Conexão Supabase / Local */}
          <div 
            className="hidden sm:flex items-center gap-1 text-[11px] text-gym-muted px-2 py-1 rounded bg-[#18181C] border border-[#2A2A32]"
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

          {/* Logout / Perfil */}
          {user && (
            <button
              onClick={onLogout}
              className="p-2 text-gym-muted hover:text-red-400 rounded-lg hover:bg-[#18181C] transition-colors"
              title="Sair da conta"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
