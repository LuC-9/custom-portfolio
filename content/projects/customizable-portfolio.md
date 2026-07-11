---
title: "byluc.in Portfolio"
description: "Dual-persona Next.js 15 portfolio with a cinematic intro, kinetic marquee framing the portrait, staircase career section, snap-scrolled landmarks, CSS scroll-driven reveals, a gamification HUD, and a Gemini-powered chatbot."
image: "/portfolioSS.png"
tags: ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Motion", "Three.js", "Gemini", "Markdown"]
github: "https://github.com/LuC-9/custom-portfolio"
demo: "https://byluc.in"
featured: true
order: 1
---

![Developer persona — centered hero with skills marquee framing the portrait, staircase experience section, and 3×3 featured bento with the byluc.in project as the anchor tile](/ss1.png)

![Gamer persona — LuC identity with the games marquee framing the portrait, gaming staircase, and Twitch / YouTube channel-banner cards above the featured blogs](/ss2.png)

A modern, responsive portfolio built on Next.js 15 App Router and React 19. The site runs a dual-persona concept: visitors switch between a developer profile (project bento, work history, engineering blog) and a gamer profile (Twitch/YouTube surfaces, gaming experience, streaming notes). Persona flips the home content, navigation, blog filter, and accent language without a page reload.

## What it does

- **Cinematic intro overlay** on first landing per session, mounted through a React portal so it sits above the game HUD stacking context.
- **Persona toggle** (developer vs gamer) that reroutes home sections, navigation, blog filters, and featured cards.
- **Kinetic marquee frame around the hero portrait**: two seamless skill / game strips (top runs forward, bottom runs reverse) wrap the image like a conveyor belt. Items pack tight with a 24px gap (source list duplicated 3× per half) so the rhythm reads as a continuous band instead of a few skills spread across the viewport.
- **Staircase career section**: each role is a uniform 19.5rem "step" card that indents further left as you go back in time (mr-0 / mr-24 / mr-48 / mr-72 in Tailwind), with a small stick-figure climber standing on top of every step — arms raised in a V, always visible on md+. Every card wears a `▲ Step N / total` badge so the layout reads bottom-left → top-right as an actual staircase. Cards stay compact by default; skills chips and long-form descriptions expand together on `:hover` / `:focus-within` via a CSS `grid-template-rows: 0fr → 1fr` animation with no JS state.
- **3×3 featured bento** on the home page: developer persona groups all three projects together (byluc.in as a 2×2 anchor top-left, plus two 1×1 project cards filling the right column) and all three featured blogs together across the bottom row. Project cards open the same rich popup as the `/projects` grid. Gamer persona swaps to Twitch + YouTube channel-banner cards (rendered at `aspect-video`) followed by featured gaming blogs.
- **Landmark scroll snap** with `scroll-snap-type: y mandatory` on `html` and `snap-start` on hero / experience / featured / footer, so a real scroll gesture jumps hero → experience directly and the marquee frame stays in view as part of the hero.
- **CSS scroll-driven reveals** (`animation-timeline: view()`) power the marquee band and the featured grid's staggered fade-ups, running off the compositor without JS scroll handlers or IntersectionObservers. Guarded by `@supports` and reduced-motion, with a plain fully-visible fallback.
- **Hidden native scrollbar** so the dark theme reads clean while wheel / touch / keyboard scrolling still work.
- **Blog page** with persona-aware filtering, keyword search, tag pills, featured cards, and a "More posts" compact list — every card surface (home bento, `/blog` featured, `/blog` compact rows) picks up a thumbnail when the blog frontmatter includes an `image:` field; blogs without one collapse gracefully to a text-only layout.
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
