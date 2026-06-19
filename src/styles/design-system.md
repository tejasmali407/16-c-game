# 16 Chitthi — Design System (Phase 2)

## Color tokens (HSL CSS variables)

| Token | Role |
|-------|------|
| `--primary` | Cyan — CTAs, active states, neon cyan |
| `--secondary` | Purple — secondary actions, accents |
| `--accent` | Gold — highlights, badges, stack count |
| `--warning` | Orange — warnings |
| `--success` | Green — success actions |
| `--background` | Dark navy — app background |
| `--surface` / `--card` | Elevated glass surfaces |

## Typography

| Class | Usage |
|-------|--------|
| `.text-heading-xl` | Hero titles |
| `.text-heading-lg` | Page titles |
| `.text-heading-md` | Section titles |
| `.text-body` | Body copy |
| `.text-small` | Captions, labels |

Fonts: **Orbitron** (display), **DM Sans** (body).

## Utility classes

- `.glass-card` / `.glass-card-hover` — glassmorphism surfaces
- `.neon-border-cyan|purple|gold` — neon borders
- `.glow-cyan|purple|gold` — glow shadows
- `.bg-game-app` — mesh background + orbs (via `ScreenContainer`)
- `.home-menu-card` — home action rows
- `.stack-button-shell` — pulsing stack CTA
- `.locked-feature-card` — coming soon tiles
- `.text-gradient-primary` — cyan → purple gradient text

## Components

- `AnimatedButton` — `primary` \| `secondary` \| `success` \| `danger` \| `ghost` \| `outline`
- `GameCard` — glow border, hover scale
- `StackButton` — large pulsing stack control
- `ScreenContainer` — responsive max-width + mesh
- `SectionTitle` — section headers
- `LockedFeatureCard` — 🔒 Coming Soon
- `HomeMenuCard` — home screen actions
