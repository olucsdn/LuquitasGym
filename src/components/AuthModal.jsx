import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, User, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { authenticateLocal, registerLocal } from '../lib/authStore';
import BrandLogo from './BrandLogo';

export default function AuthModal({ onLoginSuccess }) {
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

    try {
      if (mode === 'login') {
        // Validação estrita e obrigatória de credenciais
        const authUser = authenticateLocal(email, password);

        // Se Supabase estiver conectado e for um e-mail válido, sincroniza sessão
        if (isSupabaseConfigured && supabase && email.includes('@')) {
          try {
            await supabase.auth.signInWithPassword({ email, password });
          } catch (ignored) {}
        }

        onLoginSuccess(authUser);
      } else {
        // Criação obrigatória de nova conta
        const newUser = registerLocal({
          displayName,
          usernameOrEmail: email,
          password
        });

        if (isSupabaseConfigured && supabase && email.includes('@')) {
          try {
            await supabase.auth.signUp({
              email,
              password,
              options: { data: { display_name: displayName } }
            });
          } catch (ignored) {}
        }

        onLoginSuccess(newUser);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Erro de autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#09090B]">
      <div className="w-full max-w-md bg-[#121215] border border-white/[0.08] rounded-3xl p-7 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow de fundo */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center text-center mb-6 relative z-10">
          <BrandLogo size="lg" showSubtitle={false} />
          <p className="text-xs text-[#A1A1AA] mt-2.5 font-mono tracking-wider">
            SISTEMA DE HIPERTROFIA & SOBRECARGA PROGRESSIVA
          </p>
        </div>

        {/* Abas Obrigatórias: Login / Criar Conta (Obrigatório ter conta para usar) */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#09090B] rounded-xl border border-white/[0.08] mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login' ? 'bg-[#18181D] text-white shadow-sm border border-white/[0.08]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup' ? 'bg-[#18181D] text-white shadow-sm border border-white/[0.08]' : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Formulário Estrito */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
                Seu Nome / Apelido
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-3.5 text-[#A1A1AA]" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Lucas"
                  className="w-full bg-[#09090B] border border-white/[0.1] focus:border-[#FF6B00] rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Usuário ou E-mail
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-3.5 text-[#A1A1AA]" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'login' ? "luquitas ou seu@email.com" : "seu_usuario ou seu@email.com"}
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
            <p className="text-xs text-red-400 font-medium bg-red-500/10 p-3 rounded-xl border border-red-500/20 leading-relaxed">
              ⚠️ {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#EA580C] disabled:opacity-50 text-black font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#FF6B00]/25 flex items-center justify-center gap-2 active:scale-98"
          >
            {loading ? 'Validando...' : mode === 'login' ? 'Entrar no Sistema' : 'Criar Minha Conta'}
            <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-[11px] text-center text-[#A1A1AA] mt-4 font-mono">
          🔒 Cadastro obrigatório para registro de sobrecarga progressiva.
        </p>
      </div>
    </div>
  );
}
