"use client";

import { href, type Locale, type PageKey } from "@/lib/i18n";
import { SiteChrome } from "../chrome/SiteChrome";
import { Animated } from "../motion/Animated";
import { PLAYLIST_DATE, PLAYLISTS, type Genre } from "./playlists";
import "./playlist-page.css";

const COPY = {
  en: { back: "Back", tracks: "tracks" },
  fr: { back: "Retour", tracks: "pistes" },
} satisfies Record<Locale, Record<string, string>>;

const FIRST_TILE_DELAY_MS = 240;
const TILE_STAGGER_MS = 30;

type PlaylistPageProps = {
  locale: Locale;
  genre: Genre;
  /** The archive keeps its own copy of each playlist, linking back to the archive hub. */
  archived?: boolean;
};

export function PlaylistPage({ locale, genre, archived = false }: PlaylistPageProps) {
  const copy = COPY[locale];
  const tiles = PLAYLISTS[genre];
  const page = `${archived ? "archive-music" : "music"}-${genre}` as PageKey;
  const backTo: PageKey = archived ? "archive-music" : "music";

  return (
    <SiteChrome locale={locale} page={page}>
      <div className="container">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <div className="music-hero">
              <Animated className="music-intro" show="fadeInUp" hide="fadeOutUp" showDelay={120}>
                <a className="music-back" href={href(backTo, locale)}>
                  <ion-icon name="arrow-back-outline"></ion-icon>
                  {copy.back}
                </a>
                <h2>{genre}</h2>
                <p>
                  {PLAYLIST_DATE} · {tiles.length} {copy.tracks}
                </p>
              </Animated>
              <Animated className="music-collection" show="fadeInUp" hide="fadeOutUp" showDelay={220}>
                <div className="album-grid">
                  {tiles.map((tile, i) => (
                    <Animated
                      key={tile.cover}
                      className={tile.xl ? "album-tile tile-xl" : "album-tile"}
                      show="fadeInUp"
                      hide="fadeOutUp"
                      showDelay={FIRST_TILE_DELAY_MS + i * TILE_STAGGER_MS}
                    >
                      <img src={tile.cover} alt={tile.alt} loading="lazy" />
                      <div className="tile-overlay">
                        <p className="tile-title">{tile.title}</p>
                        <p className="tile-artist">{tile.artist}</p>
                      </div>
                    </Animated>
                  ))}
                </div>
              </Animated>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
