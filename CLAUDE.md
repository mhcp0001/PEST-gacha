# CLAUDE.md — Trend Gacha

## Project Overview

Trend Gacha is a single-page web app that lets users "draw" future trend signals in a gacha (capsule toy) mechanic. It targets business designers and strategic planners who need rapid ideation sparks during workshops.

- **Repo**: `trend-gacha`
- **Hosting**: GitHub Pages (static, no backend)
- **URL pattern**: `https://<user>.github.io/trend-gacha/`

## Tech Stack

- **Vite 6** + **React 18** + **TypeScript 5**
- **Tailwind CSS v4** (via `@tailwindcss/vite` plugin — v4 uses CSS-first config, no `tailwind.config.ts`)
- **CSS custom properties** for color tokens
- **No additional runtime dependencies** — no state libraries, no routing libraries
- Animations: CSS `@keyframes` + CSS transitions only (no Framer Motion)

## Key Architecture Decisions

1. **Trend data is external JSON** — `public/data/trends.json` is fetched at runtime via `import.meta.env.BASE_URL`. This allows non-developer team members to add trends by editing JSON alone.
2. **No routing** — single-page, all state lives in React hooks.
3. **No localStorage** — history resets per session by design (workshop tool, not persistent app).
4. **Mobile-first** — base layout targets 375px width, scales up with `clamp()`.
5. **Vite `base`** — set to `"/trend-gacha/"` for GitHub Pages subpath. Change to `"/"` if using a custom domain.

## Project Structure

```
src/
├── components/       # React components (one per file, default export)
│   ├── Header.tsx
│   ├── CategoryFilter.tsx
│   ├── GachaOrb.tsx
│   ├── DrawButton.tsx
│   ├── ResultCard.tsx
│   └── History.tsx
├── hooks/
│   ├── useGacha.ts   # Core gacha logic: draw, filter, history
│   └── useTrends.ts  # Fetch trends.json + fallback
├── types/
│   └── index.ts      # TrendItem, HistoryItem, FilterCategory
├── data/
│   └── fallback.ts   # Hardcoded fallback trends (used when fetch fails)
├── App.tsx            # Root composition
├── App.css            # CSS variables + orb animations
├── main.tsx           # Entry point
└── index.css          # Tailwind directives
public/
├── data/
│   └── trends.json    # Trend data (runtime fetch)
├── ogp.png            # OGP image 1200×630
└── favicon.svg
```

## Coding Conventions

- Use **functional components** with hooks. No class components.
- Use **named exports** for hooks and types, **default exports** for components.
- All component props must have an explicit TypeScript interface (even if empty — use `React.FC` sparingly, prefer explicit props).
- CSS: prefer Tailwind utility classes. Use `App.css` only for CSS custom properties, `@keyframes`, and styles that Tailwind cannot express.
- Keep components under 150 lines. If a component grows beyond that, extract sub-components.
- File names: PascalCase for components (e.g., `GachaOrb.tsx`), camelCase for hooks (e.g., `useGacha.ts`).

## Color Tokens (CSS Custom Properties)

```
--bg-primary:    #0b0e17
--bg-card:       #141824
--color-mega:    #8b5cf6   (purple)
--color-middle:  #22d3ee   (cyan)
--color-micro:   #4ade80   (green)
--color-all:     #e2e8f0   (white)
--text-primary:  #f1f5f9
--text-muted:    #64748b
```

## Commands

```bash
npm run dev       # Vite dev server (http://localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml` → builds with Vite → deploys to GitHub Pages.

## Important Notes

- When fetching `trends.json`, always use `${import.meta.env.BASE_URL}data/trends.json` — never hardcode paths.
- The orb animation uses CSS `@keyframes` with `animation` property. The spinning state is toggled via a CSS class (e.g., `.orb--spinning`), not inline styles.
- Result card enters from bottom (translateY) with a backdrop overlay. Both are controlled by CSS transitions on a state class.
- Keyboard shortcuts: Space/Enter = draw, Escape = close card. Attach to `window` via `useEffect`.
