# LuquitasGym 🏋️‍♂️

> Web App Escalável de Acompanhamento de Treino, Sobrecarga Progressiva e Mentalidade Hardcore.

[![GitHub license](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E.svg)](https://supabase.com)

---

## ⚡ Visão Geral

O **LuquitasGym** é uma aplicação web Mobile-First, desenhada para ser rápida e eficiente dentro da academia. Arquitetada para operar tanto no modo local/offline com persistência no `localStorage` quanto sincronizada em nuvem multi-tenant no Supabase (PostgreSQL + RLS).

### Principais Funcionalidades:
- **Hardcore Mindset Engine:** Banner de frases brutais no topo do app e exibição aleatória durante o cronômetro de descanso.
- **Divisão Oficial de 6 Dias (Seed Data):**
  - **Segunda-feira:** Upper A (Corpo em V + Braços)
  - **Terça-feira (Opcional):** Módulo Estético de Baixa Fadiga Articular
  - **Quarta-feira:** Lower A (Largura de Coxas & Panturrilha)
  - **Quinta-feira:** Upper B (V-Taper Unilateral + Cabeça Longa do Braço)
  - **Sexta-feira:** Lower B (Cadeia Posterior & Largura Geral)
  - **Sábado:** Upper C (Especialização Ombros 3D & Braços)
- **Protocolo de Readaptação Articular:**
  - *Semana 1:* -1 série em todos os exercícios, 3–4 RIR, Terça-feira bloqueada.
  - *Semana 2:* Séries completas, 2 RIR, Terça-feira pulada.
  - *Semana 3+:* Intensidade plena (0–1 RIR) e Terça liberada com checagem de dor articular.
- **Motor de Dupla Progressão Automática:** Alerta para subir +1 a 2kg quando todas as séries batem a meta de repetições máximas.
- **Rest Timer Inteligente:** Contagem regressiva (150s para compostos / 90s para isoladores), com Web Audio API nativo e frases viscerais.
- **Gráficos de Sobrecarga:** Evolução de carga máxima (PR) por exercício e volume total (kg) por treino via Recharts.

---

## 🚀 Como Executar

### 1. Clonar e Instalar
```bash
git clone https://github.com/olucsdn/LuquitasGym.git
cd LuquitasGym
npm install
```

### 2. Rodar em Desenvolvimento
```bash
npm run dev
```

### 3. Configurar Supabase (Opcional)
Renomeie `.env.example` para `.env` e configure suas variáveis:
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_ALLOW_PUBLIC_SIGNUP=false
```
Execute o script `supabase/schema.sql` no SQL Editor do seu projeto Supabase para criar as tabelas, RLS, triggers e seed data.

---

## 🛡️ Governança e Arquitetura

O projeto adota o **Framework Universal de Governança de Agentes v4.0**:
- `AGENTS.md`: Diretrizes estritas de autonomia operacional, zero-slop e contenção de tokens.
- `MAPA_DO_PROJETO.md`: Inventário arquitetural Map-First.
- `HANDOFF.md`: Semáforo concorrente multi-agente para prevenir Lost Updates.
