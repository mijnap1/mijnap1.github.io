"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { href, type Locale, type PageKey } from "@/lib/i18n";
import { SiteChrome } from "../chrome/SiteChrome";
import { Animated } from "../motion/Animated";
import "./search-page.css";

type Localized = Record<Locale, string>;

type Entry = {
  page: PageKey;
  /** Section anchor or project hash appended to the page URL. */
  hash?: string;
  section: Localized;
  title: Localized;
  description: Localized;
  keywords: Localized;
};

const ABOUT = { en: "About", fr: "À Propos" };
const PROJECTS = { en: "Projects", fr: "Projets" };
const MUSIC = { en: "Music", fr: "Musique" };

const INDEX: Entry[] = [
  {
    page: "home",
    section: { en: "Home", fr: "Accueil" },
    title: { en: "Home", fr: "Accueil" },
    description: { en: "Main landing page and quick overview.", fr: "Page d'accueil principale et aperçu rapide." },
    keywords: { en: "home main landing overview", fr: "accueil principal aperçu" },
  },
  {
    page: "about",
    section: ABOUT,
    title: { en: "About Me", fr: "À Propos de Moi" },
    description: { en: "Background, story, and skills.", fr: "Arrière-plan, histoire et compétences." },
    keywords: { en: "about aboutme story skills", fr: "à propos aboutme histoire compétences" },
  },
  {
    page: "about",
    hash: "about-story",
    section: ABOUT,
    title: { en: "Who I Am", fr: "Qui je suis" },
    description: { en: "Quick intro and background.", fr: "Brève présentation et parcours." },
    keywords: { en: "about who i am intro background", fr: "à propos qui je suis présentation parcours" },
  },
  {
    page: "about",
    hash: "about-experience",
    section: ABOUT,
    title: { en: "Life Experience", fr: "Expérience de vie" },
    description: { en: "Photo folders and life moments.", fr: "Dossiers photo et moments de vie." },
    keywords: { en: "about experience la sg folders", fr: "à propos expérience la sg dossiers photos" },
  },
  {
    page: "about",
    hash: "about-skills",
    section: ABOUT,
    title: { en: "Skills", fr: "Compétences" },
    description: { en: "Technical skills and tools.", fr: "Compétences techniques et outils." },
    keywords: { en: "about skills tools tech", fr: "à propos compétences outils tech" },
  },
  {
    page: "project",
    hash: "scratch",
    section: PROJECTS,
    title: { en: "Scratch 3.0", fr: "Scratch 3.0" },
    description: { en: "Visual programming language projects.", fr: "Projets de langage de programmation visuel." },
    keywords: { en: "scratch projects portfolio", fr: "scratch projets portfolio" },
  },
  {
    page: "project",
    hash: "mysemester",
    section: PROJECTS,
    title: { en: "MySemester", fr: "Mon Semestre" },
    description: { en: "Grade planner web app.", fr: "Application web de planification de notes." },
    keywords: { en: "mysemester semester planner grades", fr: "mon semestre planificateur notes mysemester" },
  },
  {
    page: "project",
    hash: "detector",
    section: PROJECTS,
    title: { en: "AI SLOP Detector", fr: "AI SLOP Detector" },
    description: { en: "AI writing analysis tool.", fr: "Outil d'analyse de texte IA." },
    keywords: {
      en: "ai slop detector ai writing text detection transformer heuristics",
      fr: "ai slop detector analyse texte ia détection écriture transformeur heuristiques",
    },
  },
  {
    page: "project",
    hash: "notion-timer",
    section: PROJECTS,
    title: { en: "Notion Timer", fr: "Minuteur Notion" },
    description: { en: "Pomodoro-style timer for Notion.", fr: "Minuteur style Pomodoro pour Notion." },
    keywords: { en: "notion timer productivity", fr: "notion minuteur productivité" },
  },
  {
    page: "project",
    hash: "team-tomorrow",
    section: PROJECTS,
    title: { en: "TeamTomorrow", fr: "TeamTomorrow" },
    description: { en: "EdTech and mentoring platform.", fr: "Plateforme EdTech et de mentorat." },
    keywords: { en: "teamtomorrow mentoring education", fr: "teamtomorrow mentorat éducation" },
  },
  {
    page: "project",
    hash: "utkcc",
    section: PROJECTS,
    title: { en: "UTKCC", fr: "UTKCC" },
    description: { en: "University of Toronto Korean Community.", fr: "Communauté Coréenne de l'Université de Toronto." },
    keywords: { en: "utkcc uoft community", fr: "utkcc uoft communauté" },
  },
  {
    page: "project",
    hash: "lftimes",
    section: PROJECTS,
    title: { en: "LFTimes", fr: "LFTimes" },
    description: { en: "Student news publication.", fr: "Publication d'actualités étudiantes." },
    keywords: { en: "lftimes news publication", fr: "lftimes actualités publication" },
  },
  {
    page: "music",
    section: MUSIC,
    title: { en: "Music", fr: "Musique" },
    description: { en: "Personal music and hobbies.", fr: "Musique personnelle et loisirs." },
    keywords: { en: "music playlists kpop jpop kballad", fr: "musique playlists kpop jpop kballad loisirs" },
  },
  {
    page: "music",
    section: MUSIC,
    title: { en: "Curated Playlists", fr: "Playlists choisies" },
    description: { en: "Playlists and genres I listen to most.", fr: "Les playlists et genres que j'écoute le plus." },
    keywords: { en: "music playlists curated genres", fr: "musique playlists genres" },
  },
  ...(["kpop", "jpop", "kballad"] as const).map(
    (genre): Entry => {
      const name = genre.charAt(0).toUpperCase() + genre.slice(1);
      const label = { kpop: "K-pop", jpop: "J-pop", kballad: "K-ballad" }[genre];
      return {
        page: `music-${genre}`,
        section: MUSIC,
        title: { en: `${name} Playlist`, fr: `Playlist ${name}` },
        description: { en: `Curated ${label} playlist.`, fr: `Playlist ${label} choisie.` },
        keywords: { en: `music ${genre} playlist`, fr: `musique ${genre} playlist` },
      };
    },
  ),
  {
    page: "contact",
    section: { en: "Contact", fr: "Contact" },
    title: { en: "Contact", fr: "Contact" },
    description: { en: "Reach out, socials, and email.", fr: "Contactez-nous, réseaux sociaux et email." },
    keywords: { en: "contact email socials", fr: "contact email réseaux sociaux" },
  },
  {
    page: "search",
    section: { en: "Search", fr: "Recherche" },
    title: { en: "Search", fr: "Recherche" },
    description: { en: "Search across the site.", fr: "Rechercher sur le site." },
    keywords: { en: "search", fr: "recherche" },
  },
];

const COPY = {
  en: {
    placeholder: "Search anything...",
    label: "Search the site",
    empty: "No matches yet. Try a different keyword.",
    count: (n: number) => `${n} result${n === 1 ? "" : "s"}`,
  },
  fr: {
    placeholder: "Rechercher...",
    label: "Rechercher sur le site",
    empty: "Aucun résultat pour le moment. Essayez un mot-clé différent.",
    count: (n: number) => `${n} résultat${n === 1 ? "" : "s"}`,
  },
} satisfies Record<Locale, unknown>;

const RESULT_STAGGER_MS = 40;

function search(query: string, locale: Locale): Entry[] {
  const needle = query.toLowerCase().trim();
  if (!needle) {
    return [];
  }
  return INDEX.filter((entry) =>
    `${entry.title[locale]} ${entry.description[locale]} ${entry.keywords[locale]}`.toLowerCase().includes(needle),
  );
}

export function SearchPage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [query, setQuery] = useState("");
  // The "no matches" hint only appears once something has been searched.
  const [searched, setSearched] = useState(false);
  // Results fade in a frame after they render (the CSS transitions on .is-visible).
  const [visibleFor, setVisibleFor] = useState("");
  const matches = search(query, locale);
  const active = query.trim() !== "";

  // `/search/?s=keyword` opens with that search already filled in.
  useEffect(() => {
    const preset = new URLSearchParams(window.location.search).get("s");
    if (preset) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the query string is only readable after hydration
      setQuery(preset);
      setSearched(true);
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisibleFor(query));
    return () => cancelAnimationFrame(frame);
  }, [query]);

  return (
    <SiteChrome locale={locale} page="search">
      <div className="container">
        <div className="row">
          <div className="col-md-8 col-md-offset-2">
            <Animated trigger="now" show="fadeInUp" hide="fadeOutUp" showDelay={50}>
              <div className={`search-page${active ? " search-page--active" : ""}`}>
                <form id="search_main_form" role="search" onSubmit={(event) => event.preventDefault()}>
                  <div className="form-group gr-form">
                    <input
                      className="gr-field"
                      type="search"
                      name="s"
                      value={query}
                      onChange={(event) => {
                        setQuery(event.target.value);
                        setSearched(true);
                      }}
                      placeholder={copy.placeholder}
                      autoComplete="off"
                      enterKeyHint="search"
                      aria-label={copy.label}
                    />
                  </div>
                </form>
                <div className="search-results-wrap">
                  <div className="search-count" id="search-count" aria-live="polite">
                    {matches.length ? copy.count(matches.length) : ""}
                  </div>
                  <div
                    className={`search-results${matches.length && visibleFor === query ? " is-visible" : ""}`}
                    id="search-results"
                  >
                    {matches.map((entry, index) => (
                      <a
                        key={`${entry.page}-${entry.hash ?? ""}-${entry.title.en}`}
                        className="search-result"
                        href={`${href(entry.page, locale)}${entry.hash ? `#${entry.hash}` : ""}`}
                        style={{ transitionDelay: `${index * RESULT_STAGGER_MS}ms` } as CSSProperties}
                      >
                        <div className="search-result-meta">{entry.section[locale]}</div>
                        <div className="search-result-title">{entry.title[locale]}</div>
                        <div className="search-result-desc">{entry.description[locale]}</div>
                      </a>
                    ))}
                  </div>
                  <div className="search-empty" id="search-empty" style={{ display: searched && !matches.length ? "block" : "none" }}>
                    {copy.empty}
                  </div>
                </div>
              </div>
            </Animated>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
