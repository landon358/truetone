# TrueTone Interiors

Marketing site for TrueTone Interiors, LLC (interior painting and cabinet refinishing, Lansing, Michigan).

## Deploy

No build step. Upload the folder contents to a repo root, then Settings → Pages → Deploy from a branch → `/ (root)`. `index.html` is the home page.

## Pages

- `index.html` — home. Hero, trust bar, then short previews of services, work, reviews and about, each linking to its own page
- `services.html` — prep, the four main services, the "also" list, cabinet refinishing
- `work.html` — kitchen before/after, full recent work grid
- `reviews.html` — trust bar, three reviews, the Nextdoor quote
- `about.html` — Javonnie, the values list, how a project runs
- `contact.html` — the free estimate form, phone, email, service area

## Shared files

- `site.js` — nav links, footer links, phone/email/service area, the work and review lists, and the header scroll/menu logic. **Edit links and contact details here, not in the individual pages.**
- `support.js` — component runtime (required)
- `motion.js` — GSAP scroll reveals and header veil
- `img/` — project photos and logo

Each page's `<script type="text/x-dc">` block calls `TTSite.mount/vals/unmount`, so the header and footer behave the same everywhere. The header and footer *markup* is repeated in each page; if you restyle it, change all six.

Fonts (Cabinet Grotesk, Satoshi) and GSAP load from CDNs. Content stays readable if they fail.

## Before launch

- Connect the estimate form on `contact.html` to an inbox or form service (it only confirms in the browser today)
- Replace photos with higher resolution originals and add a headshot of Javonnie
- Set a custom domain (e.g. truetoneinteriorsmi.com) and a domain email
