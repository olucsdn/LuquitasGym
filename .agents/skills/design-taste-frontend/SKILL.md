---
name: design-taste-frontend
description: Agent skill for high-craft frontend design and anti-slop art direction. Enforces strong visual hierarchy, typography, intentional layouts, and automated browser verification.
author: Leonxlnx
repository: https://github.com/Leonxlnx/taste-skill
version: 2.5
---

> 📌 **PIPELINE MARKER — FASE 3D: DIREÇÃO DE ARTE & ANTI-SLOP**
> *Posição no Fluxo:* Eliminação de layouts genéricos de IA, assimetria intencional e âncoras visuais.
> *Guia Mestre de Orquestração:* Consulte [AGENTS.md](../AGENTS.md) para ordem de execução e precedência.

# Design Taste Frontend (Anti-Slop Art Direction)

> "Coding agents by default produce statistical median designs: generic purple gradients, identical 3-card grids, Inter typography, and empty corporate copy. This skill gives agents taste, art direction, and strict visual verification."

---

## 1. Core Principles: Killing AI Slop

When generating or refining frontends, the agent MUST immediately eliminate common AI design clichés:

### 🚫 Forbidden Patterns (AI Slop Checklist)
1. **No Gratuitous Dark Purple/Indigo Gradients:** Do not default to `#0f172a` backgrounds with glowing purple/cyan blur blobs unless explicitly requested.
2. **No Generic 3-Card Columns:** Avoid the lazy "3 identical rounded cards with SVG icons in pastel squares" layout.
3. **No Meaningless Marketing Filler:** Ban phrases like *"Empowering your workflow with seamless next-gen AI synergy"*. Write punchy, human, specific copy.
4. **No Low-Contrast Faux-Minimalism:** Text must remain readable. Avoid faint `#64748b` on `#09090b` backgrounds without adequate contrast ratios (minimum 4.5:1).
5. **No Cluttered Border Abuse:** Don't put an outline/border around every single element and card. Use whitespace, subtle tonal shifts, or elevation to separate content.

---

## 2. Art Direction & Visual Hierarchy

Every page must have an intentional **Art Direction Archetype**:

### Archetype A: High-Contrast Technical & Dense (e.g., Linear, Raycast)
* **Tone:** Ultra-precise, engineering-led, keyboard-first.
* **Layout:** Dense information density, monospace data accents, subtle 1px dividers (`rgba(255,255,255,0.08)`), micro-badges, dark or crisp light backgrounds.
* **Typography:** Tight letter spacing on headlines (`-0.03em`), tabular numbers (`font-variant-numeric: tabular-nums`), Geist or JetBrains Mono accents.

### Archetype B: Editorial & Typographic (e.g., Stripe Press, The Verge, New York Times)
* **Tone:** Thoughtful, narrative-driven, authoritative.
* **Layout:** Generous margins, asymmetrical 2-column or 3-column editorial spreads, prominent quote callouts, large drop caps or section stamps.
* **Typography:** Elegant serif or modern grotesque headlines (Playfair, Newsreader, Fraunces, Charter), high contrast with clean sans-serif body text, comfortable reading line length (60–75 characters max).

### Archetype C: Bold / Poster / Neo-Brutalist
* **Tone:** Unapologetic, high-energy, memorable.
* **Layout:** Heavy grid lines, deliberate breaking of boundaries, oversized display type (72px+), stark monochrome with one saturated highlighter color (safety orange, lime, electric cobalt).
* **Typography:** Heavy sans-serifs, all-caps category stamps, raw monospaced labels.

---

## 3. Real Assets & Visual Anchor Rule

* **Never Use Empty Gray Boxes:** When rendering images or cards, do not leave empty gray rectangles or `placeholder.svg`.
* **Real Curated Assets:**
  - Use high-quality, authentic photography from open/CC0 sources (Unsplash, Wikimedia Commons, Open Verse).
  - Use realistic SVG icons from established libraries (Lucide, Radix Icons, Heroicons) rather than inventing distorted custom SVGs.
* **Focal Point:** Every screen must have **one dominant visual anchor** (a bold typographic headline, a hero screenshot, or a distinctive hero image). If everything is fighting for attention, nothing gets attention.

---

## 4. The Finish Gate (Browser Quality Verification)

Before completing any frontend task, run through the **Finish Gate Checklist** (inspired by `scripts/gate.mjs`):

### 🔍 Verification Checklist

1. **Layout & Overflow:**
   - [ ] Does any element produce horizontal scrollbars on desktop or mobile (`overflow-x: hidden` is not a fix for broken layout)?
   - [ ] Does any text get clipped, truncated awkwardly, or overlap with adjacent containers?
2. **Typography & Hierarchy:**
   - [ ] Is there an obvious hierarchy: H1 (Display) > H2 (Section) > H3 (Card) > Body > Caption?
   - [ ] Are headings tight and bodies legible?
3. **Responsive Breakpoints:**
   - [ ] Mobile (375px–430px): Does the navigation collapse properly? Are buttons full-width or comfortably tappable (min 44x44px)?
   - [ ] Tablet (768px–1024px): Do multi-column grids wrap logically (e.g., 3 columns -> 2 + 1 or single column)?
   - [ ] Desktop (1280px+): Is max-width constrained (e.g., `max-w-7xl mx-auto`) so lines don't stretch into 2000px wide unreadable text?
4. **Interactive Polish:**
   - [ ] Do all interactive elements have visible `:hover`, `:active`, and `:focus-visible` states?
   - [ ] Are transitions short and snappy (`150ms–250ms ease-out`), not sluggish?
5. **Copy Quality:**
   - [ ] Is all copy contextual, realistic, and free of generic AI buzzwords?

---

## 5. Agent Steering Dials

When working on a UI, you can adjust these dials:

* **Dial: Experimental vs. Restrained**
  - *Restrained (Default):* Clean, predictable, accessible, production-ready.
  - *Experimental:* Asymmetrical layouts, unconventional color clashes, unique grid overlaps.
* **Dial: Density**
  - *Compact:* Ideal for dashboards, data tables, developer tools (4px/8px rhythm).
  - *Spacious:* Ideal for marketing pages, hero sections, documentation (16px/24px/32px rhythm).
