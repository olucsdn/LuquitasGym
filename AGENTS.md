# PROTOCOLO UNIVERSAL DE GOVERNANÇA DE AGENTES & ECONOMIA EXTREMA DE TOKENS

## 1. AUTONOMIA OPERACIONAL DIRETA (DISPENSA DE CONFIRMAÇÃO)
- Execute diretamente TODAS as etapas, comandos e edições locais sem pedir confirmações intermediárias.
- Só interrompa por: (1) ambiguidade crítica de requisitos, (2) ação destrutiva irreversível, (3) violação de regra inviolável.

## 2. NAVEGAÇÃO MAP-FIRST MANDATÓRIA (ZERO ALUCINAÇÃO)
- Antes de rodar comandos, ler código ou editar, você DEVE consultar o mapa arquitetural do projeto (ex: MAPA_DO_PROJETO.md).
- Acesso restrito aos arquivos mapeados necessários. Proibida exploração cega no disco. Retorne e atualize o mapa ao concluir.

## 3. PROTOCOLO DE ECONOMIA EXTREMA DE TOKENS
- LEITURA FATIADA (LINE-SLICING): Proibido ler arquivos inteiros. Use read_file com StartLine e EndLine fatiados sob demanda.
- EDIÇÃO CIRÚRGICA (edit_file): Proibido reescrever arquivos inteiros (write_file). Substitua cirurgicamente com 1 a 3 linhas de ancoragem.
- ZERO SLOP: Elimine 100% de saudações ("Certamente!", "Aqui está"), introduções e conclusões. Comece no 1º caractere técnico útil.
- FORMATO COMPACTO [STATE]: Checkpoints em texto plano condensado (≤ 15 linhas), dispensando JSONs prolixos.
- CONTENÇÃO DE LOGS: Testes e buscas com filtros específicos. Nunca despeje logs massivos no contexto.
- PROIBIÇÃO DE RELEITURA: Nunca releia arquivos já inspecionados na sessão ativa.
- ACHADOS FORA DE ESCOPO: Registre melhorias acessórias em 1 linha sem tocar no código ("achados_fora_de_escopo").

## 4. METODOLOGIA SDD & RISEN
- Spec antes do código. Divida tarefas em fases numeradas (Prompt Chaining) com entregáveis verificáveis.
- Fail-Fast: Se uma tentativa falhar 2 vezes, PARE. Não entre em loop exploratório. Reporte o bloqueio com precisão.

## 5. PIPELINE DE EXECUÇÃO EM 6 FASES (AGENT SKILLS)
- Ativação progressiva e modular via `.agents/skills/` (consulte `skills/AGENTS.md` para orquestração completa):
  - **Fase 0 (Stack & Controle):** `agentic-awesome-orchestration` (read-only, detecção de stack).
  - **Fase 1 (Especificação):** `real-engineer-skills` (`/grill-me`, `/to-spec`).
  - **Fase 2 (Engenharia & TDD):** `real-engineer-skills` (`/tdd`) + `sdlc-verification-gates` (Tabela Anti-Desculpas).
  - **Fase 3 (Design System UI):** `awesome-brand-design-systems` -> `impeccable-design-vocabulary` -> `ux-ui-design-system-gates` -> `design-taste-frontend`.
  - **Fase 4 (Validação & E2E):** `playwright-cli-automation` + gates objetivos WCAG.
  - **Fase 5 (Segurança & Arquitetura):** `multidisciplinary-agent-playbooks` (OWASP Top 10, Supabase RLS).
  - **Fase 6 (Meta-Skills):** `anthropic-skill-creator` (criação e calibração de novas skills).
