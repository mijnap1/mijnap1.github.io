# Jamie Ryu Portfolio

Hi! I’m Jamie Ryu, and this is my personal portfolio site—a simple, friendly space to share what I build and what I’m into. You’ll find my projects, music picks, and ways to connect, all presented with clean typography, smooth flow, and quick navigation. The site is fully static and available in both English and French.

Green accent: `#a9d400` 💚

## Sections at a Glance

- **Home**: `index.html` (EN), `fr/index.html` (FR)
- **About**: `aboutme/index.html`, `aboutmefr/index.html`
- **Projects**: `project/index.html`, `projectfr/index.html`
- **Music hub**: `music/index.html`, `musicfr/index.html`
- **Music subpages**: `music/kpop/index.html`, `music/jpop/index.html`, `music/kballad/index.html` (and French equivalents under `musicfr/`)
- **Contact**: `contact/index.html`, `contactfr/index.html`
- **Search**: `search/index.html`, `searchfr/index.html`

## Stack & Structure

- **HTML + CSS + vanilla JS** only (no build step)
- **Global styles**: `public/css/app.css`
- **Module styles**: `modules/` (page-specific styling)
- **Shared assets**: `public/` (images, icons, media)

## Local Preview

Option 1: open directly in a browser:

```
open index.html
```

Option 2: run a local server (recommended for relative paths):

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Notes

- The site is intentionally lightweight and fast.
- Mobile behavior is tuned per page with targeted inline overrides where needed.
- English/French content is maintained in parallel directories for clarity.
