import React from 'react';

/**
 * BrandLogo — Emblema oficial e tipografia minimalista do LuquitasGym
 * @param {'sm' | 'md' | 'lg'} size - Tamanho do logotipo
 * @param {boolean} showSubtitle - Se exibe o subtítulo 'HARDCORE TRACKER'
 * @param {boolean} iconOnly - Se exibe apenas o ícone sem o texto
 */
export default function BrandLogo({ size = 'md', showSubtitle = true, iconOnly = false, className = '' }) {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14'
  }[size] || 'w-9 h-9';

  const textSizes = {
    sm: 'text-sm sm:text-base',
    md: 'text-base sm:text-lg',
    lg: 'text-2xl sm:text-3xl'
  }[size] || 'text-base sm:text-lg';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Emblema Vetorial Oficial */}
      <div className={`${iconDimensions} rounded-xl bg-[#121215] border border-white/[0.12] p-1 flex items-center justify-center shadow-lg group-hover:border-[#FF6B00]/60 transition-all shrink-0`}>
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform group-hover:scale-105"
        >
          {/* Brilho sutil ao redor */}
          <circle cx="24" cy="24" r="14" fill="#FF6B00" fillOpacity="0.25" />

          {/* Barra com ângulo dinâmico de 45 graus */}
          <g transform="rotate(-45 24 24)">
            {/* Eixo cromado central */}
            <rect x="22" y="7" width="4" height="34" rx="2" fill="#FFFFFF" />

            {/* Anilhas Superiores */}
            <rect x="15" y="9" width="18" height="4.5" rx="1.5" fill="#FF6B00" />
            <rect x="17" y="5" width="14" height="3" rx="1" fill="#24242B" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <rect x="19.5" y="2" width="9" height="2" rx="0.5" fill="#FF6B00" />

            {/* Presilha Superior */}
            <rect x="20" y="14.5" width="8" height="1.8" rx="0.6" fill="#FFFFFF" />

            {/* Anilhas Inferiores */}
            <rect x="15" y="34.5" width="18" height="4.5" rx="1.5" fill="#FF6B00" />
            <rect x="17" y="40" width="14" height="3" rx="1" fill="#24242B" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
            <rect x="19.5" y="44" width="9" height="2" rx="0.5" fill="#FF6B00" />

            {/* Presilha Inferior */}
            <rect x="20" y="31.7" width="8" height="1.8" rx="0.6" fill="#FFFFFF" />
          </g>

          {/* Centelha de Energia */}
          <circle cx="11" cy="11" r="1.5" fill="#FF8533" />
          <circle cx="37" cy="37" r="1.5" fill="#FF8533" />
        </svg>
      </div>

      {/* Tipografia da Marca */}
      {!iconOnly && (
        <div>
          <span className={`font-black tracking-tight text-white flex items-center leading-none ${textSizes}`}>
            LUQUITAS<span className="text-[#FF6B00] ml-0.5">GYM</span>
          </span>
          {showSubtitle && size !== 'sm' && (
            <div className="hidden sm:flex items-center gap-1.5 text-[9px] text-[#A1A1AA] mt-0.5 font-mono tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse"></span>
              HARDCORE TRACKER
            </div>
          )}
        </div>
      )}
    </div>
  );
}
