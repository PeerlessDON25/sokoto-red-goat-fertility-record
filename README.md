# Sokoto Red Goat Fertility Record Book

Offline-first PWA that digitizes the paper fertility record book for the Sokoto Red Goat. Built with React, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Hook Form + Zod, and TanStack Table. All data is persisted in the browser — no backend required.

## Features
- Simple username / password login (credentials stored locally, editable in Settings)
- Farm Information (name, owner, location, record year, veterinary supervisor)
- Fertility Records with full CRUD, search, sort, pagination, CSV export, print layout
- Auto-suggested expected kidding date (150-day goat gestation)
- Mobile-first responsive brown / cream / dark-green / white palette
- Installable as a PWA on Android, iOS, and desktop

## Getting started
```
bun install
bun run dev
bun run build
```
Default credentials: `admin` / `goat2026`. Change them from Settings after your first sign-in.

## Data storage
All state lives in `window.localStorage` under the `srg.*` keys defined in `src/lib/storage.ts`. Swap that module to migrate to IndexedDB or Firebase without touching the UI.

## Deployment
The build output is a static site — deploy `dist/` to GitHub Pages, Netlify, Vercel, or any static host.