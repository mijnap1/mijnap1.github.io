"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { EMAIL } from "@/lib/site";
import { TORONTO_TIME_ZONE } from "@/lib/weather";
import { Animated } from "../motion/Animated";
import { useMotion } from "../motion/MotionProvider";
import { useNow } from "../weather/clock";
import { useWeather } from "../weather/WeatherProvider";

export type HeroMode = "mobile" | "desktop";

const STORY_SWAP_MS = 170;
const MIN_SWIPE_DISTANCE = 44;

const STORY: Record<Locale, { title: string; body: ReactNode }[]> = {
  en: [
    { title: "Hello,", body: "I am Jamie Ryu." },
    { title: "I'm a", body: "full stack web developer." },
    { title: "Contact", body: <StoryContact /> },
  ],
  fr: [
    { title: "Salut,", body: "je suis Jamie Ryu." },
    { title: "Je suis", body: "développeur web full-stack." },
    { title: "Contact", body: <StoryContact /> },
  ],
};

// Each row: the slot (top/center/bottom) of scale items 01, 02, 03 for that active step.
const STORY_SLOTS = [
  ["slot-center", "slot-top", "slot-bottom"],
  ["slot-bottom", "slot-center", "slot-top"],
  ["slot-top", "slot-bottom", "slot-center"],
];

function StoryContact() {
  return (
    <span className="home-hero-story-contact">
      <ion-icon name="mail-outline" aria-hidden="true"></ion-icon>
      <span>{EMAIL}</span>
    </span>
  );
}

/** Seconds since Toronto midnight, used to place the clock hands. */
function torontoSecondsOfDay(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TORONTO_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? 0);
  return value("hour") * 3600 + value("minute") * 60 + value("second");
}

function useClockAngles() {
  const now = useNow();
  // Angles keep increasing from the moment the panel mounts, so the CSS transition
  // always turns the hands forward instead of spinning back at the top of the minute.
  const [origin] = useState(() => {
    const start = Date.now();
    return { second: Math.floor(start / 1000), secondsOfDay: torontoSecondsOfDay(new Date(start)) };
  });
  const elapsed = now === null ? 0 : Math.floor(now / 1000) - origin.second;
  const seconds = origin.secondsOfDay + elapsed;
  return {
    hour: seconds / 120,
    minute: seconds / 10,
    second: seconds * 6,
  };
}

function useBooted(): boolean {
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setBooted(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, []);
  return booted;
}

function RainLayer({ mode }: { mode: HeroMode }) {
  const count = mode === "mobile" ? 30 : 24;
  return (
    <div className="home-hero-rain">
      {Array.from({ length: count }, (_, i) => {
        const left = mode === "mobile" ? 6 + (i / Math.max(1, count - 1)) * 88 : i * 4.1 + (i % 4) * 1.4;
        const style: CSSProperties = {
          left: `${left}%`,
          animationDelay: `${(i % 8) * 0.14}s`,
          animationDuration: `${0.64 + (i % 5) * 0.06}s`,
        };
        return [
          <span key={`drop-${i}`} className="home-hero-rain-drop" style={style} />,
          <span key={`splash-${i}`} className="home-hero-rain-splash" style={style} />,
        ];
      })}
    </div>
  );
}

function SnowLayer() {
  return (
    <div className="home-hero-snow">
      {Array.from({ length: 40 }, (_, j) => (
        <span
          key={j}
          className="home-hero-snowflake"
          style={
            {
              left: `${4 + j * 4.7 + (j % 4) * 1.3}%`,
              animationDelay: `${(j % 7) * 0.55}s`,
              animationDuration: `${4.15 + (j % 5) * 0.45}s`,
              "--home-snow-drift": `${((j % 5) - 2) * 7}px`,
              "--home-snow-size": `${4 + (j % 4) * 1.4}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ClearLayer() {
  return (
    <div className="home-hero-clear">
      {Array.from({ length: 6 }, (_, k) => (
        <span
          key={`glow-${k}`}
          className="home-hero-clear-glow"
          style={{
            left: `${8 + k * 15}%`,
            top: `${10 + (k % 3) * 24}%`,
            animationDelay: `${k * 0.8}s`,
            animationDuration: `${6.2 + (k % 3) * 0.9}s`,
          }}
        />
      ))}
      {Array.from({ length: 9 }, (_, m) => (
        <span
          key={`streak-${m}`}
          className="home-hero-clear-streak"
          style={{
            top: `${12 + m * 8}%`,
            animationDelay: `${m * 0.55}s`,
            animationDuration: `${8.5 + (m % 4) * 1.1}s`,
          }}
        />
      ))}
    </div>
  );
}

function useStorySteps(mode: HeroMode, stepCount: number) {
  const [active, setActive] = useState(0);
  const [displayed, setDisplayed] = useState(0);
  const transitioning = active !== displayed;

  useEffect(() => {
    if (!transitioning) {
      return;
    }
    const timer = window.setTimeout(() => setDisplayed(active), STORY_SWAP_MS);
    return () => window.clearTimeout(timer);
  }, [active, transitioning]);

  // Vertical swipes anywhere on the page step through the story on mobile.
  useEffect(() => {
    if (mode !== "mobile") {
      return;
    }
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let tracking = false;

    const ignore = (target: EventTarget | null) =>
      target instanceof Element &&
      !!target.closest("a, button, input, textarea, select, .navbar-box, .mobile-alert, #navbar-open-button");

    function onStart(event: TouchEvent) {
      tracking =
        window.innerWidth <= 767 &&
        !document.body.classList.contains("navbar-open") &&
        !ignore(event.target) &&
        event.touches.length === 1;
      if (tracking) {
        startX = lastX = event.touches[0].clientX;
        startY = lastY = event.touches[0].clientY;
      }
    }
    function onMove(event: TouchEvent) {
      if (!tracking || event.touches.length !== 1) {
        return;
      }
      lastX = event.touches[0].clientX;
      lastY = event.touches[0].clientY;
      const dx = lastX - startX;
      const dy = lastY - startY;
      if (Math.abs(dy) > 18 && Math.abs(dy) > Math.abs(dx) * 1.15 && event.cancelable) {
        event.preventDefault();
      }
    }
    function onEnd() {
      if (!tracking) {
        return;
      }
      tracking = false;
      const dx = lastX - startX;
      const dy = lastY - startY;
      if (Math.abs(dy) < MIN_SWIPE_DISTANCE || Math.abs(dy) < Math.abs(dx) * 1.2) {
        return;
      }
      setActive((step) => (step + (dy < 0 ? 1 : -1) + stepCount) % stepCount);
    }
    function onCancel() {
      tracking = false;
    }

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("touchcancel", onCancel, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onCancel);
    };
  }, [mode, stepCount]);

  return { active, displayed, transitioning, setActive };
}

function HeroVisuals({ locale, mode }: { locale: Locale; mode: HeroMode }) {
  const angles = useClockAngles();
  const booted = useBooted();
  const story = STORY[locale];
  const { active, displayed, transitioning, setActive } = useStorySteps(mode, story.length);
  const label = locale === "fr" ? "Ouvrir l'étape" : "Open clock story step";
  const { navOpen, navClosing, navigating } = useMotion();
  // Fade in once mounted; hide while the menu (the same green, grown) is open,
  // and only return after the menu has shrunk back into the panel — unless a
  // menu link was clicked, in which case the page is about to leave anyway.
  const visualsClass = [
    "home-hero-visuals",
    booted && !navOpen && !navigating && "is-shown",
    navClosing && "is-returning",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={visualsClass}>
      <div className={`home-hero-clock ${booted ? "is-ready" : "is-booting"}`}>
        <div className="home-hero-clock-glass" />
        <div className="home-hero-clock-scale">
          {story.map((_, index) => (
            <span
              key={index}
              className={`home-hero-clock-scale-item ${STORY_SLOTS[active][index]}${index === active ? " is-active" : ""}`}
              role="button"
              tabIndex={0}
              aria-label={`${label} ${index + 1}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(index);
                }
              }}
            >
              {`0${index + 1}`}
            </span>
          ))}
        </div>
        <RainLayer mode={mode} />
        <span className="home-hero-clock-hand home-hero-clock-hand--hour" style={{ transform: `rotate(${angles.hour - 90}deg)` }} />
        <span className="home-hero-clock-hand home-hero-clock-hand--minute" style={{ transform: `rotate(${angles.minute - 90}deg)` }} />
        <span className="home-hero-clock-hand home-hero-clock-hand--second" style={{ transform: `rotate(${angles.second - 90}deg)` }} />
      </div>
      <div className={`home-hero-story${transitioning ? " is-transitioning" : ""}`}>
        <span className="home-hero-story-eyebrow">{`0${displayed + 1}`}</span>
        <strong className="home-hero-story-title">{story[displayed].title}</strong>
        <span className="home-hero-story-body">{story[displayed].body}</span>
      </div>
      <ClearLayer />
      <SnowLayer />
    </div>
  );
}

type HeroPanelProps = {
  locale: Locale;
  /** Null until the client decides how to lay out the visuals (they depend on the viewport). */
  mode: HeroMode | null;
  rainDismissing: boolean;
};

/** The green panel: live Toronto clock, weather effects and (on mobile) the story dial. */
export function HeroPanel({ locale, mode, rainDismissing }: HeroPanelProps) {
  const weather = useWeather();
  const classes = [
    "image",
    weather.condition === "rain" && "is-rainy",
    weather.condition === "snow" && "is-snowy",
    weather.condition === "clear" && weather.isDay && "is-clear-day",
    rainDismissing && "is-rain-dismissing",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Animated className={classes} show="activate" hide="deactivate">
      {mode ? <HeroVisuals locale={locale} mode={mode} /> : null}
    </Animated>
  );
}
