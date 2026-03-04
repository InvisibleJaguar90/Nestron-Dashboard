# CLAUDE.md — Nestron Content Dashboard

## What this project is
Static HTML/CSS/JS dashboard displaying the Nestron content pipeline.
Hosted on Netlify. No frameworks, no build tools. Built and maintained by one operator.

## Operational Rules
1. Show plan first
2. Preview file changes before writing
3. Ask before destructive actions

## Tech constraints
- Vanilla JS only — no npm, no bundlers, no frameworks
- All styles in style.css
- All logic in app.js
- Data lives in data/schedule.json
- Mocks are HTML files in /mocks — never edit them here, they are copied from the content machine

## Context files
Always read:
- PRD.md
- ARCHITECTURE.md

## Related project
Content is produced in: ~/Documents/claude-project/nestron-content-machine
Mocks are copied from: nestron-content-machine/social/mocks/
Schedule data is derived from: nestron-content-machine/schedule/
