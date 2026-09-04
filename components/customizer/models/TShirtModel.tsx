"use client";

import * as React from "react";
import * as THREE from "three";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import type { ModelComponentProps } from "./types";
import { useDragHandler } from "../hooks/useDragHandler";
import { TRANSPARENT_PIXEL, getTextureAspect } from "../utils/texture-utils";

// ── Asset path ───────────────────────────────────────────────────────
const TSHIRT_GLB_PATH = "/models/tshirt/tshirt.glb";

/**
 * TShirtModel — Loads the CLO-exported t-shirt as Draco-compressed GLB.
 *
 * All fabric surfaces are tinted with the user's baseColor.
 * Logo decal is applied on the front chest area.
 */
export function TShirtModel({
  baseColor,
  logoUrl,
  logoTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt,
}: ModelComponentProps) {
  const { scene } = useGLTF(TSHIRT_GLB_PATH);
  const rawLogoTexture = useTexture(logoUrl || TRANSPARENT_PIXEL);

  React.useEffect(() => {
    rawLogoTexture.flipY = true;
    rawLogoTexture.needsUpdate = true;
  }, [rawLogoTexture]);

  // Process GLTF scene: extract primary geometry and compute bounds
  const { geometry, scale, bounds } = React.useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh);
      }
    });

    if (meshes.length === 0) {
      return { geometry: null, scale: [1, 1, 1] as [number, number, number], bounds: null };
    }

    // Use the mesh with the most vertices as the primary geometry
    const sorted = [...meshes].sort((a, b) => {
      const aCount = a.geometry.attributes.position?.count ?? 0;
      const bCount = b.geometry.attributes.position?.count ?? 0;
      return bCount - aCount;
    });

    const geom = sorted[0].geometry.clone();
    geom.center();
    geom.computeVertexNormals();
    geom.computeBoundingBox();

    const box = geom.boundingBox!;
    const height = box.max.y - box.min.y;
    const targetScale = 2.3 / height;

    return {
      geometry: geom,
      scale: [targetScale, targetScale, targetScale] as [number, number, number],
      bounds: box,
    };
  }, [scene]);

  // Apply user color to the t-shirt fabric
  const fabricMaterial = React.useMemo(() => {
    const resolvedColor = baseColor === "#ffffff" ? "#fbf9f5" : baseColor;
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(resolvedColor),
      roughness: 0.92,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
  }, [baseColor]);

  React.useEffect(() => {
    return () => {
      fabricMaterial.dispose();
    };
  }, [fabricMaterial]);

  const handlers = useDragHandler(
    logoTransform,
    onTransformChange,
    setOrbitEnabled,
    isLocked,
    onLockedDragAttempt
  );

  if (!geometry || !bounds) return null;

  const tScale = logoTransform?.scale ?? 1;
  const aspect = getTextureAspect(rawLogoTexture);

  const offsetX = (logoTransform?.offsetX ?? 0) * 0.00055;
  const offsetY = (logoTransform?.offsetY ?? 0) * -0.00055;

  const baseSize = (bounds.max.x - bounds.min.x) * 0.4;
  // Depth of 0.08 spans [0.010, 0.090] which envelops all curved front chest fabric (Z in [0.020, 0.060]),
  // while remaining >0.065 units away from back fabric (Z <= -0.058).
  // This completely eliminates decal projection on the back of the t-shirt.
  const decalScale = [
    baseSize * aspect * tScale,
    baseSize * tScale,
    0.08,
  ] as [number, number, number];

  return (
    <mesh
      geometry={geometry}
      material={fabricMaterial}
      castShadow
      receiveShadow
      position={[0, -0.15, 0]}
      scale={scale}
    >
      {!!logoUrl && (
        <Decal
          position={[offsetX, bounds.max.y * 0.2 + offsetY, 0.05]}
          rotation={[0, 0, 0]}
          scale={decalScale}
          {...handlers}
        >
          <meshStandardMaterial
            map={rawLogoTexture}
            transparent
            depthTest
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            roughness={0.9}
            toneMapped={false}
          />
        </Decal>
      )}
    </mesh>
  );
}

// Preload the GLB for faster initial render
useGLTF.preload(TSHIRT_GLB_PATH);
