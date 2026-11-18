"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from "react";
import { useMotion } from "./MotionProvider";

const MOBILE_MAX_WIDTH = 991;
const CLICK_RESET_MS = 1000;

type Trigger = "appear" | "now" | "click";

type AnimatedProps<T extends ElementType> = {
  as?: T;
  /** animate.css-style class added when the element enters, e.g. "fadeInUp". */
  show: string;
  /** Class added when the element leaves, e.g. "fadeOutUp". */
  hide: string;
  showDelay?: number;
  hideDelay?: number;
  /**
   * appear/now: enter on mount (and when `active` turns on), leave when the page navigates away.
   * click: enter/leave with the navigation menu.
   */
  trigger?: Trigger;
  /** Only animate at mobile widths; on desktop the element is simply visible (see main.css). */
  mobileOnly?: boolean;
  /** For carousel slides: entering replays each time this turns true. */
  active?: boolean;
  /** For carousel slides: play the leave animation while the slide is being replaced. */
  exiting?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

function isDesktop(): boolean {
  return window.innerWidth > MOBILE_MAX_WIDTH;
}

export function Animated<T extends ElementType = "div">({
  as,
  show,
  hide,
  showDelay = 0,
  hideDelay = 0,
  trigger = "appear",
  mobileOnly = false,
  active = true,
  exiting = false,
  className,
  children,
  ...rest
}: AnimatedProps<T>) {
  const { leaving: pageLeaving, navOpen } = useMotion();
  const leaving = pageLeaving || exiting;
  const [shown, setShown] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [inView, setInView] = useState(trigger !== "appear");
  const hasOpened = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);

  // "appear" elements wait until they are actually on screen (the old jQuery appear plugin).
  useEffect(() => {
    if (trigger !== "appear" || !elementRef.current) {
      return;
    }
    const element = elementRef.current;
    const observer = new IntersectionObserver((entries) => {
      setInView(entries.some((entry) => entry.isIntersecting));
    });
    observer.observe(element);
    // Like the plugin's force_appear: check the layout directly too, since
    // observers only report once the browser paints (not in background tabs).
    const forceCheck = window.setTimeout(() => {
      const rect = element.getBoundingClientRect();
      const visible = rect.width > 0 || rect.height > 0;
      if (visible && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth) {
        setInView(true);
      }
    }, 10);
    return () => {
      window.clearTimeout(forceCheck);
      observer.disconnect();
    };
  }, [trigger]);

  // Reset synchronously when a slide deactivates or the page comes back from bfcache.
  const [prev, setPrev] = useState({ active, leaving });
  if (prev.active !== active || prev.leaving !== leaving) {
    setPrev({ active, leaving });
    if (!active) {
      setShown(false);
      setHidden(false);
    } else if (!leaving) {
      setHidden(false);
    }
  }

  useEffect(() => {
    if (trigger === "click" || !active || !inView || leaving || shown || (mobileOnly && isDesktop())) {
      return;
    }
    const timer = window.setTimeout(() => {
      setHidden(false);
      setShown(true);
    }, showDelay);
    return () => window.clearTimeout(timer);
  }, [trigger, active, inView, leaving, shown, mobileOnly, showDelay]);

  useEffect(() => {
    if (trigger === "click" || !leaving || (mobileOnly && isDesktop())) {
      return;
    }
    const timer = window.setTimeout(() => setHidden(true), hideDelay);
    return () => window.clearTimeout(timer);
  }, [trigger, leaving, mobileOnly, hideDelay]);

  useEffect(() => {
    if (trigger !== "click") {
      return;
    }
    if (navOpen) {
      hasOpened.current = true;
      const timer = window.setTimeout(() => {
        setHidden(false);
        setShown(true);
      }, showDelay);
      return () => window.clearTimeout(timer);
    }
    if (!hasOpened.current) {
      return;
    }
    let resetTimer = 0;
    const hideTimer = window.setTimeout(() => {
      setHidden(true);
      resetTimer = window.setTimeout(() => {
        setShown(false);
        setHidden(false);
      }, CLICK_RESET_MS);
    }, hideDelay);
    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(resetTimer);
    };
  }, [trigger, navOpen, showDelay, hideDelay]);

  const Tag: ElementType = as ?? "div";
  const classes = [
    className,
    "animated",
    trigger,
    mobileOnly && "appearjustmobile",
    shown && show,
    hidden && hide,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={elementRef} className={classes} {...rest}>
      {children}
    </Tag>
  );
}
