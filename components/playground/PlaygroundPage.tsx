"use client";

import { href } from "@/lib/i18n";
import { SiteChrome } from "../chrome/SiteChrome";
import { Animated } from "../motion/Animated";
import "./playground-page.css";

const SANDBOX = [
  "A cursor trail that reacts differently depending on section density and speed.",
  "A text toy where headlines break apart, then rebuild themselves on hover.",
  "A one-screen browser game hidden inside a portfolio card.",
];

const LANES = [
  {
    title: "Motion studies",
    body: "Short animation sketches for loaders, page handoffs, hover reactions, and transitions that feel more intentional than default easing.",
    status: "building",
    note: "hover + timing",
  },
  {
    title: "Interface lab",
    body: "Experimental layouts, component concepts, and UI systems that start as visual questions before they become full projects.",
    status: "testing",
    note: "layout + type",
  },
  {
    title: "Browser toys",
    body: "Small playful pieces I can ship fast, break on purpose, rebuild cleaner, and later spin into real portfolio work.",
    status: "soon",
    note: null,
  },
];

/** English-only page: a scratchpad of in-progress ideas. */
export function PlaygroundPage() {
  return (
    <SiteChrome locale="en" page="playground" navLabel="playground">
      <div className="container">
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <section className="playground-shell">
              <div className="playground-grid">
                <div className="playground-hero">
                  <Animated as="article" className="playground-copy" show="fadeInUp" hide="fadeOutUp" showDelay={120}>
                    <span className="eyebrow">creative coding</span>
                    <h2>Playground</h2>
                    <p>
                      A running space for the ideas that do not belong in a polished case study yet: motion tests, browser
                      toys, interface experiments, and little moments built just because they felt fun to make.
                    </p>
                    <div className="playground-taglist">
                      {["micro interactions", "interface lab", "tiny browser toys"].map((tag) => (
                        <span key={tag} className="playground-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Animated>
                  <Animated as="aside" className="playground-notes" show="fadeInUp" hide="fadeOutUp" showDelay={220}>
                    <h3>Currently in the sandbox</h3>
                    <p>
                      The goal here is simple: test ideas fast, keep the interesting ones, and let the weird ones stay
                      weird for a little longer.
                    </p>
                    <ul className="sandbox-list">
                      {SANDBOX.map((idea, i) => (
                        <li key={idea}>
                          <strong>{`0${i + 1}`}</strong> {idea}
                        </li>
                      ))}
                    </ul>
                  </Animated>
                </div>
                <div className="playground-lanes">
                  {LANES.map((lane, i) => (
                    <Animated
                      as="article"
                      key={lane.title}
                      className="playground-card"
                      show="fadeInUp"
                      hide="fadeOutUp"
                      showDelay={280 + i * 60}
                    >
                      <span className="lane-index">{`Lane 0${i + 1}`}</span>
                      <h3>{lane.title}</h3>
                      <p>{lane.body}</p>
                      <div className="status-row">
                        <span className="status-pill">{lane.status}</span>
                        {lane.note ? (
                          <span>{lane.note}</span>
                        ) : (
                          <a className="playground-link" href={href("contact", "en")}>
                            want early access?
                          </a>
                        )}
                      </div>
                    </Animated>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
