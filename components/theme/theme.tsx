"use client";

import { useCallback, useSyncExternalStore, type ComponentPropsWithoutRef } from "react";
import { DARK_CLASS, STORAGE_KEY } from "./boot";

function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange);
  observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot(): boolean {
  return document.body.classList.contains(DARK_CLASS);
}

function getServerSnapshot(): boolean {
  return false;
}

export function useIsDark(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useThemeToggle(): () => void {
  return useCallback(() => {
    const nextDark = !document.body.classList.contains(DARK_CLASS);
    document.body.classList.toggle(DARK_CLASS, nextDark);
    try {
      localStorage.setItem(STORAGE_KEY, nextDark ? "dark" : "light");
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this page.
    }
  }, []);
}

type ThemeToggleProps = {
  id?: string;
  className?: string;
};

export function ThemeToggle({ id, className }: ThemeToggleProps) {
  const isDark = useIsDark();
  const toggle = useThemeToggle();
  const label = isDark ? "Toggle light mode" : "Toggle dark mode";
  return (
    <button
      className={["noanimation theme-toggle-btn-main", className].filter(Boolean).join(" ")}
      id={id}
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      onClick={toggle}
    >
      <ion-icon name={isDark ? "sunny" : "moon"}></ion-icon>
    </button>
  );
}

/** <img> that swaps its source with the theme (replaces data-light-src/data-dark-src). */
export function ThemedImage({
  lightSrc,
  darkSrc,
  alt,
  ...rest
}: { lightSrc: string; darkSrc: string; alt: string } & Omit<ComponentPropsWithoutRef<"img">, "src" | "alt">) {
  const isDark = useIsDark();
  return <img src={isDark ? darkSrc : lightSrc} alt={alt} {...rest} />;
}
