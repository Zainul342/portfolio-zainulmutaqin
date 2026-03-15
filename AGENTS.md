# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

**Package manager:** pnpm (v10.27.0 — do not use npm or yarn)

```sh
pnpm dev        # start dev server (http://localhost:3000)
pnpm build      # production build
pnpm start      # serve production build
```

There are no lint, type-check, or test scripts configured. To manually type-check:

```sh
pnpm tsc --noEmit
```

## Architecture

This is a **Next.js 14 App Router** single-page portfolio. All content is hardcoded (no CMS, no backend, no API routes).

### Entry points

- `app/layout.tsx` — Root layout. Loads JetBrains Mono font via `next/font/google` and mounts `<GlobalCommandPalette />` globally (so the command palette is available on every page).
- `app/page.tsx` — Home page. Renders four sections in order: `HeroSection → AboutSection → SkillsSection → ProjectsSection`. Each section has a matching `id` attribute used for scroll navigation.

### Sections vs Components

- `app/sections/` — Page sections, rendered as Server Components by default. Exception: `HeroSection.tsx` is `"use client"` because it runs a typewriter animation and renders the Globe.
- `components/` — Reusable client components:
  - `Globe.tsx` — Three.js wireframe globe (`@react-three/fiber` + `@react-three/drei`). Always loaded with `next/dynamic(..., { ssr: false })` from `HeroSection` because Three.js requires browser APIs.
  - `CommandPalette.tsx` — The command palette modal UI with keyboard navigation and easter eggs (`sudo rm -rf /`, `hack the planet`, `whereami`).
  - `GlobalCommandPalette.tsx` — Thin wrapper that listens for `Cmd+K` / `Ctrl+K` globally and renders `<CommandPalette />`.
  - `ProjectCard.tsx` — Server Component card used by `ProjectsSection`.

### Design system

Colors are **CSS custom properties** defined in `app/globals.css` using the **Catppuccin Mocha** palette:

| Variable      | Purpose                  |
|---------------|--------------------------|
| `--base`      | Page background (`#1e1e2e`) |
| `--surface`   | Card/widget backgrounds  |
| `--overlay`   | Borders, muted elements  |
| `--text`      | Primary text             |
| `--subtext`   | Secondary/muted text     |
| `--mauve`     | Primary accent (`#cba6f7`) |
| `--green`     | Success/highlight        |
| `--blue`      | Secondary accent         |

All styling references these variables as `var(--name)` inline or in Tailwind's arbitrary value syntax (e.g. `text-[var(--mauve)]`).

**Tailwind v4** is used — the CSS entry point is `@import "tailwindcss"` (not the old `@tailwind base/components/utilities` directives). There is **no `tailwind.config.*` file**; all custom classes (`.glitch`, `.skill-tag`, `.globe-levitate`, `.project-card`) are defined directly in `globals.css`.

The skill tags in `SkillsSection` use a pattern where `--accent-color` and `--accent-bg` are injected via React's `style` prop, then consumed by the `.skill-tag` CSS class.

### Path alias

`@/*` resolves to the repo root (configured in `tsconfig.json`). Use `@/components/Foo` or `@/app/sections/Bar` for imports.

### Data

All content (projects list, skill groups, command palette commands) is **hardcoded as `const` arrays** at the top of their respective component files — no separate data files exist yet.
