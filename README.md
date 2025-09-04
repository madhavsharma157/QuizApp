Quiz Master  https://v0-react-quiz-r9v4ion3w-madhavsh2022-9427s-projects.vercel.app/

An interactive quiz application built with Next.js (App Router), TypeScript, and Tailwind CSS v4, featuring a clean UI powered by shadcn/ui and lucide-react icons. Questions are fetched from the public Open Trivia DB API with graceful fallbacks for offline/failed requests.

✨ Features

8-question multiple-choice quiz with mixed categories

Live progress & timer per question

Instant feedback on selected answers

Final results screen with score, breakdown, and high score tracking

LocalStorage persistence for high scores (client only)

Accessible UI: semantic components, focus states, ARIA-friendly patterns

Responsive design using Tailwind CSS v4

Zero-config setup (no env vars required)

🧱 Tech Stack

Next.js (App Router, /app directory)

TypeScript

Tailwind CSS v4 (via @tailwindcss/postcss)

shadcn/ui component primitives

lucide-react icons

Vercel Analytics (lightweight; safe to remove)

Open Trivia DB for questions (with robust local fallback)

🚀 Getting Started
Prerequisites

Node.js 18+ (recommended 20+)

Package manager: npm (examples shown for npm; swap to yarn/pnpm if preferred)

1) Install
npm install

2) Develop
npm run dev


App runs at http://localhost:3000
.

3) Build & Start (production)
npm run build
npm start


No environment variables are required.

📁 Project Structure (abridged)
├─ app
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  ├─ ui
│  └─ quiz
├─ lib
│  └─ quiz-api.ts
├─ hooks
│  └─ use-local-storage.ts
├─ types
│  └─ quiz.ts
├─ public
├─ postcss.config.mjs
├─ tailwind.config.ts
├─ next.config.mjs
└─ package.json


Key paths:

app/ — App Router entry points (layout.tsx, page.tsx) and global styles

components/ui/ — shadcn/ui primitives (button, card, switch, etc.)

components/quiz/ — quiz core: timer, question card, results, container

lib/quiz-api.ts — trivia fetcher + robust fallback question set

hooks/use-local-storage.ts — typed LocalStorage helper

types/quiz.ts — TypeScript types for questions & state

public/ — placeholder assets

postcss.config.mjs — Tailwind v4 via PostCSS

next.config.mjs — relaxed TS/ESLint during builds, unoptimized images

🧪 Scripts
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}


Common:

dev – start Next.js dev server

build – production build

start – run built app

lint – Next.js lint (currently ignored during build per config)

🧰 Configuration Notes

Tailwind v4 is imported in app/globals.css with CSS variables for light/dark theming.

Images are unoptimized in next.config.mjs to simplify static hosting/CDN.

TypeScript/ESLint errors are ignored during builds (tune next.config.mjs to enforce).

🌐 Data Source

Primary: Open Trivia DB (https://opentdb.com/api.php?...)

If the API fails or is unreachable, a curated fallback set in lib/quiz-api.ts is used automatically.

♿ Accessibility

Buttons and interactive elements use accessible primitives from shadcn/ui.

Live regions & status text (e.g., “Selected: Option A”) assist screen readers.

High-contrast focus styles via Tailwind and CSS variables.

🛠️ Customization

Update theme tokens in app/globals.css.

Extend UI by composing from components/ui/*.

Adjust question count or timing in components/quiz/quiz.tsx and components/quiz/quiz-timer.tsx.

🚢 Deploy

Vercel is recommended for one-click Next.js deployments.

Ensure build and start scripts are available (already set).

Static assets live under public/.
