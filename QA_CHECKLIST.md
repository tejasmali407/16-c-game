# Quality Assurance (QA) Checklist

Use this checklist to verify that all game features are working correctly before pushing to production.

## 1. Setup & Configuration
- [ ] **Friends Multiplayer**: Minimum 4 players constraint is enforced.
- [ ] **Friends Multiplayer**: Names and Chitthi fields cannot be empty.
- [ ] **Friends Multiplayer**: Duplicate chitthi names are blocked, showing red banner warnings and error toasts.
- [ ] **Robot Setup**: User profile name and secret Chitthi are validated.
- [ ] **Robot Setup**: Player counts (4 to 8) can be selected.
- [ ] **Robot Setup**: AI difficulty selection toggles work (Easy, Medium, Hard).

## 2. Gameplay Loop (Friends Mode)
- [ ] **Deck Generation**: Total deck size equals `Player Count * 4`.
- [ ] **Shuffling Phase**: Shuffling loader animation displays for 1.5 seconds before hand cards render.
- [ ] **Secret Hands**: Hands are secret, rendering face down until the active player's hand section is reviewed.
- [ ] **Passing System**: Selected card highlights with gold glow and lets the active player pass to the next index.
- [ ] **Balance Check**: Active player starts with 5 cards if they received one, and drops to exactly 4 after passing.

## 3. Robot Mode (AI Gameplay)
- [ ] **Robot Automation**: When active player is AI, cards display face down, showing a "Robot is calculating..." load status.
- [ ] **Robot Passing Logic**: The robot chooses its card and passes it automatically after a random delay (800ms - 1500ms).
- [ ] **Auto Stack Winner**: If a robot collects 4 matching cards, it triggers the STACK slam automatically after 800ms - 1500ms.

## 4. Reaction Phase & Penalty Logic
- [ ] **Winner Slam**: Game transitions to `winnerReady` state. A giant pulsating central STACK button appears.
- [ ] **Multiplayer Reaction slam**: In Robot Mode, all robot players trigger automated slam events at speeds based on the setup difficulty.
- [ ] **Multiplayer Reaction slam**: In Friends Mode, remaining players click their respective STACK buttons. Timings are displayed.
- [ ] **Scoring & Penalties**: The slowest player receives 1 Penalty point, and the winner gets 1 Win point. Leaders are saved to local storage.

## 5. Victory Screen & Scoreboards
- [ ] **Confetti Celebration**: Canvas-confetti triggers double-sided bursts lasting 3 seconds.
- [ ] **Stats Card**: Showcases victory status (Human Champion vs. Robot Opponent) and lists reaction speeds.
- [ ] **Session Scoreboard**: Lists cumulative session wins and penalties.
- [ ] **Buttons**: "Play Again" reset round actions and "Back Home" state clears work correctly.

## 6. PWA & PWA Installer Setup
- [ ] **Vite configuration**: `vite-plugin-pwa` bundles manifest and sw properties during build.
- [ ] **Installation Banner**: "Install App" banner displays inside Settings card on desktop/mobile browsers.
- [ ] **Offline Loading**: App shell, icons, routes, and audio effects load and execute fully offline.

## 7. Sounds, Performance, & Accessibility
- [ ] **Sound Toggles**: Muted status respects Settings toggle.
- [ ] **Synthesized Audios**: Clicking, passing, shuffling, stacking, and winning sounds play cleanly using Web Audio API.
- [ ] **Mobile Responsive**: Verified rendering alignment down to 360px wide devices.
- [ ] **Accessibility**: Focus ring outlines, label properties, and readable high-contrast texts.
