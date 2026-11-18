"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/** How long the page content fades out before the browser navigates away (see styles/transitions.css). */
export const PAGE_LEAVE_DELAY_MS = 650;
/**
 * How long the menu takes to close before the page starts leaving: its text fades,
 * the green shrinks back and fades (see components/chrome/site-menu.css).
 */
const MENU_CLOSE_MS = 1350;
const NAV_CLOSE_COLOR_RESET_MS = 500;

type MotionContextValue = {
  /** True from the moment an internal link is clicked (the menu may still be closing). */
  navigating: boolean;
  /** True once the page content itself is animating out. */
  leaving: boolean;
  navOpen: boolean;
  /** Briefly true after the menu closes, so the toggle bars can fade back. */
  navClosing: boolean;
  setNavOpen: (open: boolean) => void;
  navigate: (url: string) => void;
};

const MotionContext = createContext<MotionContextValue | null>(null);

export function useMotion(): MotionContextValue {
  const context = useContext(MotionContext);
  if (!context) {
    throw new Error("useMotion must be used inside <MotionProvider>");
  }
  return context;
}

function shouldAnimateLinkClick(event: MouseEvent): URL | null {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return null;
  }
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) {
    return null;
  }
  const rawHref = anchor.getAttribute("href") || "";
  if (!rawHref || rawHref.startsWith("#") || anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return null;
  }
  const url = new URL(rawHref, window.location.href);
  if (url.origin !== window.location.origin) {
    return null;
  }
  if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) {
    return null;
  }
  return url;
}

export function MotionProvider({ children }: { children: ReactNode }) {
  const [navigating, setNavigating] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [navOpen, setNavOpenState] = useState(false);
  const [navClosing, setNavClosing] = useState(false);
  const navOpenRef = useRef(false);
  const closingTimer = useRef<number | null>(null);
  const leaveTimer = useRef<number | null>(null);

  const setNavOpen = useCallback((open: boolean) => {
    if (closingTimer.current) {
      window.clearTimeout(closingTimer.current);
      closingTimer.current = null;
    }
    if (navOpenRef.current && !open) {
      setNavClosing(true);
      closingTimer.current = window.setTimeout(() => setNavClosing(false), NAV_CLOSE_COLOR_RESET_MS);
    } else {
      setNavClosing(false);
    }
    navOpenRef.current = open;
    setNavOpenState(open);
  }, []);

  const navigate = useCallback(
    (url: string) => {
      if (leaveTimer.current) {
        return;
      }
      setNavigating(true);
      // Let the browser fetch the next page while the animations play.
      const prefetch = document.createElement("link");
      prefetch.rel = "prefetch";
      prefetch.href = url;
      document.head.appendChild(prefetch);

      function leave() {
        setLeaving(true);
        document.body.classList.add("page-leaving");
        leaveTimer.current = window.setTimeout(() => {
          window.location.href = url;
        }, PAGE_LEAVE_DELAY_MS);
      }

      // From the menu: close it completely first, then fade the page out.
      if (navOpenRef.current) {
        setNavOpen(false);
        leaveTimer.current = window.setTimeout(leave, MENU_CLOSE_MS);
      } else {
        leave();
      }
    },
    [setNavOpen],
  );

  useEffect(() => {
    document.body.classList.toggle("navbar-open", navOpen);
  }, [navOpen]);

  // Every same-origin link animates the page out before navigating, like the
  // original site. Pages are separate documents, so this is a full page load.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const url = shouldAnimateLinkClick(event);
      if (!url) {
        return;
      }
      event.preventDefault();
      navigate(url.href);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);

  // Returning with the back button restores the page from bfcache mid-exit;
  // reset it so it is usable again.
  useEffect(() => {
    function onPageShow(event: PageTransitionEvent) {
      if (!event.persisted) {
        return;
      }
      if (leaveTimer.current) {
        window.clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
      document.body.classList.remove("page-leaving");
      setNavigating(false);
      setLeaving(false);
    }
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  const value = useMemo(
    () => ({ navigating, leaving, navOpen, navClosing, setNavOpen, navigate }),
    [navigating, leaving, navOpen, navClosing, setNavOpen, navigate],
  );

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}
