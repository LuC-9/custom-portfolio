# Feature Inventory Checklist

Use this when planning a demo script. Walk the app manually or read source before writing selectors.

## Discovery sources

1. `README.md` features section
2. App router / routes directory (`app/`, `pages/`, `src/routes/`)
3. Navigation components (header, sidebar, tabs)
4. User-facing toggles (theme, mode, persona, language)
5. Interactive widgets (search, filters, dialogs, drawers)

## Standard sections (adapt per project)

| # | Section | What to show | Typical selectors |
| --- | --- | --- | --- |
| 1 | Intro | Title card + landing hero | `h1`, hero CTA |
| 2 | Navigation | Primary nav links | `nav a[href="..."]` |
| 3 | Core feature A | Main value prop #1 | buttons, toggles, cards |
| 4 | Core feature B | Main value prop #2 | tabs, modals |
| 5 | Data / content | Lists, grids, detail views | `.grid`, `table`, `article` |
| 6 | Search / filter | Query + filter chips | `input[type="search"]`, filter buttons |
| 7 | Forms | Fill sample data (don't submit unless safe) | `input`, `textarea`, `select` |
| 8 | Settings / profile | Preferences, account | settings route, toggles |
| 9 | Responsive / theme | Dark mode, layout modes (if applicable) | theme toggle |
| 10 | Outro | Closing title card + URL | `showTitleCard()` |

## Selector tips

- Prefer stable attributes: `[aria-label]`, `[data-testid]`, `name=`, `href=`
- Avoid brittle text unless unique: `button:has-text("Save")`
- After navigation, call `preparePage()` (included in `goto()`)
- Use `{ zoom: 1.35 }` on every interactive click
- Scroll before clicking off-screen elements

## Timing budget (~90 s total)

| Element | Duration |
| --- | --- |
| Title card (intro) | 2.2 s |
| Section label | 1.6 s visible |
| Zoom + click | 1.5–2.5 s |
| Page transition | 0.8–1.2 s |
| Scroll segment | 1.0–2.0 s |
| Title card (outro) | 2.2 s |

## Skip or mock

- External OAuth / payment flows
- Destructive actions (delete, send real email)
- Features requiring secrets (AI chatbot without API key — note in label or skip)
- Infinite scroll — scroll one page only
