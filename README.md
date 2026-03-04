# Nestron Content Dashboard

A static content pipeline dashboard for planning and reviewing scheduled social media posts. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies.

**Live:** deployed on Netlify (drag-and-drop, ~2 min to update)

---

## What it does

The dashboard gives the Nestron team a single URL to visit and review the full content pipeline: what's scheduled, what's in review, and what's already published — organized as a calendar with mock previews.

### Views

| View | Description |
|---|---|
| **Month** | Grid of all 42 cells (Mon–Sun). Posts appear as compact platform-colored chips. |
| **Week** | 7-column layout with full scaled mock previews and hover overlays. |
| **All** | Scrollable agenda grouped by month, auto-scrolls to current month. |

### Features

- **Platform filter tabs** — All · LinkedIn · Instagram · Facebook · X · Newsletter · Blog
- **Status badges** — Draft · In Review · Approved · Scheduled · Published. Click any badge to cycle status (saved to `localStorage`).
- **Mock previews** — HTML mock files render in a sandboxed iframe. Click any card to open the full mock or the post copy text.
- **Local drafts** — Add new posts directly in the browser with the `+` button. Drafts persist in `localStorage`, including optional mock file upload.
- **Edit any post** — Edit button on every card pre-fills the form; saving creates a local override that takes precedence over `schedule.json`.
- **Shareable URLs** — Current view, platform filter, and date position are written to the URL bar so links can be copied and shared.
- **Month picker** — Click the calendar title to jump to any month/year.

---

## Stack

- Vanilla JS, HTML5, CSS3
- No npm, no bundler, no framework
- Hosted on Netlify (free tier)
- Data in `data/schedule.json`
- Local state in `localStorage`

---

## Project structure

```
nestron-dashboard/
├── index.html          ← dashboard shell (no inline logic or styles)
├── style.css           ← all styles, CSS custom properties in :root
├── app.js              ← all logic (fetch, render, filter, modal, calendar)
├── data/
│   └── schedule.json   ← single source of truth for all scheduled posts
├── mocks/              ← HTML mock files (copied from content machine)
└── assets/
    └── product/        ← product photography used in mocks
```

---

## Running locally

The app uses `fetch()` to load `schedule.json`, so it must be served over HTTP — not opened as a file.

```bash
cd nestron-dashboard
python3 -m http.server 8000
# open http://localhost:8000
```

---

## Data schema — `data/schedule.json`

```json
{
  "posts": [
    {
      "id": "w01_linkedin_01",
      "platform": "linkedin",
      "type": "text_post",
      "topic": "ADU permit myths debunked",
      "status": "approved",
      "scheduled_date": "2026-03-10",
      "week": 1,
      "mock_file": "mocks/week_01_linkedin_text_post.html",
      "copy": "Post copy text here…"
    }
  ]
}
```

**Platform values:** `linkedin` | `instagram` | `facebook` | `x` | `newsletter` | `blog`

**Status values:** `draft` | `in_review` | `approved` | `scheduled` | `published`

**Type values:** `text_post` | `carousel` | `image_post` | `video_post`

---

## Operator workflow

### Updating the pipeline

1. Build mocks and update the schedule in the [content machine](../nestron-content-machine/)
2. Copy new `.html` mocks into `mocks/`
3. Update `data/schedule.json` with new post entries
4. Redeploy to Netlify (drag-and-drop the project folder)

### Local drafts vs. schedule.json

Posts can be created directly in the browser using the `+` button on any calendar day. These **local drafts** are stored in `localStorage` and are only visible in that browser — they're useful for staging or planning before the content machine produces the final mock.

Clicking **Edit** on any card (including `schedule.json` posts) opens the edit form. Saving creates a local override with the same ID that takes precedence over the JSON file until the browser data is cleared.

---

## Deployment

Netlify free tier. No build step needed — just drag the project folder onto the Netlify dashboard.

To update: make changes to `schedule.json` and/or `mocks/`, then drag-and-drop redeploy (~2 min).

---

## Related

Content is produced in: [`nestron-content-machine`](../nestron-content-machine/)
Mocks are copied from: `nestron-content-machine/social/mocks/`
Schedule data is derived from: `nestron-content-machine/schedule/`
