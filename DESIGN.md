# 🎨 Design System Specification — LuquitasGym

> **Arquétipo Estético:** High-Contrast Technical & Dense (Linear / Raycast / Hardcore Gym Dark).  
> **Cores Mestras:** Preto Absoluto, Branco Nítido e Laranja Elétrico.

---

## 1. DTCG 3-Tier Design Tokens

### Tier 1: Primitivos (Raw Values)
```yaml
color:
  black-pure: "#000000"
  zinc-950: "#09090B"
  zinc-900: "#121215"
  zinc-850: "#18181D"
  zinc-700: "#24242B"
  zinc-400: "#A1A1AA"
  white-pure: "#FFFFFF"
  orange-500: "#FF6B00"
  orange-600: "#EA580C"
  orange-glow: "rgba(255, 107, 0, 0.15)"
  border-subtle: "rgba(255, 255, 255, 0.08)"
  border-hover: "rgba(255, 255, 255, 0.16)"
```

### Tier 2: Semânticos (Intent & Context)
```yaml
tokens:
  surface-background: "{color.zinc-950}"
  surface-card: "{color.zinc-900}"
  surface-card-hover: "{color.zinc-850}"
  border-card: "{color.border-subtle}"
  text-primary: "{color.white-pure}"
  text-secondary: "{color.zinc-400}"
  action-primary: "{color.orange-500}"
  action-primary-hover: "{color.orange-600}"
  action-primary-glow: "{color.orange-glow}"
  badge-active: "{color.orange-500}"
```

### Tier 3: Componentes (Scoped)
```yaml
components:
  workout-card:
    bg: "{tokens.surface-card}"
    border: "{tokens.border-card}"
    radius: "16px (rounded-2xl)"
  set-ok-button:
    size: "48x48px (min-w-[48px] min-h-[48px])"
    active-bg: "{tokens.action-primary}"
    inactive-bg: "{color.zinc-850}"
    active-scale: "active:scale-95"
  rest-timer-clock:
    font: "font-mono tabular-nums font-black text-6xl"
    color: "{tokens.text-primary}"
    expired-color: "#EF4444"
```

---

## 2. Tipografia & Anti-Oscilação (`tabular-nums`)
- **Títulos & Ações:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto`, `font-black tracking-tight`.
- **Valores Numéricos, Cargas, Repetições & Cronômetro:** Obrigatório o uso de `tabular-nums` e `font-mono` para garantir largura de caracteres fixa e eliminar reflow visual enquanto os segundos descem.

---

## 3. Ergonomia de Toque (Mobile Gym Ergonomics)
- **Área Mínima de Toque:** Todos os botões críticos (`OK` de série, alternador de tipo de série, botões de `+15s`/`-15s`, inputs) possuem **altura mínima de 48px** (`h-12`).
- **Microinterações:** `active:scale-95` com transições ultrarrápidas (100ms) para fornecer feedback visual imediato de confirmação.
- **Feedback Háptico Nativo:**
  - `40ms`: Checklist articular concluído.
  - `60ms`: Série de trabalho marcada como concluída.
  - `[150, 100, 250]`: Alerta no bolso ao término do cronômetro de descanso.
