"use client";

import { useEffect, useRef } from "react";
import { href, type Locale, type PageKey } from "@/lib/i18n";
import { SiteChrome } from "../chrome/SiteChrome";
import { Animated } from "../motion/Animated";
import { PLAYLIST_DATE, PLAYLISTS, type Genre } from "./playlists";
import "./archive-page.css";

const COPY = {
  en: {
    navLabel: "music (archive)",
    back: "Back",
    heading: "Music",
    intro: (
      <>
        Music genres I’ve blended <span className="mobile-line">into my most-played playlists.</span>
      </>
    ),
    tracks: "tracks",
  },
  fr: {
    navLabel: "musique",
    back: "Retour",
    heading: "Musique",
    intro: <>Genres musicaux que j&apos;ai mélangés dans mes playlists les plus écoutées.</>,
    tracks: "pistes",
  },
} satisfies Record<Locale, unknown>;

const CARDS: { genre: Genre; label: string; cover: string; alt: string }[] = [
  { genre: "kpop", label: "🇰🇷 kpop", cover: "/ico/music/main-cover/palette.jpg", alt: "K-pop cover" },
  { genre: "jpop", label: "🇯🇵 jpop", cover: "/ico/music/main-cover/aotonatsu.jpg", alt: "J-pop cover" },
  { genre: "kballad", label: "🎤 kballad", cover: "/ico/music/main-cover/puzzle.jpg", alt: "K-ballad cover" },
];

const STROKE_DURATION_S = 2.6;
const STROKE_STAGGER_S = 0.04;

/** The "My interest" logo writes itself stroke by stroke, then fills in. */
function HandwritingLogo() {
  const objectRef = useRef<HTMLObjectElement>(null);

  useEffect(() => {
    const object = objectRef.current;
    if (!object) {
      return;
    }
    let fillTimer = 0;
    function draw() {
      const svgDoc = object?.contentDocument;
      if (!svgDoc) {
        return;
      }
      const paths = Array.from(svgDoc.querySelectorAll("path"));
      paths.forEach((path, i) => {
        const length = path.getTotalLength();
        Object.assign(path.style, {
          fill: "none",
          stroke: "#000",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeDasharray: String(length),
          strokeDashoffset: String(length),
          animation: `handwriting-draw ${STROKE_DURATION_S}s ease forwards`,
          animationDelay: `${i * STROKE_STAGGER_S}s`,
        });
      });
      const lastDelay = Math.max(0, paths.length - 1) * STROKE_STAGGER_S;
      fillTimer = window.setTimeout(() => {
        paths.forEach((path) => {
          path.style.fill = "#000";
          path.style.stroke = "transparent";
        });
        svgDoc.querySelector("svg")?.classList.add("is-drawn");
      }, (lastDelay + STROKE_DURATION_S) * 1000);
    }
    object.addEventListener("load", draw);
    // The SVG may already have loaded before hydration attached the listener.
    if (object.contentDocument?.querySelector("svg")) {
      draw();
    }
    return () => {
      object.removeEventListener("load", draw);
      window.clearTimeout(fillTimer);
    };
  }, []);

  return (
    <div className="handwriting-wrap">
      <object
        ref={objectRef}
        className="handwriting-logo"
        id="handwriting-logo"
        type="image/svg+xml"
        data="/ico/music/logo.svg"
        aria-label="My interest"
      ></object>
    </div>
  );
}

export function ArchiveMusicPage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  return (
    <SiteChrome locale={locale} page="archive-music" navLabel={copy.navLabel}>
      <div className="container">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <div className="music-hero">
              <Animated className="music-intro" show="fadeInUp" hide="fadeOutUp" showDelay={120}>
                <a className="music-back" href={href("music", locale)}>
                  <ion-icon name="arrow-back-outline"></ion-icon>
                  {copy.back}
                </a>
                <h2>{copy.heading}</h2>
                <p>{copy.intro}</p>
              </Animated>
              <HandwritingLogo />
              <div className="music-playlists">
                {CARDS.map((card, i) => (
                  <Animated
                    as="a"
                    key={card.genre}
                    className="playlist-link"
                    href={href(`archive-music-${card.genre}` as PageKey, locale)}
                    show="fadeInUp"
                    hide="fadeOutUp"
                    showDelay={220 + i * 40}
                  >
                    <article className="playlist-card">
                      <div className="playlist-cover">
                        <img src={card.cover} alt={card.alt} loading="lazy" />
                      </div>
                      <div className="playlist-meta">
                        <h3>{card.label}</h3>
                        <p>
                          {PLAYLIST_DATE} · {PLAYLISTS[card.genre].length} {copy.tracks}
                        </p>
                      </div>
                    </article>
                  </Animated>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
