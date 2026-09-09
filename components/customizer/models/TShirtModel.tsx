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
 * Supports dual logos (front and back) independently.
 */
export function TShirtModel({
  baseColor,
  logoUrl, // fallback
  logoTransform, // fallback
  frontLogoUrl,
  frontTransform,
  backLogoUrl,
  backTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt,
}: ModelComponentProps) {
  const { scene } = useGLTF(TSHIRT_GLB_PATH);
  
  // Resolve which URLs to use (fallback to single logoUrl if dual-sided not provided)
  const actualFrontUrl = frontLogoUrl !== undefined ? frontLogoUrl : (logoTransform?.side !== "BACK" ? logoUrl : null);
  const actualBackUrl = backLogoUrl !== undefined ? backLogoUrl : (logoTransform?.side === "BACK" ? logoUrl : null);
  
  const rawFrontTexture = useTexture(actualFrontUrl || TRANSPARENT_PIXEL);
  const rawBackTexture = useTexture(actualBackUrl || TRANSPARENT_PIXEL);

  React.useEffect(() => {
    rawFrontTexture.flipY = true;
    rawFrontTexture.needsUpdate = true;
    rawBackTexture.flipY = true;
    rawBackTexture.needsUpdate = true;
  }, [rawFrontTexture, rawBackTexture]);

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

  // Drag handlers for Front
  const frontHandlers = useDragHandler(
    frontTransform || (logoTransform?.side !== "BACK" ? logoTransform : undefined),
    (updates) => onTransformChange?.(updates, "FRONT"),
    setOrbitEnabled,
    isLocked,
    onLockedDragAttempt
  );

  // Drag handlers for Back
  const backHandlers = useDragHandler(
    backTransform || (logoTransform?.side === "BACK" ? logoTransform : undefined),
    (updates) => onTransformChange?.(updates, "BACK"),
    setOrbitEnabled,
    isLocked,
    onLockedDragAttempt
  );

  if (!geometry || !bounds) return null;

  const baseSize = (bounds.max.x - bounds.min.x) * 0.4;
  
  // Calculate Front Decal Transform
  const fTransform = frontTransform || (logoTransform?.side !== "BACK" ? logoTransform : undefined);
  const fScale = fTransform?.scale ?? 1;
  const fAspect = getTextureAspect(rawFrontTexture);
  const fOffsetX = (fTransform?.offsetX ?? 0) * 0.00055;
  const fOffsetY = (fTransform?.offsetY ?? 0) * -0.00055;
  
  const frontDecalScale = [
    baseSize * fAspect * fScale,
    baseSize * fScale,
    0.08,
  ] as [number, number, number];
  
  const frontDecalPosition: [number, number, number] = [
    fOffsetX,
    bounds.max.y * 0.2 + fOffsetY,
    0.05
  ];

  // Calculate Back Decal Transform
  const bTransform = backTransform || (logoTransform?.side === "BACK" ? logoTransform : undefined);
  const bScale = bTransform?.scale ?? 1;
  const bAspect = getTextureAspect(rawBackTexture);
  const bOffsetX = (bTransform?.offsetX ?? 0) * 0.00055;
  const bOffsetY = (bTransform?.offsetY ?? 0) * -0.00055;
  
  const backDecalScale = [
    baseSize * bAspect * bScale,
    baseSize * bScale,
    0.08,
  ] as [number, number, number];
  
  const backDecalPosition: [number, number, number] = [
    -bOffsetX, // Negate offsetX for correct left/right on back
    bounds.max.y * 0.2 + bOffsetY,
    -0.065
  ];

  return (
    <mesh
      geometry={geometry}
      material={fabricMaterial}
      castShadow
      receiveShadow
      position={[0, -0.15, 0]}
      scale={scale}
    >
      {!!actualFrontUrl && (
        <Decal
          position={frontDecalPosition}
          rotation={[0, 0, 0]}
          scale={frontDecalScale}
          {...frontHandlers}
        >
          <meshStandardMaterial
            map={rawFrontTexture}
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
      
      {!!actualBackUrl && (
        <Decal
          position={backDecalPosition}
          rotation={[0, Math.PI, 0]} // Face backwards
          scale={backDecalScale}
          {...backHandlers}
        >
          <meshStandardMaterial
            map={rawBackTexture}
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
