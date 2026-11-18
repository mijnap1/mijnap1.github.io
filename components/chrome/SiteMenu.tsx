"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { href, type Locale, type PageKey } from "@/lib/i18n";
import { EMAIL, SOCIAL_LINKS } from "@/lib/site";
import { useMotion } from "../motion/MotionProvider";
import { TorontoTime } from "./TorontoTime";
import "./site-menu.css";

export const NAV_ITEMS = [
  { page: "about", label: { en: "About Me", fr: "À propos" } },
  { page: "project", label: { en: "Projects", fr: "Projets" } },
  { page: "music", label: { en: "Music", fr: "Musique" } },
  { page: "contact", label: { en: "Contact", fr: "Contact" } },
] as const satisfies ReadonlyArray<{ page: PageKey; label: Record<Locale, string> }>;

const MOBILE_MAX_WIDTH = 767;
/** How long the panel takes to ease back and fade (see site-menu.css); reopening sooner continues from where it is. */
const CLOSE_DURATION_MS = 1500;

type Edges = { top: string; right: string; bottom: string; left: string };

/** Closed state when there is no hero panel to grow from: a sliver at the right edge. */
const FROM_RIGHT_EDGE: Edges = { top: "0px", right: "0px", bottom: "0px", left: "100%" };

/** Which menu entry the current page belongs to (playlists count as Music, etc.). */
function sectionOf(page: PageKey): PageKey {
  if (page.startsWith("music") || page.startsWith("archive-music")) {
    return "music";
  }
  return page;
}

/**
 * Where the menu opens from: on the home page the green hero panel itself grows
 * to fill the screen; elsewhere the menu sweeps in from the right.
 */
function openingEdges(): Edges {
  const hero = document.querySelector(".home-hello-container .image");
  if (!hero || window.innerWidth <= MOBILE_MAX_WIDTH) {
    return FROM_RIGHT_EDGE;
  }
  const rect = hero.getBoundingClientRect();
  if (!rect.width || !rect.height) {
    return FROM_RIGHT_EDGE;
  }
  const px = (value: number) => `${Math.max(0, Math.round(value))}px`;
  return {
    top: px(rect.top),
    right: px(window.innerWidth - rect.right),
    bottom: px(window.innerHeight - rect.bottom),
    left: px(rect.left),
  };
}

export function SiteMenu({ locale, page }: { locale: Locale; page: PageKey }) {
  const { navOpen, setNavOpen } = useMotion();
  const [open, setOpen] = useState(false);
  // While true, the panel snaps (no transition) to the box it will grow from.
  const [placing, setPlacing] = useState(false);
  const [from, setFrom] = useState<Edges>(FROM_RIGHT_EDGE);
  const closedAt = useRef(-Infinity);
  const menuRef = useRef<HTMLDivElement>(null);
  const current = sectionOf(page);

  // Measure where to grow from, then open once that starting box has been drawn.
  useLayoutEffect(() => {
    if (!navOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- closing mirrors the shared nav state immediately
      setOpen(false);
      closedAt.current = performance.now();
      return;
    }
    // Reopening while it is still easing back: carry on from where it is instead of jumping.
    if (performance.now() - closedAt.current < CLOSE_DURATION_MS) {
      setOpen(true);
      return;
    }
    setFrom(openingEdges());
    setPlacing(true);
    // Two frames: the starting rectangle has to be painted before the panel can grow from it.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        setPlacing(false);
        setOpen(true);
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [navOpen]);

  useEffect(() => {
    if (!navOpen) {
      return;
    }
    menuRef.current?.querySelector<HTMLAnchorElement>(".site-menu__link")?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen, setNavOpen]);

  return (
    <div
      ref={menuRef}
      className={`site-menu${open ? " is-open" : ""}${placing ? " is-placing" : ""}`}
      style={
        {
          "--menu-top": from.top,
          "--menu-right": from.right,
          "--menu-bottom": from.bottom,
          "--menu-left": from.left,
        } as CSSProperties
      }
      inert={!navOpen}
      aria-hidden={!navOpen}
    >
      <div className="site-menu__panel" aria-hidden="true"></div>
      <nav aria-label={locale === "fr" ? "Menu principal" : "Main menu"}>
        <ol className="site-menu__links">
          {NAV_ITEMS.map((item, i) => (
            <li key={item.page} className="site-menu__item" style={{ "--i": i } as CSSProperties}>
              <a className="site-menu__link" href={href(item.page, locale)} aria-current={item.page === current ? "page" : undefined}>
                <span className="site-menu__index" aria-hidden="true">{`0${i + 1}`}</span>
                <span className="site-menu__label">{item.label[locale]}</span>
                <ion-icon className="site-menu__arrow" name="arrow-forward-outline" aria-hidden="true"></ion-icon>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="site-menu__meta">
        <div className="site-menu__contact">
          <TorontoTime locale={locale} />
          <a className="noanimation tz-row" href={`mailto:${EMAIL}`}>
            <ion-icon name="mail-outline" aria-hidden="true"></ion-icon>
            <span>{EMAIL}</span>
          </a>
        </div>
        <div className="site-menu__socials">
          {SOCIAL_LINKS.map((social) => (
            <a key={social.href} className="noanimation" href={social.href} target="_blank" rel="noopener" aria-label={social.label}>
              <span className={`fa ${social.icon}`} aria-hidden="true"></span>
            </a>
          ))}
        </div>
        <div className="site-menu__langs">
          <a className={locale === "en" ? "active" : undefined} href={href(page, "en")} lang="en">
            en
          </a>
          <a className={locale === "fr" ? "active" : undefined} href={href(page, "fr")} lang="fr">
            fr
          </a>
        </div>
      </div>
    </div>
  );
}
