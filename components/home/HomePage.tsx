"use client";

import { useState, type CSSProperties } from "react";
import { href, type Locale } from "@/lib/i18n";
import { SiteChrome } from "../chrome/SiteChrome";
import { Animated } from "../motion/Animated";
import { HeroPanel, type HeroMode } from "./HeroPanel";
import { IntroLoader } from "./IntroLoader";
import { TypedText } from "./TypedText";
import "./home-page.css";

const MOBILE_HERO_MAX_WIDTH = 767;

const COPY = {
  en: {
    headline: "Hello!",
    alert: "Best viewed on a PC or larger screen for the full experience! Thanks! :)",
    dismissAlert: "Dismiss notification",
    learnMore: "Learn More",
    desktopIntro: (
      <>
        <b>My name is Jamie Ryu,</b>
        <br />
        and I am a&nbsp;&nbsp;&nbsp;
        <br className="before-formatted" />
        <span className="formatted-text">Full-Stack Web Developer!</span>
        <br />I build <b>convenient</b> and <b>productive</b> websites.
      </>
    ),
    mobileIntro: (
      <>
        <span className="home-mobile-name">
          I am <strong>Jamie Ryu</strong>
        </span>
        <span className="home-mobile-role">a Full Stack web developer</span>
      </>
    ),
  },
  fr: {
    headline: "Salut!",
    alert: "Meilleure expérience sur PC ou grand écran. Merci !",
    dismissAlert: "Fermer la notification",
    learnMore: "En Savoir Plus",
    desktopIntro: (
      <>
        <b>Je m&apos;appelle Jamie Ryu,</b>
        <br />
        et je suis un&nbsp;&nbsp;&nbsp;
        <br className="before-formatted" />
        <span className="formatted-text">développeur web full-stack !</span>
        <br />
        Je construis des sites web <b>pratiques</b> et <b>productifs</b>.
      </>
    ),
    mobileIntro: (
      <>
        <span className="home-mobile-name">
          Je suis <strong>Jamie Ryu</strong>
        </span>
        <span className="home-mobile-role">développeur web full-stack</span>
      </>
    ),
  },
} satisfies Record<Locale, unknown>;

function MobileAlert({ text, dismissLabel }: { text: string; dismissLabel: string }) {
  const [state, setState] = useState<"open" | "closing" | "closed">("open");
  if (state === "closed") {
    return null;
  }
  return (
    <div className={`mobile-alert${state === "closing" ? " is-closing" : ""}`} role="status" aria-live="polite">
      <span className="mobile-alert-icon" aria-hidden="true">
        <ion-icon name="notifications-outline"></ion-icon>
      </span>
      <span className="mobile-alert-text">{text}</span>
      <button
        className="mobile-alert-close"
        type="button"
        aria-label={dismissLabel}
        onClick={() => {
          setState("closing");
          window.setTimeout(() => setState("closed"), 300);
        }}
      >
        ×
      </button>
    </div>
  );
}

function Headline({ text }: { text: string }) {
  const letters = Array.from(text);
  return (
    <Animated className="caption" show="fadeInUp" hide="fadeOutUp" showDelay={100} aria-label={text}>
      {letters.map((letter, index) => {
        const isMark = index === letters.length - 1;
        const delay = isMark ? 360 : index * 70;
        return (
          <span
            key={index}
            className={isMark ? "hello-letter hello-mark" : "hello-letter"}
            style={{ "--hello-delay": `${delay}ms` } as CSSProperties}
          >
            {letter}
          </span>
        );
      })}
    </Animated>
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [heroMode, setHeroMode] = useState<HeroMode | null>(null);
  const [rainDismissing, setRainDismissing] = useState(false);

  function revealHero() {
    setHeroMode((mode) => mode ?? (window.innerWidth <= MOBILE_HERO_MAX_WIDTH ? "mobile" : "desktop"));
  }

  return (
    <>
      <IntroLoader
        onStart={(introPlaying) => {
          // On mobile the hero waits for the intro to finish; on desktop it builds right away.
          if (!introPlaying || window.innerWidth > MOBILE_HERO_MAX_WIDTH) {
            revealHero();
          }
        }}
        onFinished={revealHero}
      />
      <MobileAlert text={copy.alert} dismissLabel={copy.dismissAlert} />
      <SiteChrome locale={locale} page="home" mobileContact>
        <div className="home-wrap">
          <div className="home-hello-wrap">
            <div className="row">
              <div className="col-lg-10 col-lg-offset-1">
                <div className="home-hello-container">
                  <HeroPanel locale={locale} mode={heroMode} rainDismissing={rainDismissing} />
                  <Headline text={copy.headline} />
                  <Animated className="desc" show="fadeInUp" hide="fadeOutUp" showDelay={200}>
                    <span className="home-desktop-only">{copy.desktopIntro}</span>
                    <span className="home-mobile-only">{copy.mobileIntro}</span>
                  </Animated>
                  <Animated className="link" show="fadeInUp" hide="fadeOutUp" showDelay={300}>
                    <a href={href("about", locale)} onClick={() => setRainDismissing(true)}>
                      <TypedText text={copy.learnMore} />
                    </a>
                  </Animated>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SiteChrome>
    </>
  );
}
