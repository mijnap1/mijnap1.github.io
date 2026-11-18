import Link from "next/link";
import "./construction-page.css";

const TAPE_TEXT = "Under construction";

/** One strip of barricade tape; the text is doubled so the marquee loops seamlessly. */
function Tape({ className }: { className: string }) {
  const run = Array.from({ length: 8 }, (_, i) => (
    <span key={i} className="uc-tape-item">
      {TAPE_TEXT}
    </span>
  ));
  return (
    <div className={`uc-tape ${className}`} aria-hidden="true">
      <div className="uc-tape-track">
        {run}
        {run}
      </div>
    </div>
  );
}

function Cone() {
  return (
    <svg className="uc-cone" viewBox="0 0 120 120" aria-hidden="true">
      <path className="uc-cone-body" d="M52 14 H68 L90 96 H30 Z" />
      <path className="uc-cone-band" d="M45.6 38 H74.4 L77.7 50 H42.3 Z" />
      <path className="uc-cone-band" d="M38.6 64 H81.4 L84.6 76 H35.4 Z" />
      <rect className="uc-cone-base" x="18" y="94" width="84" height="10" rx="3" />
    </svg>
  );
}

/** Standalone placeholder page with a hazard-tape construction theme. */
export function ConstructionPage() {
  return (
    <main className="uc-page">
      <Tape className="uc-tape-top" />
      <Tape className="uc-tape-bottom" />

      <section className="uc-card">
        <Cone />
        <p className="uc-eyebrow">
          <span className="uc-dot" />
          Work in progress
        </p>
        <h1 className="uc-title">
          Under
          <br />
          construction
        </h1>
        <p className="uc-copy">
          This corner of the site is being rebuilt from the ground up. Hard hats on — check back soon.
        </p>

        <div className="uc-progress" role="progressbar" aria-label="Build progress" aria-valuenow={64} aria-valuemin={0} aria-valuemax={100}>
          <div className="uc-progress-fill" />
        </div>
        <div className="uc-progress-meta">
          <span>Laying foundations</span>
          <span>64%</span>
        </div>

        <Link className="uc-home" href="/">
          <span aria-hidden="true">←</span> Back to home
        </Link>
      </section>

      <p className="uc-footer">jamieryu.com · site crew at work</p>
    </main>
  );
}
