"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { EMAIL } from "@/lib/site";
import { SiteChrome } from "../chrome/SiteChrome";
import { Animated } from "../motion/Animated";
import "./contact-page.css";

const COPY = {
  en: {
    role: "Full-Stack web developer",
    resume: "View resume",
    school: "University of Toronto",
    since: "since",
    yearNote: "the lore begins!",
    bubble: "/ico/logo/bubble.png",
  },
  fr: {
    role: "Développeur web full-stack",
    resume: "Voir le CV",
    school: "Université de Toronto",
    since: "depuis",
    yearNote: "le début du lore",
    bubble: "/ico/logo/bubble-fr.png",
  },
} satisfies Record<Locale, Record<string, string>>;

/** Shorthand for the page's staggered fade-up rows. */
function Row({ delay, className, children }: { delay: number; className?: string; children: ReactNode }) {
  return (
    <Animated className={className} trigger="now" show="fadeInUp" hide="fadeOutUp" showDelay={delay}>
      {children}
    </Animated>
  );
}

export function ContactPage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  return (
    <SiteChrome locale={locale} page="contact">
      <div className="container">
        <div className="row">
          <div className="col-md-12 col-md-offset-0 col-lg-10 col-lg-offset-1">
            <div className="row">
              <div className="col-md-6 col-md-offset-3">
                <div className="company-container">
                  <Row className="company-name" delay={550}>
                    <span>Jamie Ryu</span>
                  </Row>
                  <Row className="company-services" delay={600}>
                    {copy.role}
                  </Row>
                  <div className="row">
                    <div className="col-sm-6 col-md-6">
                      <Row className="company-resume" delay={850}>
                        <a className="btn btn-primary animation" href="/resume.pdf" target="_blank" rel="noopener">
                          <ion-icon name="document-text-outline" className="company-inline-icon" aria-hidden="true"></ion-icon>
                          {copy.resume}
                          <span className="arrow"></span>
                        </a>
                      </Row>
                      <div className="company-contacts">
                        <Row delay={880}>
                          <a className="noanimation company-inline-row" href={`mailto:${EMAIL}`}>
                            <ion-icon name="mail-outline" className="company-inline-icon" aria-hidden="true"></ion-icon>
                            <span>{EMAIL}</span>
                          </a>
                        </Row>
                      </div>
                      <Row className="company-founder" delay={950}>
                        <span className="company-founder-card">
                          <span className="company-founder-line company-inline-row">
                            <ion-icon
                              name="school-outline"
                              className="company-inline-icon company-inline-icon--school"
                              aria-hidden="true"
                            ></ion-icon>
                            <span>
                              {copy.school} <span className="company-uoft">(UofT)</span>
                            </span>
                          </span>
                        </span>
                      </Row>
                      <Row className="company-founded" delay={1000}>
                        {copy.since} | <b className="company-founded-year" data-year-note={copy.yearNote}>2023</b>
                      </Row>
                    </div>
                    <div className="col-sm-6 col-md-6">
                      <div className="company-founder-img-box">
                        <Animated className="img-bg" trigger="now" show="activate" hide="deactivate" />
                        <picture>
                          <Animated
                            as="img"
                            src="/ico/logo/pfp.png"
                            alt="Jamie Ryu"
                            className="img-responsive pfp-default pfp-appear"
                            trigger="now"
                            show="fadeInUp"
                            hide="fadeOutUp"
                            showDelay={1000}
                          />
                        </picture>
                        <img src={copy.bubble} alt="" className="pfp-bubble" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
