"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { href, type Locale } from "@/lib/i18n";
import { SiteChrome } from "../chrome/SiteChrome";
import "./music-stage-page.css";

type Track = { title: string; artist: string; cover: string; duration: string };

const TRACKS: Track[] = [
  { title: "Hype Boy", artist: "NewJeans", cover: "/ico/music/sub-cover/kpop/2.png", duration: "2:59" },
  { title: "Palette", artist: "IU", cover: "/ico/music/main-cover/palette.jpg", duration: "3:37" },
  { title: "Ao to Natsu", artist: "Mrs. GREEN APPLE", cover: "/ico/music/sub-cover/jpop/15.jpeg", duration: "4:31" },
  { title: "T.B.H", artist: "QWER", cover: "/ico/music/sub-cover/kpop/0.jpeg", duration: "3:06" },
  { title: "Thanks", artist: "Kim Dong Ryul", cover: "/ico/music/sub-cover/ballad/33.jpg", duration: "4:51" },
  { title: "Lilac", artist: "Mrs. GREEN APPLE", cover: "/ico/music/sub-cover/jpop/13.png", duration: "4:44" },
  { title: "How Sweet", artist: "NewJeans", cover: "/ico/music/sub-cover/kpop/200.jpeg", duration: "3:39" },
  { title: "Dried Flower", artist: "yuuri", cover: "/ico/music/sub-cover/jpop/12.jpg", duration: "4:45" },
];

/** Pause before the next cover loads, then before the disc starts spinning again. */
const SWITCH_PREP_MS = 70;
const RESTART_DELAY_MS = 120;

const COPY = {
  en: {
    navLabel: "music",
    nowPlaying: "Now Playing Album",
    back: "Back to player",
    shuffle: "Shuffle",
    prev: "Previous track",
    next: "Next track",
    play: "Play",
    pause: "Pause",
    album: "Album",
    comingSoon: { title: "Coming soon...", artist: "More favorites on the way" },
    archive: { title: "Open archive", artist: "Browse the previous music pages" },
  },
  fr: {
    navLabel: "musique",
    nowPlaying: "Album en cours",
    back: "Retour au lecteur",
    shuffle: "Aléatoire",
    prev: "Piste précédente",
    next: "Piste suivante",
    play: "Lecture",
    pause: "Pause",
    album: "Album",
    comingSoon: { title: "Bientôt...", artist: "D'autres favoris arrivent" },
    archive: { title: "Ouvrir l'archive", artist: "Parcourir les anciennes pages musique" },
  },
} satisfies Record<Locale, unknown>;

const coverCache = new Map<string, Promise<void>>();

function preloadCover(src: string): Promise<void> {
  let pending = coverCache.get(src);
  if (!pending) {
    pending = new Promise<void>((resolve) => {
      const image = new Image();
      image.onload = image.onerror = () => resolve();
      image.src = src;
      if (image.complete) {
        resolve();
      } else {
        image.decode?.().then(resolve, resolve);
      }
    });
    coverCache.set(src, pending);
  }
  return pending;
}

const pad = (n: number) => String(n).padStart(2, "0");
const coverStyle = (track: Track | null): CSSProperties | undefined =>
  track ? { backgroundImage: `url("${track.cover}")` } : undefined;

/** A pretend music player: covers, a spinning CD and an album list. There is no audio. */
function MusicStage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [albumOpen, setAlbumOpen] = useState(false);
  const timers = useRef<number[]>([]);
  const track = index === null ? null : TRACKS[index];

  // Start on a random track; picked after hydration so the server HTML stays stable.
  useEffect(() => {
    TRACKS.forEach((t) => preloadCover(t.cover));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- random start is client-only by design
    setIndex(Math.floor(Math.random() * TRACKS.length));
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const later = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  };

  function beginPlaying() {
    setSwitching(false);
    setPlaying(true);
    // The spin class goes on a frame later so the CSS animation restarts cleanly.
    requestAnimationFrame(() => setSpinning(true));
  }

  function stop() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    setPlaying(false);
    setSpinning(false);
  }

  function switchTo(next: number) {
    if (switching || albumOpen || index === null) {
      return;
    }
    stop();
    setSwitching(true);
    later(() => {
      preloadCover(TRACKS[next].cover).then(() => {
        setIndex(next);
        later(beginPlaying, RESTART_DELAY_MS);
      });
    }, SWITCH_PREP_MS);
  }

  function step(delta: number) {
    if (index !== null) {
      switchTo((index + delta + TRACKS.length) % TRACKS.length);
    }
  }

  function shuffle() {
    if (index === null) {
      return;
    }
    let next = index;
    while (next === index && TRACKS.length > 1) {
      next = Math.floor(Math.random() * TRACKS.length);
    }
    switchTo(next);
  }

  function chooseFromAlbum(next: number) {
    if (switching) {
      return;
    }
    preloadCover(TRACKS[next].cover).then(() => {
      setIndex(next);
      setAlbumOpen(false);
      beginPlaying();
    });
  }

  const showPause = playing || switching;
  const playActive = showPause && !albumOpen;
  const stageClasses = [
    "music-blank-stage music-stage-player",
    spinning && playing && "is-playing",
    switching && "is-switching",
    albumOpen && "is-album-open",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={stageClasses} data-music-stage>
      <div className="music-stage-stack" aria-hidden="true">
        <div className="music-stage-cover music-stage-cover--current" style={coverStyle(track)}></div>
        <div className="music-stage-cover music-stage-cover--next" style={coverStyle(track)}></div>
        <div className="music-stage-cd">
          <div className="music-stage-cd-spin"></div>
        </div>
      </div>
      <div className="music-stage-album" data-music-album-view>
        <button className="music-stage-album__back" type="button" aria-label={copy.back} onClick={() => setAlbumOpen(false)}>
          <ion-icon name="arrow-back-outline"></ion-icon>
        </button>
        <div className="music-stage-album__cover" style={coverStyle(track)}></div>
        <div className="music-stage-album__body">
          <div className="music-stage-album__eyebrow">{copy.nowPlaying}</div>
          <div className="music-stage-album__list">
            {TRACKS.map((t, i) => (
              <button
                key={t.title}
                className={`music-stage-album__track${i === index ? " is-active" : ""}`}
                type="button"
                onClick={() => chooseFromAlbum(i)}
              >
                <span className="music-stage-album__index">{pad(i + 1)}</span>
                <span className="music-stage-album__track-copy">
                  <span className="music-stage-album__track-title">{t.title}</span>
                  <span className="music-stage-album__track-artist">{t.artist}</span>
                </span>
                <span className="music-stage-album__duration">{t.duration}</span>
              </button>
            ))}
            <div className="music-stage-album__track music-stage-album__track--coming-soon" aria-disabled="true">
              <span className="music-stage-album__index">{pad(TRACKS.length + 1)}</span>
              <span className="music-stage-album__track-copy">
                <span className="music-stage-album__track-title">{copy.comingSoon.title}</span>
                <span className="music-stage-album__track-artist">{copy.comingSoon.artist}</span>
              </span>
              <span className="music-stage-album__duration">--:--</span>
            </div>
            <a className="music-stage-album__archive-link-row" href={href("archive-music", locale)}>
              <span className="music-stage-album__index">{pad(TRACKS.length + 2)}</span>
              <span className="music-stage-album__track-copy">
                <span className="music-stage-album__track-title">{copy.archive.title}</span>
                <span className="music-stage-album__track-artist">{copy.archive.artist}</span>
              </span>
              <span className="music-stage-album__duration">
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </span>
            </a>
          </div>
        </div>
      </div>
      <div className="music-stage-meta" aria-live="polite">
        <div className="music-stage-title">{track?.title}</div>
        <div className="music-stage-artist">{track?.artist}</div>
      </div>
      <div className="music-dock">
        <button className="music-dock__icon music-dock__control" type="button" aria-label={copy.shuffle} onClick={shuffle}>
          <ion-icon name="shuffle-outline"></ion-icon>
        </button>
        <button className="music-dock__icon music-dock__control" type="button" aria-label={copy.prev} onClick={() => step(-1)}>
          <ion-icon name="play-skip-back-outline"></ion-icon>
        </button>
        <button
          className={`music-dock__icon music-dock__icon--play music-dock__control${playActive ? " is-active" : ""}`}
          type="button"
          aria-label={showPause ? copy.pause : copy.play}
          title={showPause ? copy.pause : copy.play}
          aria-pressed={playActive}
          onClick={() => {
            if (switching || albumOpen) {
              return;
            }
            if (playing) {
              stop();
            } else {
              beginPlaying();
            }
          }}
        >
          <ion-icon name={showPause ? "pause" : "play"}></ion-icon>
        </button>
        <button className="music-dock__icon music-dock__control" type="button" aria-label={copy.next} onClick={() => step(1)}>
          <ion-icon name="play-skip-forward-outline"></ion-icon>
        </button>
        <button
          className={`music-dock__icon music-dock__control${albumOpen ? " is-active" : ""}`}
          type="button"
          aria-label={copy.album}
          aria-pressed={albumOpen}
          onClick={() => {
            if (!switching) {
              setAlbumOpen(true);
            }
          }}
        >
          <ion-icon name="albums-outline"></ion-icon>
        </button>
      </div>
    </div>
  );
}

export function MusicStagePage({ locale }: { locale: Locale }) {
  return (
    <SiteChrome locale={locale} page="music" navLabel={COPY[locale].navLabel}>
      <div className="container">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <div className="music-hero music-hero--blank">
              <MusicStage locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
