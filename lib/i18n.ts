export type Locale = "en" | "fr";

export type PageKey =
  | "home"
  | "about"
  | "project"
  | "music"
  | "music-kpop"
  | "music-jpop"
  | "music-kballad"
  | "contact"
  | "search"
  | "playground"
  | "archive-music"
  | "archive-music-kpop"
  | "archive-music-jpop"
  | "archive-music-kballad";

// The site keeps its original URL scheme: French pages live under
// sibling paths ("/aboutmefr/") rather than a "/fr/" prefix.
const ROUTES: Record<PageKey, Record<Locale, string>> = {
  home: { en: "/", fr: "/fr/" },
  about: { en: "/aboutme/", fr: "/aboutmefr/" },
  project: { en: "/project/", fr: "/projectfr/" },
  music: { en: "/music/", fr: "/musicfr/" },
  "music-kpop": { en: "/music/kpop/", fr: "/musicfr/kpop/" },
  "music-jpop": { en: "/music/jpop/", fr: "/musicfr/jpop/" },
  "music-kballad": { en: "/music/kballad/", fr: "/musicfr/kballad/" },
  contact: { en: "/contact/", fr: "/contactfr/" },
  search: { en: "/search/", fr: "/searchfr/" },
  playground: { en: "/playground/", fr: "/playground/" },
  "archive-music": { en: "/archive/music/", fr: "/archive/musicfr/" },
  "archive-music-kpop": { en: "/archive/music/kpop/", fr: "/archive/musicfr/kpop/" },
  "archive-music-jpop": { en: "/archive/music/jpop/", fr: "/archive/musicfr/jpop/" },
  "archive-music-kballad": { en: "/archive/music/kballad/", fr: "/archive/musicfr/kballad/" },
};

export function href(page: PageKey, locale: Locale): string {
  return ROUTES[page][locale];
}

export function pick<T>(locale: Locale, values: Record<Locale, T>): T {
  return values[locale];
}
