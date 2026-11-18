"use client";

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from "react";

type DragOptions = {
  /** Pixels the pointer must travel before a press becomes a drag. */
  threshold: number;
  /** Fraction of the remaining distance covered each frame (the "lag" behind the cursor). */
  easing: number;
  /** Return false to ignore this press (e.g. on mobile layouts). */
  enabled?: () => boolean;
};

/**
 * Drag an absolutely positioned element inside its offset parent. The element
 * eases toward the pointer instead of sticking to it, and gets `is-pressed` /
 * `is-dragging` classes for styling. Returns the pointerdown handler plus a
 * function telling whether the last press turned into a drag (to suppress clicks).
 */
export function useDrag<T extends HTMLElement>({ threshold, easing, enabled }: DragOptions) {
  const draggedRef = useRef(false);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<T>) => {
      if ((event.button !== 0 && event.button !== undefined) || (enabled && !enabled())) {
        return;
      }
      event.preventDefault();
      const element = event.currentTarget;
      const container = element.parentElement;
      if (!container) {
        return;
      }
      draggedRef.current = false;
      const containerRect = container.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      let currentX = rect.left - containerRect.left;
      let currentY = rect.top - containerRect.top;
      let targetX = currentX;
      let targetY = currentY;
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const startX = event.clientX;
      const startY = event.clientY;
      let dragging = false;
      let frame = 0;

      element.style.left = `${currentX}px`;
      element.style.top = `${currentY}px`;
      element.style.right = "auto";
      element.style.bottom = "auto";
      element.setPointerCapture(event.pointerId);
      element.classList.add("is-pressed");

      const settled = () => Math.abs(targetX - currentX) <= 0.2 && Math.abs(targetY - currentY) <= 0.2;

      function step() {
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        currentX += dx * easing;
        currentY += dy * easing;
        if (Math.abs(dx) < 0.2 && Math.abs(dy) < 0.2) {
          currentX = targetX;
          currentY = targetY;
        }
        element.style.left = `${currentX}px`;
        element.style.top = `${currentY}px`;
        frame = dragging || !settled() ? requestAnimationFrame(step) : 0;
      }

      function onMove(moveEvent: PointerEvent) {
        if (!dragging) {
          if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) < threshold) {
            return;
          }
          dragging = true;
          draggedRef.current = true;
          element.classList.remove("is-pressed");
          element.classList.add("is-dragging");
        }
        targetX = moveEvent.clientX - containerRect.left - offsetX;
        targetY = moveEvent.clientY - containerRect.top - offsetY;
        if (!frame) {
          frame = requestAnimationFrame(step);
        }
      }

      function onUp() {
        dragging = false;
        element.classList.remove("is-pressed", "is-dragging");
        if (!frame && !settled()) {
          frame = requestAnimationFrame(step);
        }
        element.removeEventListener("pointermove", onMove);
        element.removeEventListener("pointerup", onUp);
        element.removeEventListener("pointercancel", onUp);
      }

      element.addEventListener("pointermove", onMove);
      element.addEventListener("pointerup", onUp);
      element.addEventListener("pointercancel", onUp);
    },
    [threshold, easing, enabled],
  );

  /** True if the most recent press moved far enough to count as a drag. Resets after reading. */
  const consumeDragged = useCallback(() => {
    const dragged = draggedRef.current;
    draggedRef.current = false;
    return dragged;
  }, []);

  return { onPointerDown, consumeDragged };
}
