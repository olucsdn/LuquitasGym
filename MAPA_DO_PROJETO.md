# MAPA DO PROJETO — LuquitasGym
> Guia arquitetural estrito e inventário de responsabilidades para agentes de IA e desenvolvedores.

| Arquivo | Responsabilidade / Descricao Essencial |
| :--- | :--- |
| `README.md` | Documentação geral, stack, guia de execução e arquitetura. |
| `vercel.json` | Configuração de roteamento SPA e rewrites para deploy na Vercel. |
| `AGENTS.md` | Protocolo Universal de Governança de Agentes & Economia Extrema de Tokens. |
| `MAPA_DO_PROJETO.md` | Inventário arquitetural e rastreamento de arquivos do repositório. |
| `.gitignore` | Regras de exclusão do Git (node_modules, dist, .env). |
| `HANDOFF.md` | Semáforo declarativo de concorrência multi-agente / terminais. |
| `gemini-code-1794688958781.md` | Especificação técnica e requisitos funcionais do LuquitasGym. |
| `MANUAL_GOVERNANCA_IA_E_ECONOMIA_TOKENS.pdf` | Manual oficial de Governança de IA e Economia de Tokens v4.0. |
| `supabase/schema.sql` | Esquema DDL do Supabase, RLS, triggers e seed data de treinos e frases. |
| `package.json` | Dependências e scripts do frontend React/Vite/Tailwind. |
| `src/main.jsx` | Ponto de entrada da aplicação React. |
| `src/App.jsx` | Roteador e orquestrador principal de visualizações. |
| `src/lib/supabase.js` | Cliente Supabase configurado com auth e sessão. |
| `src/lib/workoutData.js` | Seed data, ficha oficial de 6 dias e frases motivacionais padrão. |
| `src/lib/progression.js` | Motor de Dupla Progressão automática e regras de fases articulares. |
| `src/components/Navbar.jsx` | Barra superior com logo, status de nuvem/local e perfil. |
| `src/components/AuthModal.jsx` | Tela de autenticação com feature flag e acesso do criador. |
| `src/components/Dashboard.jsx` | Painel semanal, streak heatmap, frase do dia e seletor de fase. |
| `src/components/ActiveWorkout.jsx` | Logger de treino ativo, rest timer, checklist articular e progressão. |
| `src/components/RestTimerModal.jsx` | Cronômetro de descanso com frase brutal e áudio nativo. |
| `src/components/PhaseSelectorModal.jsx` | Modal seletor das fases de readaptação (Semana 1, 2 e 3+). |
| `src/components/Analytics.jsx` | Gráficos Recharts de evolução de carga máxima e volume. |
| `src/components/QuotesManager.jsx` | Gerenciador de frases de impacto do usuário. |
