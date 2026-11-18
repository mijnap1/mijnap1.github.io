"use client";

import { useEffect, useState } from "react";

const START_DELAY_MS = 1300;
const TYPE_SPEED_MS = 20;
const HOLD_MS = 5000;
const FADE_OUT_MS = 500;

/** typed.js "humanizer": each keystroke takes speed..1.5×speed. */
function keystrokeDelay(): number {
  return Math.round((Math.random() * TYPE_SPEED_MS) / 2) + TYPE_SPEED_MS;
}

/**
 * Types `text`, holds it, fades it out and types it again — the looping
 * "Learn More" effect the old site got from typed.js.
 */
export function TypedText({ text }: { text: string }) {
  const [typed, setTyped] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let timer = 0;
    let count = 0;

    function typeNext() {
      count += 1;
      setTyped(count);
      timer = window.setTimeout(count < text.length ? typeNext : fadeOut, count < text.length ? keystrokeDelay() : HOLD_MS);
    }

    function fadeOut() {
      setFading(true);
      timer = window.setTimeout(() => {
        count = 0;
        setTyped(0);
        setFading(false);
        timer = window.setTimeout(typeNext, keystrokeDelay());
      }, FADE_OUT_MS);
    }

    timer = window.setTimeout(typeNext, START_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [text]);

  const done = typed >= text.length;
  return (
    <span id="hello-typed" className={fading ? "typed-fade-out" : undefined} aria-label={text}>
      {text.slice(0, typed)}
      {done ? <span className="arrow"></span> : null}
    </span>
  );
}
