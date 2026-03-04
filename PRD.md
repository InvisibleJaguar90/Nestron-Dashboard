# PRD.md — Nestron Content Dashboard

## Purpose
A static web dashboard that displays the Nestron scheduled content pipeline.
Team members visit a URL, see all upcoming posts organized by platform and week,
and can click any post to view the full mock or read the copy in text form.

No login. No backend. No database. Files and a hosted URL.

---

## Users
- **Operator (solo):** Maintains schedule.json, copies mocks, deploys updates
- **Team / management:** View-only. Visit URL, browse pipeline, review content before publish

---

## Core features

### 1. Card grid
- One card per scheduled post
- Each card displays: platform icon, scheduled date, topic title, status badge, post type
- Cards sorted by scheduled date ascending

### 2. Platform filter tabs
- Tabs across top: `All` `LinkedIn` `Instagram` `Facebook` `X`
- Clicking a tab filters the grid to that platform only
- Active tab is visually highlighted

### 3. Status badges
Color-coded badge on each card:

| Status | Color |
|---|---|
| draft | gray |
| in_review | amber |
| approved | green |
| scheduled | blue |
| published | dark / muted |

### 4. Post modal
Clicking any card opens a modal overlay with:
- Post title and platform at the top
- Two tabs: `Full Mock` and `Text Only`
- **Full Mock tab:** renders the HTML mock file in an iframe
- **Text Only tab:** displays the full post copy, clean and readable
- Close button (top right) and click-outside-to-close behavior

---

## Data schema — data/schedule.json

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
      "copy": "Full post copy goes here. This is what shows in the Text Only tab."
    }
  ]
}
```

**Platform values:** `linkedin` | `instagram` | `facebook` | `x`

**Status values:** `draft` | `in_review` | `approved` | `scheduled` | `published`

**Type values:** `text_post` | `carousel` | `image_post` | `video_post`

---

## Design direction
- Clean, modern, professional
- Dark or light — TBD at build time, operator preference
- Platform icons in cards — SVG preferred
- Typography: system font stack, no Google Fonts dependency
- Responsive — readable on laptop and tablet (mobile not required)

---

## Out of scope (v1)
- Authentication / login
- Commenting or approval workflows
- Automated sync with content machine
- Email notifications
- Analytics or performance data

---


