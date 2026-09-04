/**
 * Suppresses the Three.js r183+ deprecation warning for THREE.Clock
 * ("THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.")
 *
 * In Next.js / ESM environments, namespace imports like `import * as THREE from 'three'`
 * are immutable objects with getter-only exports, so assigning to `THREE.Clock` throws
 * a TypeError. This patch safely intercepts the deprecation console.warn message while
 * leaving all Three.js functionality intact.
 */
import * as THREE from "three";

if (typeof window !== "undefined") {
  // Intercept the specific deprecation message from Three.js Clock
  const originalWarn = console.warn;
  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Clock: This module has been deprecated")
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };

  // Safely attempt to define property only if configurable
  try {
    const descriptor = Object.getOwnPropertyDescriptor(THREE, "Clock");
    if (descriptor && descriptor.configurable) {
      if ((THREE as any).Timer) {
        Object.defineProperty(THREE, "Clock", {
          value: (THREE as any).Timer,
          configurable: true,
          writable: true,
        });
      }
    }
  } catch {
    // Silently ignore in immutable ESM environments
  }
}

export {};
