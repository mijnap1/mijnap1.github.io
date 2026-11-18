"use client";

import { useCallback, useEffect, useRef } from "react";
import "./intro-preview.css";

const EXIT_DURATION_MS = 200;
const MAX_INTRO_DURATION_MS = 1120;
const INTRO_START_TIME_S = 0.12;
const PLAYBACK_RATE = 1.46;

/** Standalone page for checking the home intro animation; replays on demand. */
export function IntroPreview() {
  const loaderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timers = useRef<number[]>([]);

  const beginExit = useCallback(() => {
    const loader = loaderRef.current;
    if (!loader || loader.classList.contains("is-exiting")) {
      return;
    }
    loader.classList.add("is-exiting");
    timers.current.push(window.setTimeout(() => loader.setAttribute("aria-hidden", "true"), EXIT_DURATION_MS));
  }, []);

  const play = useCallback(() => {
    const loader = loaderRef.current;
    const video = videoRef.current;
    if (!loader) {
      return;
    }
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
    loader.classList.remove("is-visible", "is-exiting");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    void loader.offsetWidth; // restart the CSS transition
    loader.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => {
      loader.classList.add("is-visible");
      if (!video) {
        beginExit();
        return;
      }
      video.currentTime = INTRO_START_TIME_S;
      video.playbackRate = PLAYBACK_RATE;
      video.play().catch(beginExit);
    });
    timers.current.push(window.setTimeout(beginExit, MAX_INTRO_DURATION_MS));
  }, [beginExit]);

  useEffect(() => {
    const video = videoRef.current;
    const pending = timers.current;
    video?.addEventListener("ended", beginExit);
    play();
    return () => {
      video?.removeEventListener("ended", beginExit);
      pending.forEach((timer) => window.clearTimeout(timer));
    };
  }, [play, beginExit]);

  return (
    <>
      <div id="intro-loader" ref={loaderRef} className="intro-loader" aria-hidden="true">
        <span className="intro-loader__bar intro-loader__bar--top"></span>
        <span className="intro-loader__bar intro-loader__bar--bottom"></span>
        <span className="intro-loader__bar intro-loader__bar--left"></span>
        <span className="intro-loader__bar intro-loader__bar--right"></span>
        <div className="intro-loader__video-shell">
          <video id="intro-loader-video" ref={videoRef} className="intro-loader__video" playsInline muted preload="auto">
            <source src="/intro/intro.mov?v=3" />
          </video>
        </div>
      </div>
      <main className="intro-preview-shell">
        <div className="intro-preview-controls">
          <button className="intro-preview-replay" type="button" id="intro-preview-replay" onClick={play}>
            Replay Intro
          </button>
          <div className="intro-preview-note">Preview page for the homepage intro animation.</div>
        </div>
      </main>
    </>
  );
}
