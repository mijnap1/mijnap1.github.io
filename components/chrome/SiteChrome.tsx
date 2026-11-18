"use client";

import type { ReactNode } from "react";
import { href, type Locale, type PageKey } from "@/lib/i18n";
import { SOCIAL_LINKS } from "@/lib/site";
import { Animated } from "../motion/Animated";
import { useMotion } from "../motion/MotionProvider";
import { ThemeToggle } from "../theme/theme";
import { LogoMark } from "./LogoMark";
import { NavLabel } from "./NavLabel";
import { SiteMenu } from "./SiteMenu";

type SiteChromeProps = {
  locale: Locale;
  /** Which page the en/fr switch should point at. */
  page: PageKey;
  navLabel?: string;
  frameClassName?: string;
  /** Home only: floating mail button on mobile. */
  mobileContact?: boolean;
  footerClassName?: string;
  children: ReactNode;
};

function SocialLinks() {
  return SOCIAL_LINKS.map((social) => (
    <a
      key={social.href}
      className="noanimation"
      href={social.href}
      target="_blank"
      rel="noopener"
      aria-label={social.label}
      // Clicking opens a new tab; drop focus so the icon doesn't stay highlighted.
      onClick={(event) => event.currentTarget.blur()}
    >
      <span className={`fa ${social.icon}`} aria-hidden="true"></span>
    </a>
  ));
}

function LanguageLinks({ locale, page, className }: { locale: Locale; page: PageKey; className?: string }) {
  return (
    <>
      <a className={[className, locale === "en" && "active"].filter(Boolean).join(" ")} href={href(page, "en")}>
        en
      </a>
      <a className={[className, locale === "fr" && "active"].filter(Boolean).join(" ")} href={href(page, "fr")}>
        fr
      </a>
    </>
  );
}

export function SiteChrome({
  locale,
  page,
  navLabel,
  frameClassName,
  mobileContact,
  footerClassName,
  children,
}: SiteChromeProps) {
  const { navOpen, navClosing, setNavOpen } = useMotion();

  return (
    <>
      <noscript>
        <div id="noscript">
          <div className="box">
            Accurate functioning of the website require JavaScript usage in your browser. <br />
            Some functions may not run properly without it!
          </div>
        </div>
      </noscript>

      <h1 id="logo">
        <a href={href("home", locale)} title="Main Page">
          <LogoMark />
          <span className="sr-only">Jamie Ryu</span>
        </a>
      </h1>
      {navLabel ? <NavLabel label={navLabel} /> : null}

      <SiteMenu locale={locale} page={page} />

      {/* Only shown while the menu is open (main/app.css force it visible under body.navbar-open). */}
      <Animated
        as="a"
        className="nav-search-btn"
        href={href("search", locale)}
        aria-label="Open search"
        title="Search"
        style={{ display: "none" }}
        trigger="click"
        show="fadeInLeft"
        hide="fadeOutRight"
        showDelay={700}
      >
        <span className="fa fa-search" aria-hidden="true"></span>
      </Animated>

      <ThemeToggle id="theme-toggle-mobile" className="theme-toggle-mobile" />
      {mobileContact ? (
        <a className="home-mobile-contact" href={href("contact", locale)} aria-label="Open contact page">
          <ion-icon name="mail-open-outline" aria-hidden="true"></ion-icon>
        </a>
      ) : null}

      <div
        id="navbar-open-button"
        className={["navbar-toggle", navOpen && "navbar-close", navClosing && "is-closing"].filter(Boolean).join(" ")}
        role="button"
        tabIndex={0}
        aria-label={navOpen ? "Close menu" : "Open menu"}
        aria-expanded={navOpen}
        onClick={() => setNavOpen(!navOpen)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setNavOpen(!navOpen);
          }
        }}
      >
        <span className="icon-bar first"></span>
        <span className="icon-bar center"></span>
        <span className="icon-bar last"></span>
      </div>

      <Animated id="lang-box" trigger="appear" mobileOnly show="fadeInRight" hide="fadeOutRight">
        <LanguageLinks locale={locale} page={page} className="txt" />
      </Animated>

      <div id="link-box" className="hidden-xs hidden-sm">
        <div className="theme-toggle-main">
          <ThemeToggle id="theme-toggle" />
        </div>
        <div className="search-modal-click">
          <a href={href("search", locale)} aria-label="Search">
            <span className="fa fa-search" aria-hidden="true"></span>
          </a>
        </div>
        <div>
          <a href={href("contact", locale)}>
            Contact
            <span className="arrow-container">
              <span className="arrow"></span>
            </span>
          </a>
        </div>
      </div>

      <div id="social-box" className="hidden-xs hidden-sm">
        <SocialLinks />
      </div>
      <div id="footer-box" className={["hidden-xs hidden-sm", footerClassName].filter(Boolean).join(" ")}>
        <span className="year" suppressHydrationWarning>&copy; {new Date().getFullYear()}</span>
        <span className="separator"></span>
        <h3 className="company">jamie ryu</h3>
      </div>

      <div className={["frame", frameClassName].filter(Boolean).join(" ")}>
        <div className="frame-table-container">
          <div className="frame-table-box">{children}</div>
        </div>
      </div>
    </>
  );
}
