import React, { useState } from 'react';
import { Dumbbell, Lock, Mail, ArrowRight, UserCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AuthModal({ onLoginSuccess }) {
  const allowPublicSignup = import.meta.env.VITE_ALLOW_PUBLIC_SIGNUP === 'true';

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      // Login em modo local / offline
      onLoginSuccess({
        id: 'local-creator',
        email: email || 'lucas@luquitasgym.local',
        user_metadata: { display_name: displayName || 'Lucas' }
      });
      setLoading(false);
      return;
    }

    try {
      if (mode === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        onLoginSuccess(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName || email.split('@')[0] }
          }
        });
        if (error) throw error;
        onLoginSuccess(data.user);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erro de autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  const handleBypassLocal = () => {
    onLoginSuccess({
      id: 'local-creator',
      email: 'lucas@luquitasgym.local',
      user_metadata: { display_name: 'Lucas' }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#09090B]">
      <div className="w-full max-w-md bg-[#121215] border border-white/[0.08] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-[#18181D] border border-white/[0.12] p-0.5 flex items-center justify-center shadow-xl shadow-[#FF6B00]/10">
            <div className="w-full h-full bg-[#121215] rounded-[14px] flex items-center justify-center">
              <Dumbbell className="text-[#FF6B00]" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            LUQUITAS<span className="text-[#FF6B00]">GYM</span>
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1 font-mono">
            SISTEMA DE HIPERTROFIA & SOBRECARGA PROGRESSIVA
          </p>
        </div>

        {/* Feature Flag Notice (Cadastro restrito) */}
        {!allowPublicSignup && (
          <div className="mb-6 p-3 bg-[#09090B] border border-white/[0.08] rounded-xl flex items-center gap-2.5 text-xs text-[#A1A1AA]">
            <ShieldAlert size={16} className="text-[#FF6B00] shrink-0" />
            <span>Acesso inicial exclusivo para o criador e convidados.</span>
          </div>
        )}

        {/* Abas Login / Cadastro (só se signup for liberado) */}
        {allowPublicSignup && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#09090B] rounded-xl border border-white/[0.08] mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-[#18181D] text-white shadow' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-[#18181D] text-white shadow' : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Criar Conta
            </button>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
                Seu Nome / Apelido
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Lucas"
                className="w-full bg-[#09090B] border border-white/[0.1] focus:border-[#FF6B00] rounded-xl px-4 py-3 text-sm text-white outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-3.5 text-[#A1A1AA]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="lucas@gym.com"
                className="w-full bg-[#09090B] border border-white/[0.1] focus:border-[#FF6B00] rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-3.5 text-[#A1A1AA]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#09090B] border border-white/[0.1] focus:border-[#FF6B00] rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none transition-all"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-xs text-red-400 font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#FF6B00] hover:bg-[#EA580C] disabled:opacity-50 text-black font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#FF6B00]/25 flex items-center justify-center gap-2 active:scale-98"
          >
            {loading ? 'Processando...' : mode === 'login' ? 'Entrar no Sistema' : 'Finalizar Cadastro'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Botão de Acesso Direto do Criador / Modo Demonstração */}
        <div className="mt-6 pt-6 border-t border-[#2A2A32] text-center">
          <button
            type="button"
            onClick={handleBypassLocal}
            className="w-full py-2.5 px-4 bg-[#222228] hover:bg-[#2A2A32] text-xs font-bold text-[#F4F4F5] rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <UserCheck size={15} className="text-[#10B981]" />
            Acessar como Criador (Offline / Local)
          </button>
        </div>
      </div>
    </div>
  );
}
