"use client";

import { useEffect, useState } from "react";
import { Animated } from "../motion/Animated";

const LABEL_SWAP_MS = 500;

/** The small rotated page label next to the logo; animates out and back in when it changes. */
export function NavLabel({ label }: { label: string }) {
  const [displayed, setDisplayed] = useState(label);
  const [pending, setPending] = useState(label);
  const [swapping, setSwapping] = useState(false);

  if (label !== pending) {
    setPending(label);
    setSwapping(true);
  }

  useEffect(() => {
    if (!swapping) {
      return;
    }
    const timer = window.setTimeout(() => {
      setDisplayed(pending);
      setSwapping(false);
    }, LABEL_SWAP_MS);
    return () => window.clearTimeout(timer);
  }, [swapping, pending]);

  return (
    <Animated as="h2" id="nav-label" className="hidden-xs hidden-sm" trigger="now" show="activate" hide="deactivate">
      {swapping ? (
        <span className="animated now fadeInUpAboutLabel fadeOutUpAboutLabel">{displayed}</span>
      ) : (
        <Animated as="span" key={displayed} trigger="now" show="fadeInUpAboutLabel" hide="fadeOutUpAboutLabel">
          {displayed}
        </Animated>
      )}
    </Animated>
  );
}
