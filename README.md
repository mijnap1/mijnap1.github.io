# Jamie Ryu Portfolio

Hi! I’m Jamie Ryu, and this is my personal portfolio site—a simple, friendly space to share what I build and what I’m into. You’ll find my projects, music picks, and ways to connect, all presented with clean typography, smooth flow, and quick navigation. The site is available in both English and French.

Green accent: `--brand-accent` uses `#a9d400` in light mode and `#8fae12` in dark mode.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- Exported as static HTML (`output: "export"`) and deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`
- Styling is the site's original CSS (`styles/` for site-wide rules, a `*.css` next to each page component for page rules)

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static site in out/
```

## Where things live

| Page | URL (EN / FR) | Component |
| --- | --- | --- |
| Home | `/` · `/fr/` | `components/home/HomePage.tsx` |
| About | `/aboutme/` · `/aboutmefr/` | `components/about/AboutPage.tsx` |
| Projects | `/project/` · `/projectfr/` | `components/project/ProjectPage.tsx` (data in `projects.ts`) |
| Music | `/music/` · `/musicfr/` | `components/music/MusicStagePage.tsx` |
| Playlists | `/music/kpop/` … · `/musicfr/kpop/` … | `components/music/PlaylistPage.tsx` (data in `playlists.ts`) |
| Music archive | `/archive/music/` · `/archive/musicfr/` | `components/music/ArchiveMusicPage.tsx` |
| Contact | `/contact/` · `/contactfr/` | `components/contact/ContactPage.tsx` |
| Search | `/search/` · `/searchfr/` | `components/search/SearchPage.tsx` |
| Playground | `/playground/` | `components/playground/PlaygroundPage.tsx` |

- `app/(en)` and `app/(fr)` hold the routes; each language has its own root layout so `<html lang>` is right.
- Text for both languages sits next to each component (`COPY = { en, fr }`), so a page is edited once.
- `components/chrome/SiteChrome.tsx` is the shared logo, menu, socials, theme toggle and footer.
- `components/motion/` replaces the old jQuery animation system: `<Animated show="fadeInUp" hide="fadeOutUp">`.
- Live Toronto time and weather come from `lib/weather.ts` (Environment Canada + Open-Meteo).
- Static files are in `public/` (`/ico/...`, `/resume.pdf`). `public/UTime` and `public/utime-privacy` are standalone pages copied as-is.
