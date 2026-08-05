# Hamza Slimani — ZEUS · Portfolio

A static, no-build-tools portfolio site (plain HTML/CSS/JS). Deploys straight to Vercel from Git.

Repo: https://github.com/hamza030220/About_me

## Before you deploy — edit these

1. **Links** are already set in `index.html`, inside `<footer class="connect">`: GitHub, LinkedIn, and email.
2. Optional: add a real favicon (`favicon.ico`) in this folder and link it in `<head>` if you want one.

## Deploy with Git + Vercel

```bash
# from inside this folder
git init
git add .
git commit -m "portfolio: initial version"

# create a repo on GitHub (via github.com or gh CLI), then:
git remote add origin https://github.com/hamza030220/About_me.git
git branch -M main
git push -u origin main
```

Then on [vercel.com](https://vercel.com):
1. **Add New → Project**
2. Import the GitHub repo you just pushed
3. Framework preset: **Other** (it's static HTML — no build step needed)
4. Leave Build Command / Output Directory blank
5. Deploy

You'll get a `your-project.vercel.app` URL — that's what goes in your Instagram bio. You can also add a custom domain later from the Vercel project settings.

## Local preview

No build step needed — just open `index.html` in a browser, or run a tiny local server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Structure

```
index.html   – all page content/sections
style.css    – design system (colors, type, layout, animations)
script.js    – interactions: boot terminal, cursor, tilt, parallax, reveals
```

## Design concept

The site runs on two "modes" that mirror a dual identity:

- **Engineer mode** (hero → skills): dark background, animated circuit traces, terminal boot sequence, PCB-style project cards with status LEDs that light up on scroll.
- **Create mode** (hobbies → philosophy): triggered by a toggle switch, shifts to a warmer amber accent and softer rounded cards for the design/storytelling/creative section.

Colors, type, and content pull from the portfolio spec — palette is green (`#49AD32`) and cream (`#FEFBDE`) on a near-black base in Engineer mode, amber (`#E8B84B`) in Create mode.

## Motion & interaction highlights

- Neon scroll-progress rail and a custom smooth-follow cursor with contextual HUD labels
- Mode toggle switches the whole site theme between Engineer (green) and Create (amber)
- Hero mouse parallax and magnetic call-to-action buttons
- Project cards: 3D mouse tilt plus a diagonal scan-beam sweep on hover
- Scroll-triggered section-title stagger reveal and eyebrow text-scramble effect
- Scrolling tech ticker and a self-drawing timeline with glowing nodes
- Timeline highlights: red neon "4/5" progress indicator for the current engineering level, and an orange double-hit "COMBO ×2" module for repeat internships
- Respects `prefers-reduced-motion` throughout

## Local development notes

This folder is its own standalone Git repository — it is not nested inside any other project's version control. Run all `git` commands from inside `about_me/`.
