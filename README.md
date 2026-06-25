# portfolio

An interactive, terminal-themed personal portfolio for **Niket Gupta**.

It renders like a retro command-line interface: an ASCII-art banner, a
typewriter boot sequence that auto-runs commands on load, a blinking cursor,
a subtle CRT/scanline overlay, and a live input where visitors type commands
to explore content.

## Commands

| Command    | Description                          |
| ---------- | ------------------------------------ |
| `help`     | List all commands                    |
| `about`    | Bio                                  |
| `skills`   | Languages, frameworks & tools        |
| `projects` | Selected projects                    |
| `contact`  | Email, GitHub, LinkedIn              |
| `whoami`   | Current user                         |
| `date`     | Current date & time                  |
| `theme`    | Switch theme: `theme [green\|amber]` |
| `clear`    | Clear the screen (or `Ctrl+L`)       |

Use **↑ / ↓** to browse command history.

## Features

- Green (`#00ff41`) default theme with a runtime amber (`#ffb000`) toggle
- Typewriter animation + auto-run boot sequence
- Command history, auto-scroll, custom terminal scrollbar
- Scanline / CRT overlay, blinking cursor, smooth fade-in output
- Fully responsive; respects `prefers-reduced-motion`
- No frameworks, no build step — just three files

## Run locally

It's a static site, so just open `index.html` in a browser. To mirror real
hosting:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Customize

All personal content lives in the `DATA` object at the top of
[`script.js`](script.js) (marked `--- EDIT ME ---`): bio, skills, projects,
and contact links. The ASCII banner is the `BANNER` constant just below it.

## Deploy

Works on any static host. For GitHub Pages: enable Pages for this repo and
serve from the branch root.
