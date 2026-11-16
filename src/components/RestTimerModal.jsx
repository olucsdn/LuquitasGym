import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Plus, Minus, Volume2, Flame } from 'lucide-react';

// Helper de Feedback Háptico Seguro
const triggerHaptic = (pattern = 50) => {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (e) {
      // Ignora em dispositivos sem suporte a vibração
    }
  }
};

export default function RestTimerModal({
  isOpen,
  onClose,
  initialSeconds = 90,
  exerciseName = '',
  isCompound = false,
  quotes = []
}) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [activeQuote, setActiveQuote] = useState('');
  const audioContextRef = useRef(null);
  const targetEndTimeRef = useRef(null);
  const hasFinishedRef = useRef(false);

  // Solicita permissão de notificação nativa silenciosamente na primeira interação
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission();
      } catch (e) {
        // Ignora em navegadores sem suporte
      }
    }
  }, []);

  // Inicializa o timer quando aberto
  useEffect(() => {
    if (isOpen) {
      const now = Date.now();
      targetEndTimeRef.current = now + initialSeconds * 1000;
      hasFinishedRef.current = false;
      setSecondsLeft(initialSeconds);
      setIsRunning(true);
      if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setActiveQuote(quotes[randomIndex]?.quote_text || quotes[0]);
      }
    }
  }, [isOpen, initialSeconds, quotes]);

  // Tecla Escape para fechar acessivelmente
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Resiliência de tela desligada via delta de timestamp + visibilitychange
  useEffect(() => {
    if (!isOpen || !isRunning) return;

    const checkAndSync = () => {
      if (!targetEndTimeRef.current) return;
      const remainingMs = targetEndTimeRef.current - Date.now();
      const remainingSec = Math.max(0, Math.round(remainingMs / 1000));
      setSecondsLeft(remainingSec);

      if (remainingSec <= 0 && !hasFinishedRef.current) {
        hasFinishedRef.current = true;
        triggerFinishAlert();
      }
    };

    // Sincroniza instantaneamente ao reacender a tela (economiza bateria com tela desligada)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndSync();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const interval = setInterval(() => {
      if (!targetEndTimeRef.current) return;
      const remainingMs = targetEndTimeRef.current - Date.now();
      const remainingSec = Math.max(0, Math.round(remainingMs / 1000));
      setSecondsLeft(remainingSec);

      // Bipes regressivos nos 3s finais (3, 2, 1) para atleta com fone
      if (remainingSec === 3 || remainingSec === 2 || remainingSec === 1) {
        playBeep(520, 0.15);
        triggerHaptic(30);
      }

      if (remainingSec <= 0) {
        clearInterval(interval);
        if (!hasFinishedRef.current) {
          hasFinishedRef.current = true;
          triggerFinishAlert();
        }
      }
    }, 500);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isOpen, isRunning]);

  // Disparo de conclusão (vibração de bolso + notificação nativa + bipe longo)
  const triggerFinishAlert = () => {
    triggerHaptic([200, 100, 200, 100, 450]);
    playBeep(880, 0.7);

    // Notificação do sistema para acender a tela no bolso se estiver bloqueada
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('🔥 Descanso Finalizado — LuquitasGym', {
          body: `${exerciseName || 'Próxima série'}: Hora de voltar pro ferro!`,
          icon: '/icon-192.png',
          vibrate: [200, 100, 200, 100, 400],
          tag: 'rest-timer-finish'
        });
      } catch (e) {
        // Fallback silencioso
      }
    }
  };

  // Ajuste do tempo restante com atualização do targetEndTime
  const adjustSeconds = (deltaSec) => {
    triggerHaptic(25);
    setSecondsLeft((prev) => {
      const next = Math.max(0, prev + deltaSec);
      targetEndTimeRef.current = Date.now() + next * 1000;
      if (next > 0) hasFinishedRef.current = false;
      return next;
    });
  };

  // Alterna play/pause preservando o delta correto
  const togglePlayPause = () => {
    triggerHaptic(30);
    if (isRunning) {
      setIsRunning(false);
    } else {
      targetEndTimeRef.current = Date.now() + secondsLeft * 1000;
      hasFinishedRef.current = false;
      setIsRunning(true);
    }
  };

  // Síntese de beep sonoro via Web Audio API (Zero dependência externa)
  const playBeep = (freq = 880, duration = 0.6) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = Math.max(0, Math.min(100, (secondsLeft / initialSeconds) * 100));

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Cronômetro de descanso"
    >
      <div className="w-full max-w-md bg-[#121215] border border-white/[0.08] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Barra de progresso no topo */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#18181D]">
          <div
            className={`h-full transition-all duration-500 ${
              secondsLeft === 0 ? 'bg-red-500' : 'bg-[#FF6B00]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header do Timer */}
        <div className="flex items-center justify-between mt-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/30 font-mono">
              <Flame size={12} />
              {isCompound ? 'Composto (Descanso Longo)' : 'Isolador (Descanso 90s)'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-white p-1 rounded-lg transition-colors"
            title="Fechar timer (Esc)"
            aria-label="Fechar timer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nome do exercício */}
        <p className="text-sm text-gym-muted text-center font-medium truncate mb-2">
          {exerciseName || 'Descanso entre séries'}
        </p>

        {/* Display do Relógio */}
        <div className="text-center my-6">
          <div className={`text-6xl font-black font-mono tracking-tight tabular-nums transition-colors ${
            secondsLeft === 0 ? 'text-red-500 animate-pulse' : 'text-white'
          }`}>
            {formattedTime}
          </div>
          {secondsLeft === 0 && (
            <p className="text-xs uppercase font-bold text-red-400 mt-2 tracking-widest animate-bounce">
              🔥 Tempo esgotado! Próxima série agora!
            </p>
          )}
        </div>

        {/* Frase Motivacional Brutal durante o descanso */}
        {activeQuote && (
          <div className="my-5 p-4 bg-[#0F0F12] border-l-4 border-[#F97316] rounded-r-xl">
            <p className="text-sm font-semibold italic text-[#F4F4F5] leading-relaxed">
              "{activeQuote}"
            </p>
          </div>
        )}

        {/* Botões de Ação Rápida com Touch Target Otimizado (48px) */}
        <div className="grid grid-cols-4 gap-2.5 mb-2">
          <button
            type="button"
            onClick={() => adjustSeconds(-15)}
            className="flex items-center justify-center gap-1 h-12 min-h-[48px] bg-[#222228] hover:bg-[#2A2A32] text-xs font-bold rounded-xl text-gym-muted hover:text-white transition-all active:scale-95 border border-[#2A2A32]"
            title="Diminuir 15 segundos"
          >
            <Minus size={14} /> <span className="tabular-nums">15s</span>
          </button>
          <button
            type="button"
            onClick={togglePlayPause}
            className="flex items-center justify-center gap-1.5 h-12 min-h-[48px] bg-[#222228] hover:bg-[#2A2A32] text-xs font-bold rounded-xl text-white transition-all active:scale-95 border border-[#2A2A32]"
            title={isRunning ? 'Pausar cronômetro' : 'Continuar cronômetro'}
          >
            {isRunning ? <Pause size={15} /> : <Play size={15} />}
            <span>{isRunning ? 'Pausar' : 'Play'}</span>
          </button>
          <button
            type="button"
            onClick={() => adjustSeconds(15)}
            className="flex items-center justify-center gap-1 h-12 min-h-[48px] bg-[#222228] hover:bg-[#2A2A32] text-xs font-bold rounded-xl text-gym-muted hover:text-white transition-all active:scale-95 border border-[#2A2A32]"
            title="Aumentar 15 segundos"
          >
            <Plus size={14} /> <span className="tabular-nums">15s</span>
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic(35);
              onClose();
            }}
            className="flex items-center justify-center h-12 min-h-[48px] bg-[#FF6B00] hover:bg-[#EA580C] text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-lg shadow-[#FF6B00]/20"
          >
            Pular
          </button>
        </div>
        <p className="text-[10px] text-center text-[#71717A] font-mono mt-2">
          💡 A tela pode desligar. O alarme tocará pontualmente ao término.
        </p>
      </div>
    </div>
  );
}
