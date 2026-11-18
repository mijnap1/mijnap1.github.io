"use client";

import { Fragment, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { SiteChrome } from "../chrome/SiteChrome";
import { useDrag } from "../interaction/useDrag";
import { Animated } from "../motion/Animated";
import { useMotion } from "../motion/MotionProvider";
import { ABOUT_COPY, EXPERIENCE_FOLDERS, SKILLS, STICKERS, type ExperienceFolder } from "./content";
import "./about-page.css";

type Copy = (typeof ABOUT_COPY)[Locale];

const QUOTE_FONT =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&display=swap";
const CHAR_DELAY_S = 0.03;
const FOOTER_TOP_RANGE = 36;
const FOOTER_BOTTOM_RANGE = 180;
const MOBILE_MAX_WIDTH = 767;
const CRUSH_MIN_WIDTH = 1260;

type QuoteChar = { text: string; delay: string };

/** Splits the headline into lines → words → letters, numbering every character for its drop-in delay. */
function layoutQuote(lines: string[]) {
  let index = 0;
  const next = (text: string): QuoteChar => ({ text, delay: `${(index++ * CHAR_DELAY_S).toFixed(2)}s` });
  const laidOut = lines.map((line) =>
    line.split(" ").map((word, wordIndex) => ({
      space: wordIndex > 0 ? next("\u00a0") : null,
      letters: Array.from(word).map(next),
    })),
  );
  return { lines: laidOut, trailingSpace: next("\u00a0"), clover: next("") };
}

function Char({ char, className = "char", children }: { char: QuoteChar; className?: string; children?: ReactNode }) {
  return (
    <span className={className} style={{ "--char-delay": char.delay } as CSSProperties}>
      {children ?? char.text}
    </span>
  );
}

/** Headline that drops in letter by letter. */
function QuoteTitle({ lines, cloverAlt }: { lines: string[]; cloverAlt: string }) {
  const quote = layoutQuote(lines);
  return (
    <Animated as="h2" className="about-quote-title" show="fadeInUp" hide="fadeOutUp" showDelay={120}>
      {quote.lines.map((words, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 ? <br /> : null}
          {words.map((word, wordIndex) => (
            <Fragment key={wordIndex}>
              {word.space ? <Char char={word.space} className="char space" /> : null}
              {/* Keeps a word together when the headline wraps on small screens. */}
              <span className="nowrap">
                {word.letters.map((letter, i) => (
                  <Char key={i} char={letter} />
                ))}
              </span>
            </Fragment>
          ))}
        </Fragment>
      ))}
      <Char char={quote.trailingSpace} className="char space" />
      <Char char={quote.clover} className="char wave">
        <img src="/ico/sticker/clover.png" alt={cloverAlt} loading="lazy" />
      </Char>
    </Animated>
  );
}

function PortraitCards({ copy }: { copy: Copy }) {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <Animated
      className="card-snap"
      show="fadeInRight"
      hide="fadeOutRight"
      showDelay={260}
      data-active-index={activeIndex}
      onMouseEnter={() => setActiveIndex(1)}
      onMouseLeave={() => setActiveIndex(0)}
    >
      <div className="card-stack">
        {copy.portraits.map((src, i) => (
          <div className="card" key={src}>
            <img src={src} alt={copy.portraitAlts[i]} />
          </div>
        ))}
      </div>
    </Animated>
  );
}

function Sticker({ src, top, left, tilt, alt }: (typeof STICKERS)[number] & { alt: string }) {
  const { onPointerDown } = useDrag<HTMLImageElement>({ threshold: 8, easing: 0.16 });
  return (
    <Animated
      as="img"
      className="sticker-draggable"
      src={src}
      alt={alt}
      draggable={false}
      show="fadeInUp"
      hide="fadeOutUp"
      showDelay={220}
      style={{ top, left, "--sticker-tilt": tilt } as CSSProperties}
      onPointerDown={onPointerDown}
    />
  );
}

type FolderProps = {
  folder: ExperienceFolder;
  locale: Locale;
  copy: Copy;
  open: boolean;
  expanded: boolean;
  onToggleOpen: () => void;
  onToggleExpanded: () => void;
  onPreview: (src: string, alt: string, caption: string) => void;
  previewOpen: boolean;
};

function Folder({ folder, locale, copy, open, expanded, onToggleOpen, onToggleExpanded, onPreview, previewOpen }: FolderProps) {
  const { onPointerDown, consumeDragged } = useDrag<HTMLDivElement>({
    threshold: 4,
    easing: 0.1,
    // Folders stay put on phones so the page can scroll.
    enabled: () => window.innerWidth > MOBILE_MAX_WIDTH,
  });
  const label = folder.label[locale];
  const name = folder.shortName[locale];

  return (
    <Animated
      className={`experience-folder ${folder.tilt}${open ? " is-open" : ""}`}
      data-label={label}
      data-location={folder.location}
      show="fadeInUp"
      hide="fadeOutUp"
      showDelay={220}
      onPointerDown={onPointerDown}
      onClick={() => {
        if (consumeDragged() || previewOpen) {
          return;
        }
        onToggleOpen();
      }}
    >
      <img src={open ? "/ico/folder-open.png" : "/ico/folder-close.png"} alt={copy.folderAlt(name)} draggable={false} />
      <span className="folder-label" aria-hidden="true">
        {label}
      </span>
      <div
        className={`experience-gallery${expanded ? " is-expanded" : ""}`}
        data-location={folder.location}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        {folder.photos.map((photo, i) => {
          const src = `/ico/about-me/pictures/${folder.location}/${photo}`;
          const alt = copy.photoAlt(name, i + 1);
          return (
            <figure
              className="experience-card"
              key={photo}
              onClick={(event) => {
                event.preventDefault();
                if (!consumeDragged()) {
                  onPreview(src, alt, label);
                }
              }}
            >
              <img src={src} alt={alt} loading="lazy" />
            </figure>
          );
        })}
        <button className="experience-gallery-more" type="button" onClick={onToggleExpanded}>
          {expanded ? copy.showLess : copy.viewMore}
        </button>
      </div>
    </Animated>
  );
}

type Preview = { src: string; alt: string; caption: string } | null;

function PhotoPreview({ preview, copy, onClose }: { preview: Preview; copy: Copy; onClose: () => void }) {
  useEffect(() => {
    if (!preview) {
      return;
    }
    document.body.classList.add("about-preview-open");
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("about-preview-open");
      document.removeEventListener("keydown", onKey);
    };
  }, [preview, onClose]);

  return (
    <div
      className={`about-preview${preview ? " is-open" : ""}`}
      id="about-preview"
      aria-hidden={!preview}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="about-preview-shell" role="dialog" aria-modal="true" aria-label={copy.previewLabel}>
        <button className="about-preview-close" type="button" aria-label={copy.closePreview} onClick={onClose}>
          &times;
        </button>
        <div className="about-preview-image-wrap">
          {preview ? <img className="about-preview-image" src={preview.src} alt={preview.alt} /> : null}
        </div>
        <div className="about-preview-meta">
          <span className="about-preview-caption">{preview?.caption}</span>
        </div>
      </div>
    </div>
  );
}

function ExperienceSection({ locale, copy }: { locale: Locale; copy: Copy }) {
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [preview, setPreview] = useState<Preview>(null);

  const sectionClasses = [
    "about-section about-experience",
    openFolder && "has-open-gallery",
    expandedFolder && "has-expanded-gallery",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <section className={sectionClasses} id="about-experience">
        <div className="about-section-head">
          <Animated
            as="span"
            className="about-eyebrow about-eyebrow-quote about-eyebrow-quote-line-first"
            show="fadeInUp"
            hide="fadeOutUp"
          >
            {copy.lifeExperience}
          </Animated>
        </div>
        <div className="about-story-grid">
          <Animated as="p" className="about-story-lead" show="fadeInUp" hide="fadeOutUp" showDelay={220}>
            {copy.experienceLead.before}
            <span className="about-emphasis">{copy.experienceLead.emphasis}</span>
            {copy.experienceLead.after}
          </Animated>
        </div>
        <div className="about-experience-tiles">
          {EXPERIENCE_FOLDERS.map((folder) => (
            <Folder
              key={folder.location}
              folder={folder}
              locale={locale}
              copy={copy}
              open={openFolder === folder.location}
              expanded={expandedFolder === folder.location}
              previewOpen={preview !== null}
              onToggleOpen={() => {
                // Opening a folder closes (and collapses) the others.
                setOpenFolder((current) => (current === folder.location ? null : folder.location));
                setExpandedFolder(null);
              }}
              onToggleExpanded={() =>
                setExpandedFolder((current) => (current === folder.location ? null : folder.location))
              }
              onPreview={(src, alt, caption) => setPreview({ src, alt, caption })}
            />
          ))}
        </div>
      </section>
      <PhotoPreview preview={preview} copy={copy} onClose={() => setPreview(null)} />
    </>
  );
}

function SkillsSection({ copy }: { copy: Copy }) {
  const { leaving } = useMotion();
  const [crushed, setCrushed] = useState(false);
  const isCrushed = crushed && !leaving;

  return (
    <section className="about-section about-skills" id="about-skills">
      <div className="about-section-head">
        <Animated as="span" className="about-eyebrow about-eyebrow-quote" show="fadeInUp" hide="fadeOutUp">
          {copy.skills}
        </Animated>
      </div>
      <div className="about-skills-wrap">
        <Animated
          className={["awards-container", isCrushed && "crushed"].filter(Boolean).join(" ")}
          show="showAwards"
          hide="hideAwards"
          onClick={() => {
            if (window.innerWidth >= CRUSH_MIN_WIDTH) {
              setCrushed((value) => !value);
            }
          }}
        >
          {SKILLS.map((skill, i) => (
            <Fragment key={skill.name}>
              {/* Phones show the badges two per row. */}
              {i > 0 && i % 2 === 0 ? <div className="hidden-sm hidden-md hidden-lg"></div> : null}
              <img className={`img ${skill.position}`} src={skill.src} alt={skill.name} />
            </Fragment>
          ))}
          <div className="do-not-click">
            <img className="icon cursor" src="/ico/icon-noclick.svg" alt="cursor" />
            <span className="text cursor">
              {copy.doNotClick[0]}
              <br />
              {copy.doNotClick[1]}
            </span>
            <div className="clearfix"></div>
            <img className="icon smile" src="/ico/icon-smile.svg" alt="smile" />
            <span className="text smile">{copy.toldYou}</span>
            <div className="clearfix"></div>
          </div>
        </Animated>
      </div>
    </section>
  );
}

/** Shows the footer only near the top and bottom of the long About page. */
function useFooterVisibility(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const scrollHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);
      const distanceFromBottom = scrollHeight - (scrollTop + window.innerHeight);
      setVisible(scrollTop <= FOOTER_TOP_RANGE || distanceFromBottom <= FOOTER_BOTTOM_RANGE);
    }
    function queue() {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    }
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);
  return visible;
}

export function AboutPage({ locale }: { locale: Locale }) {
  const copy = ABOUT_COPY[locale];
  const footerVisible = useFooterVisibility();

  return (
    <SiteChrome
      locale={locale}
      page="about"
      navLabel={copy.navLabel}
      frameClassName="about-frame"
      footerClassName={footerVisible ? "about-footer-visible" : "about-footer-hidden"}
    >
      {/* React hoists this into <head>; only the About page uses the serif headline font. */}
      <link rel="stylesheet" href={QUOTE_FONT} precedence="default" />
      <div id="norotation">
        <div className="box">
          <div className="txt">{copy.noRotation}</div>
        </div>
      </div>

      <main className="about-scroll">
        <section className="about-section about-hero" id="about-hero">
          <div className="about-hero-grid">
            <div className="about-hero-text">
              <QuoteTitle lines={copy.quote} cloverAlt={copy.clover} />
            </div>
            <div className="about-hero-visual">
              <PortraitCards copy={copy} />
            </div>
          </div>
          <Animated className="about-scroll-hint" show="fadeInUp" hide="fadeOutUp" showDelay={3000}>
            <span className="scroll-text">{copy.scrollHint}</span>
          </Animated>
        </section>

        <section className="about-section about-story" id="about-story">
          <div className="about-section-head">
            <Animated as="span" className="about-eyebrow about-eyebrow-quote" show="fadeInUp" hide="fadeOutUp">
              {copy.whoIAm}
            </Animated>
          </div>
          <div className="about-story-grid">
            <Animated as="p" className="about-story-lead" show="fadeInUp" hide="fadeOutUp" showDelay={220}>
              {copy.storyLead}
            </Animated>
          </div>
          <div className="sticker-sprinkles sticker-story">
            {STICKERS.map((sticker, i) => (
              <Sticker key={sticker.src} {...sticker} alt={`Sticker collage ${i + 1}`} />
            ))}
          </div>
        </section>

        <ExperienceSection locale={locale} copy={copy} />
        <SkillsSection copy={copy} />
      </main>
    </SiteChrome>
  );
}
