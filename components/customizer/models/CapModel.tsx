"use client";

import * as React from "react";
import * as THREE from "three";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import type { ModelComponentProps } from "./types";
import { useDragHandler } from "../hooks/useDragHandler";
import {
  TRANSPARENT_PIXEL,
  getTextureAspect,
  createFabricMaterial,
} from "../utils/texture-utils";

// ── Asset path ───────────────────────────────────────────────────────
const CAP_GLB_PATH = "/models/cap/cap.glb";

/**
 * CapModel — Loads the baseball cap as Draco-compressed GLB.
 *
 * Body: Receives the user-selected baseColor.
 * Stitches: Uses a slightly darker shade of the body color for contrast.
 * Logo decal is applied on the front panel of the cap.
 */
export function CapModel({
  baseColor,
  logoUrl,
  logoTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt,
}: ModelComponentProps) {
  const { scene } = useGLTF(CAP_GLB_PATH);
  const rawLogoTexture = useTexture(logoUrl || TRANSPARENT_PIXEL);

  React.useEffect(() => {
    rawLogoTexture.flipY = true;
    rawLogoTexture.needsUpdate = true;
  }, [rawLogoTexture]);

  // Parse GLTF scene into body and stitches geometries
  const { bodyGeometry, stitchesGeometry, bounds, scale } = React.useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        meshes.push(child as THREE.Mesh);
      }
    });

    if (meshes.length === 0) {
      return {
        bodyGeometry: null,
        stitchesGeometry: null,
        bounds: null,
        scale: [1, 1, 1] as [number, number, number],
      };
    }

    // Sort by vertex count: largest = body, smaller = stitches
    const sorted = [...meshes].sort((a, b) => {
      const aCount = a.geometry.attributes.position?.count ?? 0;
      const bCount = b.geometry.attributes.position?.count ?? 0;
      return bCount - aCount;
    });

    const bodyGeom = sorted[0].geometry.clone();
    bodyGeom.center();
    bodyGeom.computeVertexNormals();
    bodyGeom.computeBoundingBox();

    const box = bodyGeom.boundingBox!;
    const size = Math.max(
      box.max.x - box.min.x,
      box.max.y - box.min.y,
      box.max.z - box.min.z
    );
    const targetScale = 2.0 / size;

    let stitchesGeom: THREE.BufferGeometry | null = null;
    if (sorted.length >= 2) {
      stitchesGeom = sorted[1].geometry.clone();
      stitchesGeom.center();
      stitchesGeom.computeVertexNormals();
    }

    return {
      bodyGeometry: bodyGeom,
      stitchesGeometry: stitchesGeom,
      bounds: box,
      scale: [targetScale, targetScale, targetScale] as [number, number, number],
    };
  }, [scene]);

  // Body material — user-selected color
  const resolvedColor = baseColor === "#ffffff" ? "#fbf9f5" : baseColor;
  const bodyMaterial = React.useMemo(() => createFabricMaterial(resolvedColor), [resolvedColor]);

  // Stitches material — slightly darker shade for visible contrast
  const stitchesMaterial = React.useMemo(() => {
    const color = new THREE.Color(resolvedColor);
    color.multiplyScalar(0.7); // 30% darker
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.85,
      metalness: 0.02,
    });
  }, [resolvedColor]);

  React.useEffect(() => {
    return () => {
      bodyMaterial.dispose();
      stitchesMaterial.dispose();
    };
  }, [bodyMaterial, stitchesMaterial]);

  const handlers = useDragHandler(
    logoTransform,
    onTransformChange,
    setOrbitEnabled,
    isLocked,
    onLockedDragAttempt
  );

  if (!bodyGeometry || !bounds) return null;

  const tScale = logoTransform?.scale ?? 1;
  const aspect = getTextureAspect(rawLogoTexture);

  // Map offsetX to 360° rotation angle around the cap dome (identical to MugModel structure).
  // At offsetX = 0, theta = 0 => Front center forehead.
  // Positive theta => Right side panels / ear.
  // Negative theta => Left side panels / ear.
  // theta = ±PI => Back panels. No limits!
  const theta = (logoTransform?.offsetX ?? 0) * 0.004;
  const offsetY = (logoTransform?.offsetY ?? 0) * -0.25;

  const baseSize = 85;
  const decalScale = [
    baseSize * aspect * tScale,
    baseSize * tScale,
    70, // 70 units depth projects cleanly into the fabric at any angle around the dome
  ] as [number, number, number];

  // Forehead center height is ~42 in local cap coordinates
  const posY = 42 + offsetY;

  // Crown dome profile: radius narrows as height ascends towards the top button
  const domeFactor = Math.max(
    0.35,
    Math.cos(Math.min(Math.PI * 0.45, Math.max(0, (posY - 35) * 0.015)))
  );
  const rX = 145 * domeFactor;
  const rZ = 125 * domeFactor;

  // Center of the cap head cylinder is at Z ≈ -25
  const posX = Math.sin(theta) * rX;
  const posZ = -25 + Math.cos(theta) * rZ;

  // Surface normal rotation:
  // Decal rotates around Y by theta so it always faces directly normal to the surface (no stretching or clipping).
  // Backward tilt (pitch) matches the dome slope on the front and becomes upright on the sides.
  const pitch = (-0.52 - Math.max(0, (posY - 42) * 0.008)) * Math.cos(theta);
  const decalPosition = [posX, posY, posZ] as [number, number, number];
  const decalRotation = [pitch, theta, 0] as [number, number, number];

  return (
    <group position={[0, -0.2, 0]} scale={scale}>
      {/* Cap body — user color */}
      <mesh
        geometry={bodyGeometry}
        material={bodyMaterial}
        castShadow
        receiveShadow
      >
        {!!logoUrl && (
          <Decal
            position={decalPosition}
            rotation={decalRotation}
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

      {/* Stitches overlay */}
      {stitchesGeometry && (
        <mesh
          geometry={stitchesGeometry}
          material={stitchesMaterial}
          castShadow
          receiveShadow
        />
      )}
    </group>
  );
}

// Preload the GLB for faster initial render
useGLTF.preload(CAP_GLB_PATH);
