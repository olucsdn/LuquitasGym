import React, { useState, useEffect, Suspense } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ActiveWorkout from './components/ActiveWorkout';
import QuotesManager from './components/QuotesManager';
import PhaseSelectorModal from './components/PhaseSelectorModal';
import AuthModal from './components/AuthModal';

// Code-splitting do Analytics (Recharts carregado sob demanda para economizar >500kB no bundle inicial)
const Analytics = React.lazy(() => import('./components/Analytics'));

import { 
  supabase, 
  isSupabaseConfigured,
  getLocalProfile, 
  saveLocalProfile,
  getActiveSessionLocal,
  getCompletedSessions,
  saveCompletedSession,
  getQuotes,
  addQuote,
  deleteQuote,
  processSyncQueue
} from './lib/supabase';
import { getStoredSession, clearStoredSession } from './lib/authStore';
import { SYSTEM_WORKOUTS } from './lib/workoutData';

export default function App() {
  // Estado de Autenticação
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Navegação
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'workout' | 'analytics' | 'quotes'
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [activeWorkoutDate, setActiveWorkoutDate] = useState(null);
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false);

  // Dados
  const [quotes, setQuotes] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [notification, setNotification] = useState(null);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Escuta evento de instalação PWA
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Sincronização automática de treinos offline ao recuperar conexão
  useEffect(() => {
    if (!user?.id) return;

    const triggerSync = async () => {
      const res = await processSyncQueue(user.id);
      if (res.synced > 0) {
        showToast(`${res.synced} treino(s) offline sincronizado(s) com a nuvem!`, 'success');
        const updated = await getCompletedSessions(user.id);
        setSessions(updated);
      }
    };

    triggerSync();
    window.addEventListener('online', triggerSync);
    return () => window.removeEventListener('online', triggerSync);
  }, [user?.id]);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        showToast('App instalado com sucesso!', 'success');
      }
      setDeferredPrompt(null);
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      if (isIOS) {
        alert("📲 Para instalar no iPhone:\n1. Toque no botão de Compartilhar (ícone com seta para cima no Safari)\n2. Selecione 'Adicionar à Tela de Início'");
      } else {
        alert("📲 Para instalar no celular:\nAbra o menu do navegador (3 pontos) e selecione 'Instalar aplicativo' ou 'Adicionar à tela inicial'.");
      }
    }
  };

  // Exibe notificação temporária
  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // Inicializa Autenticação e Sessão
  useEffect(() => {
    const initAuth = async () => {
      let remoteUserFound = false;
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            remoteUserFound = true;
            setUser(session.user);
            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            setProfile(prof || getLocalProfile(session.user.id));
          }
        } catch (e) {
          console.warn('Erro ao carregar sessão remota:', e);
        }
      }

      // Se não autenticado via Supabase, valida sessão salva estrita no authStore
      if (!remoteUserFound) {
        const stored = getStoredSession();
        if (stored) {
          setUser(stored);
          const localProf = getLocalProfile(stored.id);
          setProfile({
            ...localProf,
            display_name: stored.user_metadata?.display_name || stored.username || localProf.display_name,
            role: stored.user_metadata?.role || localProf.role || 'user'
          });
        }
      }

      setAuthChecked(true);
    };

    initAuth();
  }, []);

  // Carrega Frases e Histórico quando o usuário estiver ativo
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const q = await getQuotes(user.id);
      setQuotes(q);

      const sess = await getCompletedSessions(user.id);
      setSessions(sess);

      // Verifica se havia um treino em andamento não finalizado (Anti-queda de sinal)
      const cachedSession = getActiveSessionLocal(user.id);
      if (cachedSession && cachedSession.workout_id) {
        const found = SYSTEM_WORKOUTS.find(w => w.id === cachedSession.workout_id);
        if (found) {
          setActiveWorkout(found);
          setActiveTab('workout');
          showToast('Sessão ativa restaurada do cache local!', 'info');
        }
      }
    };

    loadData();
  }, [user]);

  // Login com sucesso (obrigatório com credenciais válidas)
  const handleLoginSuccess = (authUser) => {
    setUser(authUser);
    const prof = getLocalProfile(authUser.id);
    const mergedProf = {
      ...prof,
      display_name: authUser.user_metadata?.display_name || authUser.username || prof.display_name,
      role: authUser.user_metadata?.role || prof.role || 'user'
    };
    saveLocalProfile(authUser.id, mergedProf);
    setProfile(mergedProf);
    showToast(`Bem-vindo ao LuquitasGym, ${mergedProf.display_name}!`, 'success');
  };

  // Logout estrito
  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    clearStoredSession();
    localStorage.removeItem('luquitasgym_creator_logged');
    setUser(null);
    setProfile(null);
    setActiveWorkout(null);
    setActiveTab('dashboard');
    showToast('Sessão encerrada com sucesso.', 'info');
  };

  // Alterar Fase Atual de Retorno
  const handleSelectPhase = async (newPhaseId) => {
    const updated = {
      ...profile,
      current_phase: newPhaseId,
      updated_at: new Date().toISOString()
    };
    setProfile(updated);
    saveLocalProfile(user.id, updated);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from('profiles')
          .update({ current_phase: newPhaseId })
          .eq('id', user.id);
      } catch (e) {}
    }

    showToast(`Fase atualizada com sucesso!`, 'success');
  };

  // Iniciar Treino com data opcional (suporte a escolher o dia do mês)
  const handleStartWorkout = (workout, sessionDate = new Date()) => {
    setActiveWorkout(workout);
    setActiveWorkoutDate(sessionDate);
    setActiveTab('workout');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Cancelar Treino
  const handleCancelWorkout = () => {
    const confirmCancel = window.confirm('Deseja realmente sair do treino em andamento? O progresso não salvo será descartado.');
    if (confirmCancel) {
      setActiveWorkout(null);
      setActiveWorkoutDate(null);
      setActiveTab('dashboard');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  // Finalizar e Salvar Treino
  const handleFinishWorkout = async (sessionPayload) => {
    const res = await saveCompletedSession(user.id, sessionPayload);
    // Recarrega lista de sessões
    const updatedSess = await getCompletedSessions(user.id);
    setSessions(updatedSess);

    setActiveWorkout(null);
    setActiveWorkoutDate(null);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
    showToast('🔥 Treino concluído e salvo com sucesso!', 'success');
  };

  // Frases
  const handleAddQuote = async (text) => {
    const q = await addQuote(user.id, text);
    setQuotes(prev => [q, ...prev]);
  };

  const handleDeleteQuote = async (quoteId) => {
    await deleteQuote(user.id, quoteId);
    setQuotes(prev => prev.filter(q => q.id !== quoteId));
    showToast('Frase removida.', 'info');
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0F0F12] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#10B981] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AuthModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#09090B] text-white flex flex-col selection:bg-[#FF6B00] selection:text-white">
      {/* Toast Notificação */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121215] border border-[#FF6B00] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
          <span className="text-xs font-bold">{notification.msg}</span>
        </div>
      )}

      {/* Navbar Superior (Oculta durante o treino ativo para foco total e fim da sobreposição) */}
      {activeTab !== 'workout' && (
        <Navbar
          user={user}
          profile={profile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenPhaseSelector={() => setIsPhaseModalOpen(true)}
          onInstallApp={handleInstallApp}
          onLogout={handleLogout}
        />
      )}

      {/* Conteúdo Principal */}
      <main className={`flex-1 w-full ${
        activeTab === 'workout' ? 'p-0' : 'max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-20 md:pb-6'
      }`}>
        {activeTab === 'dashboard' && (
          <Dashboard
            userProfile={profile}
            quotes={quotes}
            sessions={sessions}
            onStartWorkout={handleStartWorkout}
            onOpenPhaseSelector={() => setIsPhaseModalOpen(true)}
            onOpenQuotesManager={() => setActiveTab('quotes')}
          />
        )}

        {activeTab === 'workout' && activeWorkout && (
          <ActiveWorkout
            workout={activeWorkout}
            sessionDate={activeWorkoutDate}
            userProfile={profile}
            user={user}
            quotes={quotes}
            previousSessions={sessions}
            onFinishWorkout={handleFinishWorkout}
            onCancelWorkout={handleCancelWorkout}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'analytics' && (
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center p-16 text-gym-muted font-mono text-xs">
              <span className="w-6 h-6 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin mb-3" />
              <span>Carregando gráficos de evolução...</span>
            </div>
          }>
            <Analytics sessions={sessions} />
          </Suspense>
        )}

        {activeTab === 'quotes' && (
          <QuotesManager
            quotes={quotes}
            onAddQuote={handleAddQuote}
            onDeleteQuote={handleDeleteQuote}
          />
        )}
      </main>

      {/* Modal de Seleção de Fase */}
      <PhaseSelectorModal
        isOpen={isPhaseModalOpen}
        onClose={() => setIsPhaseModalOpen(false)}
        currentPhaseId={profile?.current_phase || 'week_1'}
        onSelectPhase={handleSelectPhase}
      />
    </div>
  );
}
