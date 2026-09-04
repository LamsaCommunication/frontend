"use client";

import * as React from "react";
import type { TextureTransform } from "../models/types";

/**
 * Custom hook for handling drag-to-reposition interactions on 3D decals.
 * Uses global window pointer listeners with requestAnimationFrame throttling
 * so dragging never drops when leaving the decal boundary, providing buttery-smooth 60/120fps motion.
 */
export function useDragHandler(
  transform: TextureTransform | undefined,
  onChange: ((updates: Partial<TextureTransform>) => void) | undefined,
  setOrbit: ((enabled: boolean) => void) | undefined,
  isLocked: boolean | undefined,
  onLockedDragAttempt: (() => void) | undefined
) {
  const [isDragging, setIsDragging] = React.useState(false);
  const startPos = React.useRef({ x: 0, y: 0 });
  const startOffset = React.useRef({ x: 0, y: 0 });
  const rafId = React.useRef<number | null>(null);
  const pendingUpdates = React.useRef<Partial<TextureTransform> | null>(null);

  // Keep latest onChange and setOrbit in refs to avoid recreating listeners
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const setOrbitRef = React.useRef(setOrbit);
  setOrbitRef.current = setOrbit;

  const onPointerDown = React.useCallback(
    (e: any) => {
      e.stopPropagation();

      if (isLocked) {
        onLockedDragAttempt?.();
        return;
      }

      const clientX = e.clientX ?? e.nativeEvent?.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? e.nativeEvent?.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;

      setIsDragging(true);
      startPos.current = { x: clientX, y: clientY };
      startOffset.current = {
        x: transform?.offsetX ?? 0,
        y: transform?.offsetY ?? 0,
      };

      setOrbitRef.current?.(false);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";
      document.body.style.touchAction = "none";
    },
    [isLocked, onLockedDragAttempt, transform?.offsetX, transform?.offsetY]
  );

  const onPointerOver = React.useCallback(
    (e: any) => {
      e.stopPropagation();
      if (!isLocked) {
        document.body.style.cursor = "grab";
      }
    },
    [isLocked]
  );

  const onPointerOut = React.useCallback(
    (e: any) => {
      if (!isDragging) {
        document.body.style.cursor = "auto";
      }
    },
    [isDragging]
  );

  // Window pointer listeners active while dragging
  React.useEffect(() => {
    if (!isDragging) return;

    const handleWindowPointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      pendingUpdates.current = {
        offsetX: Math.round(startOffset.current.x + deltaX),
        offsetY: Math.round(startOffset.current.y + deltaY),
      };

      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(() => {
          if (pendingUpdates.current && onChangeRef.current) {
            onChangeRef.current(pendingUpdates.current);
            pendingUpdates.current = null;
          }
          rafId.current = null;
        });
      }
    };

    const handleWindowPointerUp = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      if (pendingUpdates.current && onChangeRef.current) {
        onChangeRef.current(pendingUpdates.current);
        pendingUpdates.current = null;
      }

      setIsDragging(false);
      setOrbitRef.current?.(true);
      document.body.style.cursor = "auto";
      document.body.style.userSelect = "";
      document.body.style.touchAction = "";
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    window.addEventListener("pointerup", handleWindowPointerUp, { passive: true });
    window.addEventListener("pointercancel", handleWindowPointerUp, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
      window.removeEventListener("pointercancel", handleWindowPointerUp);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
    };
  }, [isDragging]);

  return { onPointerDown, onPointerOver, onPointerOut };
}
