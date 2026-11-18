"use client";

import { useEffect, useRef } from "react";
import { SEEN_KEY } from "./intro-boot";

const EXIT_DURATION_MS = 200;
const MAX_INTRO_DURATION_MS = 2050;
const REVEAL_DURATION_MS = 700;
const INTRO_START_TIME_S = 0.12;
const PLAYBACK_RATE = 1.46;

type IntroLoaderProps = {
  /** Called once on mount with whether the intro video is going to play. */
  onStart: (introPlaying: boolean) => void;
  onFinished: () => void;
};

/** Plays the logo intro video once per session, then reveals the page. */
export function IntroLoader({ onStart, onFinished }: IntroLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const callbacks = useRef({ onStart, onFinished });

  useEffect(() => {
    callbacks.current = { onStart, onFinished };
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const loader = loaderRef.current;
    const video = videoRef.current;
    if (!loader) {
      return;
    }
    const timers: number[] = [];
    let finished = false;

    function finalize() {
      if (finished) {
        return;
      }
      finished = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Without storage the intro simply plays again next time.
      }
      root.classList.remove("has-intro-loader");
      body.classList.remove("intro-active");
      body.classList.add("intro-reveal", "loaded");
      loader!.hidden = true;
      loader!.setAttribute("aria-hidden", "true");
      loader!.classList.remove("is-visible", "is-exiting");
      video?.pause();
      timers.push(window.setTimeout(() => body.classList.remove("intro-reveal"), REVEAL_DURATION_MS));
      callbacks.current.onFinished();
    }

    const introPlaying = root.classList.contains("has-intro-loader");
    callbacks.current.onStart(introPlaying);
    if (!introPlaying) {
      finalize();
      return;
    }

    function beginExit() {
      if (loader!.classList.contains("is-exiting")) {
        return;
      }
      body.classList.add("loaded");
      loader!.classList.add("is-exiting");
      timers.push(window.setTimeout(finalize, EXIT_DURATION_MS));
    }

    body.classList.add("intro-active");
    body.classList.remove("loaded");
    loader.hidden = false;
    loader.setAttribute("aria-hidden", "false");

    const frame = requestAnimationFrame(() => {
      loader.classList.add("is-visible");
      if (!video) {
        beginExit();
        return;
      }
      video.currentTime = INTRO_START_TIME_S;
      video.playbackRate = PLAYBACK_RATE;
      video.play().catch(beginExit);
    });
    timers.push(window.setTimeout(beginExit, MAX_INTRO_DURATION_MS));
    video?.addEventListener("ended", beginExit);

    return () => {
      cancelAnimationFrame(frame);
      timers.forEach((timer) => window.clearTimeout(timer));
      video?.removeEventListener("ended", beginExit);
    };
  }, []);

  return (
    <div id="intro-loader" ref={loaderRef} className="intro-loader" hidden aria-hidden="true">
      <div className="intro-loader__video-shell">
        <video id="intro-loader-video" ref={videoRef} className="intro-loader__video" playsInline muted preload="auto">
          <source src="/intro/intro.mov?v=3" />
        </video>
      </div>
    </div>
  );
}
