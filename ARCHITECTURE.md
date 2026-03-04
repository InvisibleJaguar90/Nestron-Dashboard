# ARCHITECTURE.md — Nestron Content Dashboard

## Stack
- HTML / CSS / Vanilla JS
- Static hosting on Netlify (free tier)
- No build tools, no package manager, no dependencies

## Folder structure

```
nestron-dashboard/
├── CLAUDE.md
├── PRD.md
├── ARCHITECTURE.md
├── index.html              ← main dashboard page
├── style.css               ← all styles
├── app.js                  ← dashboard logic (filters, modals, rendering)
├── data/
│   └── schedule.json       ← single source of truth for all scheduled posts
├── mocks/                  ← HTML mock files, copied from content machine
└── assets/
    ├── icons/              ← platform SVG icons (LinkedIn, Instagram, Facebook, X)
    └── thumbnails/         ← optional card preview images
```

## Core files

| File | Purpose |
|---|---|
| index.html | Dashboard shell, card grid container, modal container |
| style.css | All visual styles — layout, cards, badges, modal, tabs |
| app.js | Reads schedule.json, renders cards, handles filtering, modal open/close |
| data/schedule.json | All post metadata — the only file updated regularly |

## Data flow

```
schedule.json → app.js reads on load → renders card grid
card click → modal opens → Full Mock tab (iframe) or Text Only tab (copy)
filter tab click → re-renders grid filtered by platform
```

## Deployment

Netlify free tier. Deploy by dragging the project folder onto the Netlify dashboard.
Redeploy the same way whenever schedule.json or mocks are updated.

## Sync workflow with content machine

```
Content machine                    Dashboard project
───────────────────                ─────────────────
Build mock (HTML)       → copy →   mocks/
Update schedule          → update → data/schedule.json
                                         ↓
                                   Drag-and-drop redeploy
                                   to Netlify (~2 min)
```

Manual copy step is intentional — operator controls what is visible to the team.
