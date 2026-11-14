import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Plus, Minus, Volume2, Flame } from 'lucide-react';

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

  // Inicializa o timer quando aberto
  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(initialSeconds);
      setIsRunning(true);
      if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setActiveQuote(quotes[randomIndex]?.quote_text || quotes[0]);
      }
    }
  }, [isOpen, initialSeconds, quotes]);

  // Contagem regressiva
  useEffect(() => {
    if (!isOpen || !isRunning) return;

    if (secondsLeft <= 0) {
      playBeep();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playBeep();
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isRunning, secondsLeft]);

  // Síntese de beep sonoro via Web Audio API (Zero dependência externa)
  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // Tom A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#18181C] border border-[#2A2A32] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Barra de progresso no topo */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#2A2A32]">
          <div
            className={`h-full transition-all duration-1000 ${
              secondsLeft === 0 ? 'bg-red-500' : 'bg-[#10B981]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Header do Timer */}
        <div className="flex items-center justify-between mt-1 mb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
              isCompound ? 'bg-[#F97316]/20 text-[#F97316]' : 'bg-[#10B981]/20 text-[#10B981]'
            }`}>
              <Flame size={12} />
              {isCompound ? 'Composto (Descanso Longo)' : 'Isolador (Descanso 90s)'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gym-muted hover:text-white p-1 rounded-lg transition-colors"
            title="Fechar timer"
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
          <div className={`text-6xl font-black font-mono tracking-tight transition-colors ${
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

        {/* Botões de Ação Rápida */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <button
            onClick={() => setSecondsLeft(Math.max(0, secondsLeft - 15))}
            className="flex items-center justify-center gap-1 py-2.5 bg-[#222228] hover:bg-[#2A2A32] text-xs font-bold rounded-xl text-gym-muted hover:text-white transition-all active:scale-95"
          >
            <Minus size={14} /> 15s
          </button>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center justify-center gap-1 py-2.5 bg-[#222228] hover:bg-[#2A2A32] text-xs font-bold rounded-xl text-white transition-all active:scale-95"
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
            {isRunning ? 'Pausar' : 'Continuar'}
          </button>
          <button
            onClick={() => setSecondsLeft(secondsLeft + 15)}
            className="flex items-center justify-center gap-1 py-2.5 bg-[#222228] hover:bg-[#2A2A32] text-xs font-bold rounded-xl text-gym-muted hover:text-white transition-all active:scale-95"
          >
            <Plus size={14} /> 15s
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center py-2.5 bg-[#10B981] hover:bg-[#10B981]/90 text-black font-extrabold text-xs rounded-xl transition-all active:scale-95 shadow-lg shadow-[#10B981]/20"
          >
            Pular
          </button>
        </div>
      </div>
    </div>
  );
}
