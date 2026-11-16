---
name: awesome-brand-design-systems
description: Curated brand design systems and DESIGN.md specifications extracted from iconic tech products (Linear, Stripe, Vercel, Notion, Claude, Supabase). Inject into projects for instant high-craft aesthetics.
author: VoltAgent
repository: https://github.com/VoltAgent/awesome-design-md
version: 1.0
---

> 📌 **PIPELINE MARKER — FASE 3A: PRESETS DE DESIGN SYSTEM (FRONTEND)**
> *Posição no Fluxo:* Definição dos valores estéticos (Linear, Stripe, Vercel, Notion) para alimentar o `DESIGN.md`.
> *Guia Mestre de Orquestração:* Consulte [AGENTS.md](../AGENTS.md) para ordem de execução e precedência.

# Awesome Design System Presets (`DESIGN.md` Library)

> "Instead of designing from scratch or relying on generic templates, drop one of these curated design system specifications into your project's `DESIGN.md`. The coding agent will immediately mirror the exact aesthetic, color harmony, typography, and spacing of world-class products."

---

## 1. Linear Design System (Developer Productivity & Refined Dark Mode)

### Aesthetic Profile
* **Mood:** Fast, keyboard-first, ultra-dense, deeply refined engineering tool.
* **Dominant Themes:** Absolute black surfaces, subtle translucent borders, cold lavender-indigo accents, high-density data presentation.

### Design Tokens
```yaml
colors:
  background: "#08090a"
  surface: "#101114"
  surface-hover: "#18191d"
  border: "rgba(255, 255, 255, 0.08)"
  border-highlight: "rgba(255, 255, 255, 0.16)"
  text-primary: "#f7f8f8"
  text-secondary: "#8a8f98"
  text-tertiary: "#62666d"
  accent-primary: "#5e6ad2"
  accent-hover: "#6f7be8"
  accent-subtle: "rgba(94, 106, 210, 0.15)"
typography:
  font-family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  font-mono: 'JetBrains Mono, monospace'
  letter-spacing-headings: "-0.025em"
  line-height-dense: "1.3"
radii:
  button: "6px"
  input: "6px"
  card: "8px"
  modal: "12px"
shadows:
  elevation: "0 0 0 1px rgba(255, 255, 255, 0.08), 0 2px 4px rgba(0, 0, 0, 0.4)"
  glow: "0 0 24px rgba(94, 106, 210, 0.25)"
```

---

## 2. Stripe Design System (Trust, Elegance & Modern Financial Tech)

### Aesthetic Profile
* **Mood:** Authoritative, crystal-clear, high-craft financial infrastructure.
* **Dominant Themes:** Bright slate backgrounds, vibrant gradient accents (electric violet, cyan, indigo), generous whitespace, refined typography.

### Design Tokens
```yaml
colors:
  background: "#f8fafc"
  surface: "#ffffff"
  surface-muted: "#f1f5f9"
  border: "#e2e8f0"
  border-subtle: "#edf2f7"
  text-primary: "#0f172a"
  text-secondary: "#475569"
  text-muted: "#94a3b8"
  accent-primary: "#635bff"
  accent-hover: "#7a73ff"
  accent-gradient: "linear-gradient(135deg, #635bff 0%, #00d4ff 100%)"
typography:
  font-family: 'Soehne, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  font-weight-headings: "600"
  font-weight-body: "400"
radii:
  button: "8px"
  input: "8px"
  card: "12px"
  modal: "16px"
shadows:
  card: "0 13px 27px -5px rgba(50, 50, 93, 0.05), 0 8px 16px -8px rgba(0, 0, 0, 0.05)"
  card-hover: "0 30px 60px -12px rgba(50, 50, 93, 0.15), 0 18px 36px -18px rgba(0, 0, 0, 0.15)"
```

---

## 3. Vercel Design System (High-Contrast Monochrome & Geist)

### Aesthetic Profile
* **Mood:** Minimalist, brutalist, developer-centric, stark and clean.
* **Dominant Themes:** Pure black (`#000000`) and pure white (`#ffffff`), geometric precision, zero decorative fluff, pill-shaped tags, strict borders.

### Design Tokens
```yaml
colors:
  background-light: "#ffffff"
  background-dark: "#000000"
  surface-dark: "#0a0a0a"
  border-dark: "#262626"
  border-dark-hover: "#404040"
  text-dark-primary: "#ededed"
  text-dark-secondary: "#a1a1a1"
  accent: "#ffffff"
typography:
  font-sans: 'Geist Sans, -apple-system, sans-serif'
  font-mono: 'Geist Mono, monospace'
  letter-spacing: "-0.03em"
radii:
  button: "6px"
  pill: "9999px"
  card: "8px"
special:
  grid-pattern: "linear-gradient(to right, #1f1f1f 1px, transparent 1px), linear-gradient(to bottom, #1f1f1f 1px, transparent 1px)"
```

---

## 4. Notion Design System (Warm Human Minimalism)

### Aesthetic Profile
* **Mood:** Calm, thoughtful, document-first, distraction-free productivity.
* **Dominant Themes:** Warm off-white papers, charcoal gray text, soft hover fills, pastel categorical tags.

### Design Tokens
```yaml
colors:
  background: "#fbfbfa"
  surface: "#ffffff"
  surface-hover: "#efefee"
  border: "#e9e9e8"
  text-primary: "#37352f"
  text-secondary: "#787774"
  text-muted: "#9b9a97"
  tags:
    gray: "#e3e2e0"
    brown: "#eee0da"
    orange: "#fadec9"
    yellow: "#fdecc8"
    green: "#dbeddb"
    blue: "#d3e5ef"
    purple: "#e8deee"
    pink: "#f5e0e9"
    red: "#ffe2dd"
typography:
  font-headings: 'Lyon-Text, Georgia, serif'
  font-body: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
  line-height: "1.6"
radii:
  interactive: "4px"
  menu: "6px"
```

---

## 5. Claude / Anthropic Design System (Warm Editorial AI)

### Aesthetic Profile
* **Mood:** Thoughtful, literary, conversational, intellectual and grounded.
* **Dominant Themes:** Cream backgrounds, terracotta warmth, serif display titles, comfortable reading line lengths, soft clay tones.

### Design Tokens
```yaml
colors:
  background: "#fbf9f5"
  surface: "#ffffff"
  surface-subtle: "#f3ede3"
  border: "#e7dfd4"
  text-primary: "#262422"
  text-secondary: "#686461"
  accent-terracotta: "#da7756"
  accent-warm-brown: "#8c5638"
typography:
  font-display: 'Tiempos Headline, Copernicus, Georgia, serif'
  font-body: 'Inter, system-ui, sans-serif'
  font-mono: 'Fira Code, monospace'
radii:
  chat-bubble: "18px"
  card: "12px"
  button: "8px"
```

---

## 6. How the Agent Applies a Preset

1. **Selection:** Choose the brand preset that matches your project goals.
2. **Setup:** Copy the relevant design tokens block into your project's root `DESIGN.md`.
3. **Execution Directive:**
   > *"Using the design system specifications in `DESIGN.md`, implement all components, utility classes, and layout structures adhering strictly to the declared color variables, typography scales, and border radii."*
