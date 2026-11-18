"use client";

import { useRef, type PointerEvent } from "react";
import "./logo-mark.css";

/** Strongest tilt toward the cursor, in degrees. */
const MAX_TILT_DEG = 8;

/**
 * The corner logo, treated like the sticker it looks like: on hover it lifts,
 * tilts toward the cursor and a gloss slides across it. All motion is CSS
 * driven by a few custom properties set here.
 */
export function LogoMark() {
  const frame = useRef(0);

  function track(event: PointerEvent<HTMLSpanElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }
    const mark = event.currentTarget;
    const rect = mark.getBoundingClientRect();
    // -0.5 … 0.5 from the centre of the logo.
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      mark.style.setProperty("--logo-tilt-x", `${(-y * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
      mark.style.setProperty("--logo-tilt-y", `${(x * 2 * MAX_TILT_DEG).toFixed(2)}deg`);
      mark.style.setProperty("--logo-shadow-x", `${(-x * 14).toFixed(1)}px`);
      mark.style.setProperty("--logo-shadow-y", `${(16 - y * 8).toFixed(1)}px`);
      mark.style.setProperty("--logo-gloss-x", `${(50 + x * 80).toFixed(1)}%`);
      mark.style.setProperty("--logo-gloss-y", `${(50 + y * 80).toFixed(1)}%`);
    });
  }

  function enter(event: PointerEvent<HTMLSpanElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }
    event.currentTarget.classList.add("is-hovered");
    // Ease into the first tilt, then follow the cursor closely.
    const mark = event.currentTarget;
    window.setTimeout(() => mark.classList.contains("is-hovered") && mark.classList.add("is-tracking"), 280);
    track(event);
  }

  function leave(event: PointerEvent<HTMLSpanElement>) {
    cancelAnimationFrame(frame.current);
    const mark = event.currentTarget;
    mark.classList.remove("is-hovered", "is-tracking");
    for (const name of ["tilt-x", "tilt-y", "shadow-x", "shadow-y", "gloss-x", "gloss-y"]) {
      mark.style.removeProperty(`--logo-${name}`);
    }
  }

  return (
    <span className="logo-mark" onPointerEnter={enter} onPointerMove={track} onPointerLeave={leave}>
      <img className="logo-mark__img" src="/ico/logo/jamie3128.png" alt="Main Page" draggable={false} />
      <span className="logo-mark__gloss" aria-hidden="true" />
    </span>
  );
}
