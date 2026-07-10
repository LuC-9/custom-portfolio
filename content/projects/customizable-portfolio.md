---
title: "byluc.in Portfolio"
description: "Dual-persona Next.js 15 portfolio with a cinematic intro, zigzag experience timeline, kinetic marquee, gamification HUD, and Gemini-powered chatbot."
image: "/portfolioSS.png"
tags: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Motion", "Three.js", "Gemini", "Markdown"]
github: "https://github.com/LuC-9/custom-portfolio"
demo: "https://byluc.in"
featured: true
order: 1
---

![Developer persona — vertically centered hero, kinetic marquee, and zigzag experience timeline](/ss1.png)

![Gamer persona — accent recolor, LuC identity, and gaming-oriented featured surfaces](/ss2.png)

A modern, responsive portfolio built on Next.js 15 App Router and React 19. The site runs a dual-persona concept: visitors switch between a developer profile (project bento, work history, engineering blog) and a gamer profile (Twitch/YouTube surfaces, gaming experience, streaming notes). Persona flips the home content, navigation, blog filter, and accent language without a page reload.

## What it does

- **Cinematic intro overlay** on first landing per session, mounted through a React portal so it sits above the game HUD stacking context.
- **Persona toggle** (developer vs gamer) that reroutes home sections, navigation, blog filters, and featured cards.
- **Center-spine zigzag experience timeline** with directional slide-in reveal and a milestone dot on the spine for the active role.
- **Seamless kinetic marquee** of the current tech/games strip (two duplicated halves + `w-max` track for a gapless loop).
- **Featured bento grid** on the home page: developer persona interleaves projects and blog posts across six cells with an asymmetric span map; gamer persona swaps to Twitch/YouTube cards + gamer blogs.
- **Blog page** with persona-aware filtering, keyword search, tag pills, featured cards, and a "More posts" list with an edge-to-edge hairline divider.
- **Gemini-powered chatbot** grounded in a JSON feed built from the site's own projects, work history, gaming experience, and blog content.
- **Blog TL;DR summaries** generated on demand via Gemini 2.5 Flash.
- **Contact form** that ships submissions to Telegram through a server route.
- **Gamification HUD** for the gamer persona: achievements, class card, floating hints, focus toggle, and live Discord status.
- **Persona-aware SEO** with structured data, per-route metadata, and sitemap handlers.

## Tech stack

- **Framework**: [Next.js 15](https://nextjs.org/) App Router on [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) primitives
- **Animation**: [Motion](https://motion.dev/) (formerly Framer Motion) for UI reveals, GSAP + ScrollTrigger for pinned scroll pieces, [Three.js](https://threejs.org/) for accent backgrounds
- **Icons**: [Lucide](https://lucide.dev/) and React Icons
- **Content**: Markdown/MDX parsed with [gray-matter](https://github.com/jonschlinkert/gray-matter), rendered via `unified`, `remark`, and `rehype`
- **AI**: [`@google/genai`](https://www.npmjs.com/package/@google/genai) with Gemini 2.5 Flash
- **Integrations**: Telegram Bot API (contact form), Discord Lanyard (live status), Vercel Analytics

## Content model

Every content type lives in Markdown under `content/`:

- `content/blog/` for essays and build notes
- `content/projects/` for project cards (this file is one of them)
- `content/experience/` for developer work history
- `content/gaming-experience/` for gaming timeline
- `content/home/` for the kinetic marquee's skill and game strings

`lib/content.ts` parses frontmatter, renders Markdown to HTML, and sorts by `order`, then `date`, then `title`.

### Adding a project

```markdown
---
title: "Project Title"
description: "One-line pitch"
image: "/project-image.jpg"
tags: ["Next.js", "TypeScript"]
github: "https://github.com/you/project"
demo: "https://demo.example"
featured: true
order: 1
---

Detailed description in Markdown.
```

Featured project sections read the `featured` flag from frontmatter. Use `order` for deterministic sorting on the projects page.

## Running locally

```bash
git clone https://github.com/LuC-9/custom-portfolio.git
cd custom-portfolio
npm install --legacy-peer-deps
npm run dev
```

`.env.local` is optional for baseline browsing. Gemini chatbot and blog TL;DR are hidden unless `GEMINI_API_KEY` is set. Contact-form delivery requires `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.

## Demo video

The repository ships a production walkthrough at `demo/portfolio-demo.mp4` (tracked via Git LFS) plus a screenshot step log at `demo/steps/`. Regenerate both with:

```bash
npm run record:demo
```

## Source

Full source, environment reference, deployment notes, and troubleshooting live in the [repository README](https://github.com/LuC-9/custom-portfolio#readme).
