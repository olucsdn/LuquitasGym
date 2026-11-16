import React, { useState } from 'react';
import { Quote, Plus, Trash2, Shield, Sparkles, Check } from 'lucide-react';

export default function QuotesManager({
  quotes = [],
  onAddQuote,
  onDeleteQuote
}) {
  const [newQuoteText, setNewQuoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newQuoteText.trim()) return;

    setIsSubmitting(true);
    await onAddQuote(newQuoteText.trim());
    setNewQuoteText('');
    setIsSubmitting(false);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header do Módulo */}
      <div className="bg-[#121215] border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-[#FF6B00]/15 text-[#FF6B00]">
            <Quote size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Hardcore Mindset Engine</h1>
            <p className="text-xs text-[#A1A1AA]">
              Frases brutais exibidas no topo do app e durante o cronômetro de descanso.
            </p>
          </div>
        </div>

        {/* Formulário para Adicionar Frase Pessoal */}
        <form onSubmit={handleSubmit} className="mt-5">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newQuoteText}
              onChange={(e) => setNewQuoteText(e.target.value)}
              placeholder="Ex: Não aceite seu próprio cansaço como desculpa."
              className="flex-1 bg-[#09090B] border border-white/[0.1] focus:border-[#FF6B00] rounded-xl px-4 py-3 text-sm text-white placeholder-[#A1A1AA] outline-none transition-all"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newQuoteText.trim()}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#FF6B00] hover:bg-[#EA580C] disabled:opacity-50 text-black font-black text-sm rounded-xl transition-all shadow-lg shadow-[#FF6B00]/25 active:scale-95"
            >
              <Plus size={18} />
              Adicionar Frase
            </button>
          </div>
          {successMsg && (
            <p className="text-xs text-[#FF6B00] flex items-center gap-1 mt-2 font-medium">
              <Check size={14} /> Frase brutal registrada com sucesso!
            </p>
          )}
        </form>
      </div>

      {/* Lista de Frases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs font-mono font-bold text-[#A1A1AA] uppercase tracking-wider">
            Frases Ativas ({quotes.length})
          </span>
          <span className="text-xs text-[#A1A1AA]">
            Globais do Sistema + Pessoais
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quotes.map((quote) => (
            <div
              key={quote.id}
              className={`p-4 rounded-xl border bg-[#121215] flex items-start justify-between gap-3 transition-all ${
                quote.is_custom
                  ? 'border-[#FF6B00]/40 hover:border-[#FF6B00]'
                  : 'border-white/[0.08] hover:border-white/[0.16]'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Quote size={16} className={`mt-0.5 shrink-0 ${quote.is_custom ? 'text-[#F97316]' : 'text-gym-muted'}`} />
                <div>
                  <p className="text-sm font-medium text-white italic leading-relaxed">
                    "{quote.quote_text}"
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {quote.is_custom ? (
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#F97316]/20 text-[#F97316] flex items-center gap-1">
                        <Sparkles size={10} /> Personalizada
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[#2A2A32] text-gym-muted flex items-center gap-1">
                        <Shield size={10} /> Template Global
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {quote.is_custom && (
                <button
                  onClick={() => onDeleteQuote(quote.id)}
                  className="text-gym-muted hover:text-red-400 p-1.5 rounded-lg hover:bg-[#222228] transition-colors"
                  title="Excluir frase"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
