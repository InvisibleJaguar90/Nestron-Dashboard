# Nestron Dashboard — How To Use

A quick reference for updating the dashboard and sharing it with the team.

---

## One-Time Setup: Connect to Netlify

Do this once. Never again.

1. Go to [netlify.com](https://netlify.com) → sign up or log in
2. Click **Add new site → Import an existing project**
3. Choose **GitHub** → authorize → select `InvisibleJaguar90/Nestron-Dashboard`
4. Leave build settings blank (it's a static site)
5. Click **Deploy site**
6. Optional: rename the URL via **Site settings → General → Site name**
7. Share the URL with your team

From this point on, every time you push to GitHub, Netlify auto-updates within ~30 seconds.

---

## Every Time You Add New Content

### Step 1 — Copy the mock HTML files

Copy the finished mock HTML files from the content machine into the `/mocks/` folder in this project.

```
~/Documents/claude-project/nestron-content-machine/social/mocks/
                    ↓  copy files to  ↓
~/Documents/claude-project/nestron-dashboard/mocks/
```

Name them consistently, e.g.:
```
week_02_linkedin_text_post.html
week_02_instagram_carousel.html
week_02_x_posts.html
week_02_facebook_post.html
```

### Step 2 — Tell Claude to update the schedule

Open this project in Claude Code and say something like:

> "Add a LinkedIn post for April 3, topic is [topic], mock file is `week_02_linkedin_text_post.html`, status is approved"

Claude will update `data/schedule.json` for you. Do this for each new post.

### Step 3 — Push to GitHub

Open Terminal, run these 3 commands:

```bash
cd ~/Documents/claude-project/nestron-dashboard
git add .
git commit -m "Add week 2 mocks — LinkedIn, IG, X, Facebook"
git push
```

Done. Team's link updates automatically within ~30 seconds.

---

## What the commit message should say

The message in quotes is just a label for yourself. Write what changed:

```bash
git commit -m "Add week 3 mocks"
git commit -m "Update April post statuses to approved"
git commit -m "Fix Instagram mock for week 2"
```

No rules — just write something you'd recognize in 3 weeks.

---

## What Your Team Sees

- The full calendar with all scheduled posts
- Clicking a card opens the mock preview (the HTML file) + the copy text
- Filter tabs to view by platform

**They cannot:** edit anything, upload files, or add posts. It's read-only for them.

**You can:** upload mock overrides locally via the card buttons (stored in your browser only — not visible to team unless pushed to the repo).

---

## Status Options for Posts

When telling Claude to add or update a post, use one of these statuses:

| Status | Meaning |
|---|---|
| `draft` | Work in progress, not ready |
| `in_review` | Awaiting approval |
| `approved` | Approved, not yet posted |
| `scheduled` | Queued in scheduling tool |
| `posted` | Live |

---

## Quick Reference: Terminal Commands

```bash
# Navigate to the project
cd ~/Documents/claude-project/nestron-dashboard

# Stage all changes
git add .

# Save a snapshot with a label
git commit -m "your message here"

# Send to GitHub (triggers Netlify redeploy)
git push
```

---

## Files You Touch Regularly

| File | What it is | How it's updated |
|---|---|---|
| `data/schedule.json` | All post metadata | Ask Claude to update it |
| `mocks/` | HTML mock files | Copy from content machine |

**Never edit:** `app.js`, `style.css`, `index.html` — unless Claude is doing it.
