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

/**
 * A custom material that applies a mathematical mask in the fragment shader
 * to paint the handle and inside of a mug while keeping the outside white.
 */
export class MaskedCeramicMaterial extends THREE.MeshPhysicalMaterial {
  customUniforms: {
    uCustomColor: { value: THREE.Color };
    uHandleThreshold: { value: number };
    uMinY: { value: number };
    uMaxY: { value: number };
  };

  constructor(parameters?: THREE.MeshPhysicalMaterialParameters) {
    super(parameters);
    this.customUniforms = {
      uCustomColor: { value: new THREE.Color("#fbf9f5") },
      uHandleThreshold: { value: 0.0 },
      uMinY: { value: 0.0 },
      uMaxY: { value: 0.0 },
    };
  }

  onBeforeCompile(shader: any) {
    shader.uniforms.uCustomColor = this.customUniforms.uCustomColor;
    shader.uniforms.uHandleThreshold = this.customUniforms.uHandleThreshold;
    shader.uniforms.uMinY = this.customUniforms.uMinY;
    shader.uniforms.uMaxY = this.customUniforms.uMaxY;

    shader.vertexShader = `
      varying vec3 vLocalPos;
      varying vec3 vLocalNormal;
      ${shader.vertexShader}
    `.replace(
      `#include <begin_vertex>`,
      `#include <begin_vertex>
       vLocalPos = position;
       vLocalNormal = normal;
      `
    );

    shader.fragmentShader = `
      uniform vec3 uCustomColor;
      uniform float uHandleThreshold;
      uniform float uMinY;
      uniform float uMaxY;
      varying vec3 vLocalPos;
      varying vec3 vLocalNormal;
      ${shader.fragmentShader}
    `.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      `
      vec4 diffuseColor = vec4( diffuse, opacity );
      
      // Distance from cylinder center in XZ plane
      float dist = sqrt(vLocalPos.x * vLocalPos.x + vLocalPos.z * vLocalPos.z);
      
      // 1. Handle Mix
      // By using a threshold very close to the cylinder radius, the color will cover 
      // the handle completely down to the root joint.
      float handleMix = smoothstep(uHandleThreshold, uHandleThreshold + 0.03, dist);
      
      // 2. Inside Wall Mix
      // Normal pointing inward towards the Y axis
      float dotNormal = dot(vLocalNormal.xz, vLocalPos.xz);
      float insideMix = smoothstep(-0.01, -0.1, dotNormal);
      
      // 3. Top Rim Mix
      // Color the top rim exactly up to the outer lip.
      // The outer lip is where the normal transitions from pointing out (0) to pointing up (1).
      float isTopHeight = smoothstep(uMaxY - 0.1, uMaxY - 0.01, vLocalPos.y);
      float topRimMix = smoothstep(0.1, 0.4, vLocalNormal.y) * isTopHeight;
      
      // 4. Inner Bottom Mix
      // Inside floor of the mug
      float bottomHeightMix = smoothstep(uMinY + (uMaxY - uMinY) * 0.2, uMinY + (uMaxY - uMinY) * 0.1, vLocalPos.y);
      float bottomMix = smoothstep(0.8, 0.9, vLocalNormal.y) * bottomHeightMix;
      
      // Combine all color masks
      float finalColorMix = max(handleMix, max(insideMix, max(topRimMix, bottomMix)));
      
      // Mask out any artifacts that might accidentally trigger far outside the mug 
      // (though the handle mask already handles everything outside)
      
      diffuseColor.rgb = mix(diffuseColor.rgb, uCustomColor, finalColorMix);
      `
    );
  }
}

export function createCeramicMaskedMaterial(): MaskedCeramicMaterial {
  return new MaskedCeramicMaterial({
    color: new THREE.Color("#fbf9f5"),
    roughness: 0.05,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 1.0,
  });
}

