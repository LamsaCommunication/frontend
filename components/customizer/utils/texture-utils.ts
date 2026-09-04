"use client";

import * as THREE from "three";

/** 1x1 transparent pixel used as placeholder when no logo is loaded */
export const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

/**
 * Returns the width/height aspect ratio of a THREE.Texture's image source.
 * Falls back to 1 (square) if the image dimensions aren't available.
 */
export function getTextureAspect(texture: THREE.Texture): number {
  if (texture?.image) {
    const img = texture.image as { width?: number; height?: number };
    const w = img.width ?? 1;
    const h = img.height ?? 1;
    return w / h;
  }
  return 1;
}

/**
 * Creates a white ceramic MeshPhysicalMaterial (used for mug body).
 * The body of ceramic mugs is always white regardless of user color selection.
 */
export function createCeramicBodyMaterial(): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color("#fbf9f5"),
    roughness: 0.05,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
  });
}

/**
 * Creates a ceramic MeshPhysicalMaterial with the given color (used for mug handle).
 */
export function createCeramicHandleMaterial(color: string): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(color),
    roughness: 0.05,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
  });
}

/**
 * Creates a fabric MeshStandardMaterial for textile products (t-shirt, cap).
 */
export function createFabricMaterial(color: string): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    roughness: 0.95,
    metalness: 0.02,
  });
}
