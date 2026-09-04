"use client";

import * as React from "react";
import * as THREE from "three";
import { Decal, useGLTF, useTexture } from "@react-three/drei";
import type { ModelComponentProps } from "./types";
import { useDragHandler } from "../hooks/useDragHandler";
import {
  TRANSPARENT_PIXEL,
  getTextureAspect,
  createCeramicBodyMaterial,
  createCeramicHandleMaterial,
} from "../utils/texture-utils";

// ── Asset path ───────────────────────────────────────────────────────
const MUG_GLB_PATH = "/models/mug/mug.glb";

/**
 * MugModel — Loads the mug GLB (Draco-compressed) with separate body and handle meshes.
 *
 * Body: Always white ceramic (regardless of color selection).
 * Handle: Receives the user-selected baseColor.
 * Logo/decal is applied only to the body mesh.
 */
export function MugModel({
  baseColor,
  logoUrl,
  logoTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt,
}: ModelComponentProps) {
  const { scene } = useGLTF(MUG_GLB_PATH);
  const rawLogoTexture = useTexture(logoUrl || TRANSPARENT_PIXEL);

  React.useEffect(() => {
    rawLogoTexture.flipY = true;
    rawLogoTexture.needsUpdate = true;
  }, [rawLogoTexture]);

  // Parse GLTF scene into separate body and handle geometries
  const { bodyGeometry, handleGeometry } = React.useMemo(() => {
    let bodyGeo: THREE.BufferGeometry | null = null;
    let handleGeo: THREE.BufferGeometry | null = null;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        const count = mesh.geometry.attributes.position?.count ?? 0;
        // Body has ~7,692 vertices (larger), Handle has ~3,309 vertices (smaller)
        if (count > 5000) {
          bodyGeo = mesh.geometry.clone();
        } else {
          handleGeo = mesh.geometry.clone();
        }
      }
    });

    const b = bodyGeo as THREE.BufferGeometry | null;
    const h = handleGeo as THREE.BufferGeometry | null;
    if (b) {
      b.computeVertexNormals();
    }
    if (h) {
      h.computeVertexNormals();
    }

    return { bodyGeometry: b, handleGeometry: h };
  }, [scene]);

  // Materials — body is always white, handle uses user color
  const bodyMaterial = React.useMemo(() => createCeramicBodyMaterial(), []);
  const handleMaterial = React.useMemo(
    () => createCeramicHandleMaterial(baseColor === "#ffffff" ? "#fbf9f5" : baseColor),
    [baseColor]
  );

  React.useEffect(() => {
    return () => {
      bodyMaterial.dispose();
      handleMaterial.dispose();
    };
  }, [bodyMaterial, handleMaterial]);

  const handlers = useDragHandler(
    logoTransform,
    onTransformChange,
    setOrbitEnabled,
    isLocked,
    onLockedDragAttempt
  );

  // Fallback to procedural mug if GLB parsing yields no geometry
  if (!bodyGeometry) {
    return (
      <ProceduralMug
        baseColor={baseColor}
        logoUrl={logoUrl}
        logoTransform={logoTransform}
        onTransformChange={onTransformChange}
        setOrbitEnabled={setOrbitEnabled}
        isLocked={isLocked}
        onLockedDragAttempt={onLockedDragAttempt}
      />
    );
  }

  const tScale = logoTransform?.scale ?? 1;
  const aspect = getTextureAspect(rawLogoTexture);

  // Map offsetX to rotation angle for 360° dragging around the mug
  // At offsetX = 0, theta = 0 => posX = 0, posZ = r (exact front-middle facing camera)
  const theta = (logoTransform?.offsetX ?? 0) * 0.003;
  const offsetY = (logoTransform?.offsetY ?? 0) * -0.002;

  // Decal depth covers outer curve without reaching inner back wall
  const decalScale = [1.1 * aspect * tScale, 1.1 * tScale, 0.8] as [number, number, number];

  const r = 0.84;
  const posX = Math.sin(theta) * r;
  const posZ = Math.cos(theta) * r;

  return (
    <group position={[0, -0.05, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* Body mesh — always white ceramic */}
      <mesh
        geometry={bodyGeometry}
        material={bodyMaterial}
        castShadow
        receiveShadow
      >
        {!!logoUrl && (
          <Decal
            position={[posX, offsetY, posZ]}
            rotation={[0, theta, 0]}
            scale={decalScale}
            {...handlers}
          >
            <meshPhysicalMaterial
              map={rawLogoTexture}
              transparent
              polygonOffset
              polygonOffsetFactor={-1}
              roughness={0.05}
              clearcoat={1.0}
              metalness={0.05}
              depthTest
              depthWrite={false}
              toneMapped={false}
            />
          </Decal>
        )}
      </mesh>

      {/* Handle mesh — user-selected color */}
      {handleGeometry && (
        <mesh
          geometry={handleGeometry}
          material={handleMaterial}
          castShadow
          receiveShadow
        />
      )}
    </group>
  );
}

// Preload the GLB for faster initial render
useGLTF.preload(MUG_GLB_PATH);

// ── Procedural Mug Fallback ──────────────────────────────────────────
/**
 * Procedural mug built from primitives — used as fallback during GLB loading
 * or if parsing fails. Handle uses user color, body stays white.
 */
function ProceduralMug({
  baseColor,
  logoUrl,
  logoTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt,
}: ModelComponentProps) {
  const bodyMat = React.useMemo(() => createCeramicBodyMaterial(), []);
  const handleMat = React.useMemo(
    () => createCeramicHandleMaterial(baseColor === "#ffffff" ? "#fbf9f5" : baseColor),
    [baseColor]
  );
  const innerMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.15,
        metalness: 0.02,
        clearcoat: 0.3,
      }),
    []
  );

  const rawLogoTexture = useTexture(logoUrl || TRANSPARENT_PIXEL);

  React.useEffect(() => {
    rawLogoTexture.flipY = true;
    rawLogoTexture.needsUpdate = true;
  }, [rawLogoTexture]);

  React.useEffect(() => {
    return () => {
      bodyMat.dispose();
      handleMat.dispose();
      innerMat.dispose();
    };
  }, [bodyMat, handleMat, innerMat]);

  const handlers = useDragHandler(
    logoTransform,
    onTransformChange,
    setOrbitEnabled,
    isLocked,
    onLockedDragAttempt
  );

  const tScale = logoTransform?.scale ?? 1;
  const aspect = getTextureAspect(rawLogoTexture);

  const theta = (logoTransform?.offsetX ?? 0) * 0.003;
  const offsetY = (logoTransform?.offsetY ?? 0) * -0.002;
  const decalScale = [1.2 * aspect * tScale, 1.2 * tScale, 1.0] as [number, number, number];

  const r = 0.95;
  const posX = Math.sin(theta) * r;
  const posZ = Math.cos(theta) * r;

  return (
    <group position={[0, -0.1, 0]}>
      {/* Body cylinder — white ceramic */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.0, 0.92, 2.1, 64, 1, false]} />
        <primitive object={bodyMat} attach="material" />

        {!!logoUrl && (
          <Decal
            position={[posX, offsetY, posZ]}
            rotation={[0, theta, 0]}
            scale={decalScale}
            {...handlers}
          >
            <meshPhysicalMaterial
              map={rawLogoTexture}
              transparent
              polygonOffset
              polygonOffsetFactor={-1}
              roughness={0.05}
              clearcoat={1.0}
              metalness={0.1}
              depthTest
              depthWrite={false}
              toneMapped={false}
            />
          </Decal>
        )}
      </mesh>

      {/* Bottom disk */}
      <mesh castShadow receiveShadow position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.08, 64]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* Inner wall */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.92, 0.85, 2.0, 64, 1, true]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* Rim torus */}
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.96, 0.04, 16, 64]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* Handle — user-selected color */}
      <mesh castShadow position={[-1.02, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.55, 0.12, 24, 48, Math.PI * 1.1]} />
        <primitive object={handleMat} attach="material" />
      </mesh>
    </group>
  );
}
