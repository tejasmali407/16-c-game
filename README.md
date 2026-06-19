# 16 Chitthi - Digital Party Game

A production-ready React progressive web application (PWA) for the classic Indian party card game **16 Chitthi**. Gather around a single screen with friends or challenge smart AI opponents in Robot Practice Mode.

---

## 🚀 Live Demo & Screenshots

### Screenshots Placeholder
> [!NOTE]
> *Insert active screenshots here showing the dark-mode dashboard, gameplay layout, and final scorecard results.*
> - **Desktop View**: `public/screenshots/desktop_dashboard.png`
> - **Mobile View**: `public/screenshots/mobile_gameplay.png`
> - **Winner Circle**: `public/screenshots/winner_celebration.png`

---

## ✨ Features

- **Bilingual Language System**: Full localization in **English (en)** and **Marathi (mr)**. Persists user preference automatically in `localStorage` and transitions the entire UI (buttons, card states, tutorials, form fields, and event toasts) instantly without page reload.
- **Progressive Web App (PWA)**: Installable on iOS, Android, and Desktop platforms with offline cache support powered by `vite-plugin-pwa`.
- **Local Multiplayer (Friends Mode)**: Circular pass-and-play setup for 4 to 8 players, designed with face-down "Secret Hands" to maintain card secrecy during local play.
- **Robot Arena AI Mode**: Play against automated AI opponents configured with customizable names and three selectable difficulties:
  - **Easy**: Relaxed play with slow AI reaction speeds (1500ms - 3000ms).
  - **Medium**: Smart passing and average reaction speeds (800ms - 1800ms).
  - **Hard**: Optimised card tracking and lightning-fast reactions (300ms - 1000ms).
- **Web Audio Sound System**: Browser-synthesized sound effects (card pass, card select, deck shuffle, stack slam, and victory fanfare) built entirely with the Web Audio API (zero bytes assets footprint, offline-ready).
- **Confetti Celebration**: High-fidelity confetti explosions upon winning powered by `canvas-confetti`.
- **Session Leaderboard**: Persistently tracks wins, penalties, and fastest reaction speeds across game sessions using LocalStorage.
- **Premium Design System**: Dark-themed glassmorphism aesthetic built on Tailwind CSS, supporting layouts optimized for screen sizes ranging from 320px small mobile to full desktop.

---

## 🛠️ Tech Stack

- **React 19** + **Vite** (Powered by Rolldown builder)
- **Tailwind CSS** + **tailwindcss-animate**
- **Framer Motion** (Smoothed page transitions, card flips, and button animations)
- **canvas-confetti** (Celebration bursts)
- **vite-plugin-pwa** (Service worker management and auto-update configuration)
- **React Router v7**

---

## 📦 Getting Started

### 1. Install Dependencies
Ensure you have Node.js installed. Navigate to the root directory and install dependencies:
```bash
npm install --legacy-peer-deps
```

### 2. Launch Development Server
Start Vite's fast dev environment:
```bash
npm run dev
```

### 3. Build & Cache Check
Generate the optimized production-ready bundle and configure PWA Service Workers:
```bash
npm run build
npm run preview
```

---

## ⚙️ Deployment Steps

### Vercel Deployment

Deploying the **16 Chitthi** React application to Vercel takes only a few minutes. Follow these configuration instructions:

#### Option 1: Deploying via Vercel Git Integration (Recommended)
1. Push your code repository to GitHub, GitLab, or Bitbucket.
2. Sign in to your [Vercel Dashboard](https://vercel.com).
3. Click **Add New** -> **Project** and import your Git repository.
4. Vercel will auto-detect **Vite** as the framework preset.
5. In **Build and Development Settings**, verify the default configurations:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Vercel will build the React app, compile the PWA assets, and provision a live HTTPS URL.

#### Option 2: Deploying via Vercel CLI
If you prefer deploying directly from your terminal:
1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```
2. Run the login command:
   ```bash
   vercel login
   ```
3. Initialize the deployment from the project root:
   ```bash
   vercel
   ```
4. Follow the command prompts (use the default project settings and select `dist` as the output directory).
5. Deploy to production:
   ```bash
   vercel --prod
   ```

---

## 🎮 Game Rules & Cycle

1. **Card Setup**: Each player is assigned a unique card name (Chitthi) at start. Exactly 4 duplicate cards are added to the deck for each player.
2. **Circular Passing**: The active player chooses a card to pass. The next player receives this card (temporarily holding 5 cards), selects one card to pass, and passes it along. Hand sizes are always brought back to exactly 4 at the end of each pass.
3. **Winner STACK**: As soon as any player gathers all 4 cards matching their assigned name:
   - The game enters the `winnerReady` state.
   - The winner slams the central **STACK** button to trigger the reaction phase.
   - All other players must react and tap their respective STACK buttons. The slowest player to react receives a **Penalty point**, and the round winner gains a **Win point**.

---

## 🔮 Future Features Roadmap

- [ ] **Global Online Multiplayer**: Real-time lobby and matchmaking systems using WebSockets/WebRTC.
- [ ] **Achievements Store**: Earn and unlock special badges and stats cards.
- [ ] **Custom Deck Themes**: Customizable card skins and themes (traditional, cyber, neon) purchasable from local settings.
- [ ] **Tournament Arena**: Bracket style knockout gameplay supporting up to 32 players in circular groupings.
