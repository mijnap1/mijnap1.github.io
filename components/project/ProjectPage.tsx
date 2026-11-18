"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";
import type { Locale } from "@/lib/i18n";
import { SiteChrome } from "../chrome/SiteChrome";
import { Animated } from "../motion/Animated";
import { ThemedImage } from "../theme/theme";
import { PROJECTS, type Project } from "./projects";
import "./project-page.css";

/** Bootstrap's carousel transition length; the old slide animates out during it. */
const SLIDE_MS = 600;
/** Wheel scrolling is ignored for a moment after load so the intro can play. */
const INITIAL_WHEEL_LOCK_MS = 2000;
const GRID_PANEL_DELAY_MS = 160;
const GRID_REVEAL_DELAY_MS = 360;
const GRID_RETURN_DELAY_MS = 180;
const COMPACT_MAX_WIDTH = 991;
const MOBILE_MAX_WIDTH = 767;

const COPY = {
  en: {
    navLabel: "projects",
    toGrid: "Switch to grid view",
    toDetail: "Switch to detail view",
    detail: "Detail",
    noRotation: "Turn your phone back on!",
  },
  fr: {
    navLabel: "projets",
    toGrid: "Basculer vers la vue en grille",
    toDetail: "Basculer vers la vue détaillée",
    detail: "Detail",
    noRotation: "Remettez votre téléphone à l'endroit !",
  },
} satisfies Record<Locale, Record<string, string>>;

const GRID_STAGE_CLASSES = [
  "portfolio-grid-transition",
  "portfolio-grid-stage-exit",
  "portfolio-grid-stage-return",
  "portfolio-grid-stage-panel",
  "portfolio-grid-mode",
] as const;
type GridStageClass = (typeof GRID_STAGE_CLASSES)[number];

const pad = (n: number) => String(n).padStart(2, "0");
const normalizeAlias = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Supports `?project=utkcc`, `?slide=3` and `#utkcc` deep links. */
function indexFromUrl(): number {
  const params = new URLSearchParams(window.location.search);
  const target = params.get("project") || params.get("slide") || window.location.hash.slice(1);
  if (!target) {
    return 0;
  }
  if (/^\d+$/.test(target)) {
    return Math.min(Math.max(Number(target), 1), PROJECTS.length) - 1;
  }
  const wanted = normalizeAlias(decodeURIComponent(target));
  return Math.max(
    0,
    PROJECTS.findIndex((project) => normalizeAlias(project.alias) === wanted),
  );
}

type Transition = { from: number; to: number; forward: boolean } | null;

/** Keeps the address bar pointing at the current project so it can be shared. */
function syncUrl(index: number) {
  window.history.replaceState(null, "", `#${normalizeAlias(PROJECTS[index].alias)}`);
}

function useCarousel() {
  const [active, setActive] = useState(0);
  const [transition, setTransition] = useState<Transition>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const busy = useRef(false);

  // Deep links pick the starting slide without animating (like the original).
  useLayoutEffect(() => {
    const initial = indexFromUrl();
    if (initial) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL is only possible after hydration
      setActive(initial);
    }
  }, []);

  const goTo = useCallback(
    (target: number) => {
      const to = Math.min(Math.max(target, 0), PROJECTS.length - 1);
      if (busy.current || to === active) {
        return false;
      }
      busy.current = true;
      setHasMoved(true);
      setTransition({ from: active, to, forward: to > active });
      window.setTimeout(() => {
        busy.current = false;
        setActive(to);
        setTransition(null);
        syncUrl(to);
      }, SLIDE_MS);
      return true;
    },
    [active],
  );

  /** Jump without the slide animation (used when leaving the grid view). */
  const jumpTo = useCallback((target: number) => {
    const to = Math.min(Math.max(target, 0), PROJECTS.length - 1);
    setActive(to);
    setHasMoved(true);
    syncUrl(to);
  }, []);

  return { active, transition, hasMoved, goTo, jumpTo };
}

type SlideProps = {
  project: Project;
  locale: Locale;
  className: string;
  active: boolean;
  exiting: boolean;
  wrappedTitle: boolean;
};

function Slide({ project, locale, className, active, exiting, wrappedTitle }: SlideProps) {
  const motion = { active, exiting };
  return (
    <div className={`${className}${wrappedTitle ? " has-wrapped-title" : ""}`} data-alias={project.alias}>
      <div className="container-fluid no-padding">
        <div className="row">
          <div className="col-sm-10 col-sm-offset-1 col-md-5 col-md-offset-0 col-lg-4 col-lg-offset-1">
            <div className="md-table-container">
              <div className="table-box">
                <Animated className="portfolio-title" show="fadeInUp" hide="fadeOutUp" {...motion}>
                  {project.title[locale]}
                </Animated>
                <Animated
                  className="portfolio-intro"
                  show="fadeInUp"
                  hide="fadeOutUp"
                  showDelay={100}
                  hideDelay={100}
                  {...motion}
                >
                  {project.intro[locale]}
                </Animated>
                <Animated
                  className="portfolio-desc hidden-xs"
                  show="fadeInUp"
                  hide="fadeOutUp"
                  showDelay={200}
                  hideDelay={200}
                  {...motion}
                >
                  {project.description[locale]}
                </Animated>
                <Animated
                  as="a"
                  className="noSwipe portfolio-btn btn btn-primary animation"
                  href={project.href}
                  target="_blank"
                  rel="noopener"
                  show="fadeInUp"
                  hide="fadeOutUp"
                  showDelay={300}
                  hideDelay={300}
                  {...motion}
                >
                  {project.linkLabel[locale]}
                  <span className="arrow"></span>
                </Animated>
              </div>
            </div>
          </div>
          <div className="col-sm-12 col-md-6 col-md-offset-1 col-lg-6 col-lg-offset-1">
            <div className="md-table-container">
              <div className="table-box">
                <div className="portfolio-img-container">
                  <div className="portfolio-img-box">
                    <picture>
                      <Animated
                        as={ThemedImage}
                        lightSrc={project.image}
                        darkSrc={project.darkImage}
                        alt={project.imageAlt}
                        show="fadeInDownPFIMG"
                        hide="fadeOutDownPFIMG"
                        style={{ width: "132%", height: "auto" }}
                        {...motion}
                      />
                    </picture>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type PageCounterProps = {
  current: number;
  /** Fades out while the grid view is showing. */
  hidden: boolean;
  onJump: (index: number) => void;
};

function PageCounter({ current, hidden, onJump }: PageCounterProps) {
  const [editing, setEditing] = useState(false);
  const currentRef = useRef<HTMLSpanElement>(null);
  const lastTap = useRef(0);

  useEffect(() => {
    const node = currentRef.current;
    if (!editing || !node) {
      return;
    }
    node.focus();
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [editing]);

  function finish(commit: boolean) {
    const node = currentRef.current;
    setEditing(false);
    if (!node) {
      return;
    }
    const target = parseInt((node.textContent || "").replace(/\D/g, ""), 10);
    node.textContent = pad(current + 1);
    if (commit && !Number.isNaN(target)) {
      onJump(target - 1);
    }
  }

  return (
    // Double-click (or double-tap) the number to type a project number and jump to it.
    <Animated
      className="carousel-page-number"
      show="fadeInRight"
      hide="fadeOutRight"
      exiting={hidden}
      onDoubleClick={(event: MouseEvent) => {
        event.preventDefault();
        setEditing(true);
      }}
      onTouchEnd={(event: TouchEvent) => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
          event.preventDefault();
          setEditing(true);
        }
        lastTap.current = now;
      }}
    >
      <span
        ref={currentRef}
        className={`current${editing ? " editing" : ""}`}
        contentEditable={editing}
        suppressContentEditableWarning
        onKeyDown={(event: KeyboardEvent<HTMLSpanElement>) => {
          if (event.key === "Enter") {
            event.preventDefault();
            finish(true);
          } else if (event.key === "Escape") {
            event.preventDefault();
            finish(false);
          }
        }}
        onBlur={() => {
          if (editing) {
            finish(true);
          }
        }}
      >
        {pad(current + 1)}
      </span>
      <span className="max">{PROJECTS.length}</span>
    </Animated>
  );
}

function GridView({
  locale,
  visible,
  onOpen,
}: {
  locale: Locale;
  visible: boolean;
  onOpen: (index: number) => void;
}) {
  return (
    <div id="portfolio_grid_view" className="portfolio-grid-view" aria-hidden={!visible}>
      <div className="portfolio-grid-view-inner">
        {PROJECTS.map((project, index) => (
          <article
            key={project.alias}
            className="portfolio-grid-card"
            style={{ "--grid-card-delay": `${500 + index * 28}ms` } as CSSProperties}
          >
            <div
              className="portfolio-grid-card-media"
              role="img"
              aria-label={project.imageAlt}
              style={{
                backgroundImage: `url('${project.grid.image}')`,
                backgroundPosition: project.grid.position ?? "center center",
                backgroundSize: project.grid.size ?? "cover",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div className="portfolio-grid-card-body">
              <div className="portfolio-grid-card-index">{pad(index + 1)}</div>
              <div className="portfolio-grid-card-title">{project.title[locale]}</div>
              <div className="portfolio-grid-card-intro">{project.intro[locale]}</div>
              <div className="portfolio-grid-card-actions">
                <button type="button" className="portfolio-grid-card-open" onClick={() => onOpen(index)}>
                  {COPY[locale].detail}
                </button>
                <a className="portfolio-grid-card-link" href={project.href} target="_blank" rel="noopener">
                  {project.linkLabel[locale]}
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/** Drives the carousel ⇄ grid transition through the body classes the CSS animates on. */
function useGridView(onReturnToSlide: (index: number) => void) {
  const [mode, setMode] = useState<"carousel" | "grid">("carousel");
  const [stage, setStage] = useState<GridStageClass[]>([]);
  const [transitioning, setTransitioning] = useState(false);
  const [bgStyle, setBgStyle] = useState<CSSProperties | undefined>(undefined);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const body = document.body;
    GRID_STAGE_CLASSES.forEach((name) => body.classList.toggle(name, stage.includes(name)));
  }, [stage]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
      GRID_STAGE_CLASSES.forEach((name) => document.body.classList.remove(name));
    };
  }, []);

  const schedule = (callback: () => void, delay: number) => {
    timers.current.push(window.setTimeout(callback, delay));
  };
  const clearTimers = () => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  };

  function enter() {
    clearTimers();
    setTransitioning(true);
    setMode("grid");
    setStage(["portfolio-grid-transition", "portfolio-grid-stage-exit"]);
    schedule(() => setStage((s) => [...s, "portfolio-grid-stage-panel"]), GRID_PANEL_DELAY_MS);
    schedule(() => {
      setStage((s) => [...s, "portfolio-grid-mode"]);
      setTransitioning(false);
    }, GRID_REVEAL_DELAY_MS);
  }

  function exit(targetIndex: number | null) {
    clearTimers();
    setMode("carousel");
    setTransitioning(true);
    const compact = window.innerWidth <= COMPACT_MAX_WIDTH;
    const mobile = window.innerWidth <= MOBILE_MAX_WIDTH;
    setStage(["portfolio-grid-transition", "portfolio-grid-stage-return", "portfolio-grid-stage-panel"]);
    if (mobile) {
      setBgStyle({
        top: "132px",
        right: "24px",
        bottom: "24px",
        width: "calc(100% - 48px)",
        transition: "width 0.18s cubic-bezier(1, 0, .25, 1), opacity 0.18s ease",
      });
    }
    schedule(() => {
      if (mobile) {
        setBgStyle((style) => ({ ...style, width: "15px" }));
      }
      if (!compact) {
        setStage((s) => s.filter((name) => name !== "portfolio-grid-stage-panel"));
      }
    }, 20);
    schedule(() => {
      setBgStyle(undefined);
      setStage([]);
      setTransitioning(false);
      // Switch slides once the carousel is visible again, so the entrance animation is seen.
      if (targetIndex !== null) {
        onReturnToSlide(targetIndex);
      }
    }, GRID_RETURN_DELAY_MS);
  }

  return { mode, stage, transitioning, bgStyle, enter, exit };
}

export function ProjectPage({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const carousel = useCarousel();
  const grid = useGridView(carousel.jumpTo);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [wrappedTitle, setWrappedTitle] = useState<number | null>(null);
  const { active, transition } = carousel;
  const isGrid = grid.mode === "grid";

  // Mouse wheel / trackpad steps through projects, one slide per gesture.
  const wheelReady = useRef(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      wheelReady.current = true;
    }, INITIAL_WHEEL_LOCK_MS);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    const node = carouselRef.current;
    if (!node) {
      return;
    }
    function onWheel(event: WheelEvent) {
      if (!wheelReady.current || isGrid) {
        return;
      }
      event.preventDefault();
      if (carousel.goTo(active + (event.deltaY > 0 ? 1 : -1))) {
        wheelReady.current = false;
        window.setTimeout(() => {
          wheelReady.current = true;
        }, SLIDE_MS);
      }
    }
    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [carousel, active, isGrid]);

  // On phones, long titles wrap to two lines and the image needs extra room.
  useEffect(() => {
    function measure() {
      const title = carouselRef.current?.querySelectorAll(".item")[active]?.querySelector<HTMLElement>(".portfolio-title");
      if (window.innerWidth > MOBILE_MAX_WIDTH || !title) {
        setWrappedTitle(null);
        return;
      }
      const lineHeight = parseFloat(window.getComputedStyle(title).lineHeight);
      setWrappedTitle(lineHeight && title.offsetHeight > lineHeight * 1.5 ? active : null);
    }
    const frame = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  const isFirst = active === 0;
  const isLast = active === PROJECTS.length - 1;
  const leftArrowClass = isFirst ? (carousel.hasMoved ? "slideOutUp" : "hidden") : "slideInDown";
  const rightArrowClass = isLast ? (carousel.hasMoved ? "slideOutDown" : "hidden") : "slideInUp";
  const toggleLabel = isGrid ? copy.toDetail : copy.toGrid;

  function slideClass(index: number): string {
    if (transition) {
      const direction = transition.forward ? "left" : "right";
      if (index === transition.from) return `item active ${direction}`;
      if (index === transition.to) return `item ${transition.forward ? "next" : "prev"} ${direction}`;
    }
    return index === active ? "item active" : "item";
  }

  return (
    <SiteChrome locale={locale} page="project" navLabel={copy.navLabel} frameClassName="with-padding">
      <div id="norotation">
        <div className="box">
          <div className="txt">{copy.noRotation}</div>
        </div>
      </div>

      <div
        id="carousel_portfolio_change_left"
        className={`noSwipe carousel-change left animated ${leftArrowClass}`}
        onClick={() => carousel.goTo(active - 1)}
      >
        <span className="fa fa-angle-up" aria-hidden="true"></span>
      </div>
      <div
        id="carousel_portfolio_change_right"
        className={`noSwipe carousel-change right animated ${rightArrowClass}`}
        onClick={() => carousel.goTo(active + 1)}
      >
        <span className="fa fa-angle-down" aria-hidden="true"></span>
      </div>
      <PageCounter current={active} hidden={grid.stage.length > 0} onJump={(index) => carousel.goTo(index)} />
      <Animated
        as="button"
        id="portfolio_view_toggle"
        className="portfolio-view-toggle"
        type="button"
        show="fadeInRight"
        hide="fadeOutRight"
        showDelay={100}
        aria-label={toggleLabel}
        aria-pressed={isGrid}
        title={toggleLabel}
        disabled={grid.transitioning}
        onClick={() => (isGrid ? grid.exit(null) : grid.enter())}
      >
        <span className={`fa ${isGrid ? "fa-list-ul" : "fa-th-large"}`} aria-hidden="true"></span>
      </Animated>

      <Animated className="portfolio-carousel-bg" show="activate" hide="deactivate" style={grid.bgStyle} />

      <div id="carousel_portfolio" ref={carouselRef} className="carousel slide carousel-simple">
        <div className="carousel-inner" role="listbox">
          {PROJECTS.map((project, index) => (
            <Slide
              key={project.alias}
              project={project}
              locale={locale}
              className={slideClass(index)}
              active={index === active}
              exiting={transition?.from === index}
              wrappedTitle={wrappedTitle === index}
            />
          ))}
        </div>
      </div>

      <GridView locale={locale} visible={grid.stage.includes("portfolio-grid-mode")} onOpen={(index) => grid.exit(index)} />
    </SiteChrome>
  );
}
