# 💧 Aqua — Daily Water Tracker

A beautiful, feature-rich water intake tracker built with React.

## Features

- **Set a daily water goal** — type any amount or pick a preset (1500, 2000, 2500, 3000 ml)
- **Log water intake** — adjust amount with +/− or quick-select buttons (150, 250, 350, 500 ml)
- **Animated water glass** — fills up visually as you drink
- **Goal detection** — celebration banner + chime when you hit your daily goal
- **Sound effects** — satisfying drink sound on log, victory chime on goal completion (togglable)
- **Streak tracking** — tracks consecutive days you've hit your goal 🔥
- **Persistent storage** — data saved to localStorage, survives page reloads
- **History tab** — view the past 14 days with progress bars
- **Delete entries** — remove individual logs or clear today entirely

## Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn

### Run locally

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
npm run build
```

The optimised build will be in the `build/` folder — you can deploy it to any static host (Netlify, Vercel, GitHub Pages, etc.).

## Tech stack

- React 18
- CSS (no UI library — fully custom)
- Web Audio API (for sound effects)
- localStorage (for persistence)
