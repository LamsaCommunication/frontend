"use client";

import * as THREE from "three";
import * as React from "react";

/** 1x1 transparent pixel used as placeholder when no logo is loaded */
export const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

/**
 * Safely loads a texture without throwing Suspense errors if the file is missing (e.g. 404).
 * Falls back to TRANSPARENT_PIXEL on error.
 */
export function useSafeTexture(url: string | null | undefined): THREE.Texture {
  const defaultTexture = React.useMemo(() => {
    const tex = new THREE.TextureLoader().load(TRANSPARENT_PIXEL);
    tex.flipY = true;
    return tex;
  }, []);

  const [texture, setTexture] = React.useState<THREE.Texture>(defaultTexture);

  React.useEffect(() => {
    if (!url || url === TRANSPARENT_PIXEL) {
      setTexture(defaultTexture);
      return;
    }
    
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    
    loader.load(
      url,
      (loadedTex) => {
        if (isMounted) {
          loadedTex.flipY = true;
          setTexture(loadedTex);
        }
      },
      undefined,
      (err) => {
        console.warn(`[SafeTexture] Failed to load texture at ${url}:`, err);
        if (isMounted) setTexture(defaultTexture);
      }
    );

    return () => {
      isMounted = false;
    };
  }, [url, defaultTexture]);

  return texture;
}

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
