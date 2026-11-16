---
name: impeccable-design-vocabulary
description: Design vocabulary and systemic craft framework for coding agents. Establishes persistent product and design context, 24 granular refinement dials, and deterministic anti-slop audits.
author: Paul Bakaus
repository: https://github.com/pbakaus/impeccable
version: 1.0
---

> 📌 **PIPELINE MARKER — FASE 3B: VOCABULÁRIO & CONTEXTO DE DESIGN**
> *Posição no Fluxo:* Estruturação de `PRODUCT.md` e `DESIGN.md`, e aplicação de comandos de refinamento (`/polish`, `/bolder`).
> *Guia Mestre de Orquestração:* Consulte [AGENTS.md](../AGENTS.md) para ordem de execução e precedência.

# Impeccable: The Design Vocabulary for Coding Agents

> "AI coding agents shouldn't guess what 'make it look better' means. Impeccable gives agents a concrete design vocabulary, persistent memory through `PRODUCT.md` and `DESIGN.md`, and deterministic rules to catch UI slop before it ships."

---

## 1. Context Architecture: The Two Grounding Files

To ensure cross-session visual consistency, every project should maintain two living files in its root:

### A. `PRODUCT.md` (The Product Context)
Captures *who* is using the product and *why*, preventing the agent from making generic UX assumptions:

```markdown
# Product Context

## Product & Platform
- Name, target platform (Web / Responsive / Native), and core surface.

## Target Audience & Personas
- Who is using this? (e.g., developers on 27" monitors, on-call operators in dark environments, casual mobile shoppers).

## Core Problem & Value Proposition
- What specific friction does this product eliminate?

## Tone & Voice
- E.g., authoritative, calm, utilitarian, playful, or laser-focused.

## Anti-References & Explicit Taboos
- What this product must NEVER feel like (e.g., "no marketing fluff, no unsolicited tooltips, no aggressive popups").
```

### B. `DESIGN.md` (The Design System Tokens)
Captures design tokens and implementation rules:

```markdown
# Design System Specification

## Color Palette
- Background: `#09090b` (Primary Surface), `#18181b` (Elevated Card)
- Text: `#fafafa` (Headings), `#a1a1aa` (Body), `#71717a` (Muted/Hints)
- Accent: `#3b82f6` (Primary Action), `#ef4444` (Destructive)
- Border: `rgba(255, 255, 255, 0.1)`

## Typography
- Heading Font: Geist / Inter Display (-0.02em letter spacing)
- Body Font: Inter / System Sans (15px / 1.5 line height)
- Code / Data: JetBrains Mono / Geist Mono

## Spacing & Radii
- Grid Unit: 4px base (8px, 12px, 16px, 24px, 32px)
- Border Radius: Buttons/Inputs: 6px; Cards: 10px; Modals: 14px
- Elevation: 1px border + subtle directional shadow (`0 1px 2px rgba(0,0,0,0.2)`)
```

---

## 2. The 24 Design Vocabulary Commands & Dials

Use these explicit commands to steer the agent's UI work:

### Plan & Setup
* `/impeccable init`: Inspects the project and initializes `PRODUCT.md`.
* `/impeccable document`: Extracts existing CSS/Tailwind tokens into a unified `DESIGN.md`.
* `/impeccable shape`: Sketches the user journey and structural component breakdown before styling.

### Review & Quality Control
* `/impeccable critique`: Conducts a human-like UI/UX design critique evaluating visual balance, affordances, and cognitive load.
* `/impeccable audit`: Runs deterministic checks for accessibility (WCAG AA contrast, aria labels, focus indicators), layout shifts, and responsive clipping.

### Steering Dials (Aesthetic Refinement)
* `/impeccable bolder`: Increases typographic weight, bumps primary color contrast, expands key visual anchors, and sharpens outlines.
* `/impeccable quieter`: Reduces visual noise, softens borders, mutes secondary typography, and increases whitespace.
* `/impeccable polish`: Fine-tunes micro-interactions: adds smooth hover transitions (`150ms cubic-bezier(0.16, 1, 0.3, 1)`), active push states, and subtle focus rings.
* `/impeccable typeset`: Fixes typographic craft: eliminates orphan words (`text-wrap: balance`), adjusts line lengths (max 65ch), calibrates line heights, and matches optical sizing.
* `/impeccable colorize`: Resolves color disharmony, ensures semantic consistency (success, warning, error), and calibrates dark-mode luminance.
* `/impeccable layout`: Refactors rigid grids into dynamic, content-aware flex/grid layouts with proper fallback wrapping.
* `/impeccable animate`: Adds purposeful, subtle state transitions. Ban sluggish decorative animations.
* `/impeccable distill`: Strips away unnecessary cards, decorative icons, and redundant helper text until only essential content remains.
* `/impeccable delight`: Introduces subtle, thoughtful details (contextual empty states, keyboard navigation shortcuts, crisp micro-copy).

### Adapt & Harden
* `/impeccable adapt`: Tests and adapts the interface across extreme viewport widths (320px mobile up to 2560px ultra-wide).
* `/impeccable harden`: Implements edge-case resilience: handling long user names that wrap, empty collections, failed network states, and loading skeletons.

---

## 3. Core Deterministic Anti-Pattern Rules

Never ship code with these visual flaws:
1. **The Russian Doll Syndrome:** Never nest cards inside cards inside cards with borders and shadows on each layer.
2. **Invisible Focus:** Never remove `outline: none` without providing an explicit, high-contrast `:focus-visible` ring.
3. **Ghost Hover States:** Never leave interactive buttons or rows without an obvious visual hover and active response.
4. **Unbalanced Line Lengths:** Never let paragraph text span across an entire 1920px screen without a constrained container.
5. **Arbitrary Spacing:** Never use random padding values (e.g., `padding: 13px 27px`). Stick strictly to the spacing scale (4/8/12/16/24/32/48px).
6. **Muted Gray Illegibility:** Secondary text must always meet minimum contrast standards against its immediate background.
