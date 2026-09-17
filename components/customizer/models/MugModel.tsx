"use client";

import * as React from "react";
import * as THREE from "three";
import { Decal, useGLTF } from "@react-three/drei";
import type { ModelComponentProps } from "./types";
import { useDragHandler } from "../hooks/useDragHandler";
import {
  TRANSPARENT_PIXEL,
  getTextureAspect,
  createCeramicBodyMaterial,
  createCeramicHandleMaterial,
  createCeramicMaskedMaterial,
  useSafeTexture,
} from "../utils/texture-utils";

const MUG_GLB_PATH = "/models/mug/mug.glb";

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
  const rawLogoTexture = useSafeTexture(logoUrl);

  // Parse GLTF scene and normalize geometry for the custom shader
  const { geometry, shaderParams } = React.useMemo(() => {
    let sourceGeo: THREE.BufferGeometry | null = null;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        if (!sourceGeo) {
          sourceGeo = mesh.geometry.clone();
        } else if ((mesh.geometry.attributes.position?.count ?? 0) > (sourceGeo.attributes.position?.count ?? 0)) {
          sourceGeo = mesh.geometry.clone();
        }
      }
    });

    if (!sourceGeo) return { geometry: null, shaderParams: null };

    const geo = sourceGeo as THREE.BufferGeometry;

    geo.computeBoundingBox();
    let bbox = geo.boundingBox;
    if (!bbox) return { geometry: geo, shaderParams: null };

    // Find the actual cylinder center before translation (to pivot correctly)
    const radius = (bbox.max.z - bbox.min.z) / 2;
    const isHandlePlusX = Math.abs(bbox.max.x) > Math.abs(bbox.min.x);
    const centerX = isHandlePlusX ? bbox.min.x + radius : bbox.max.x - radius;
    const centerY = (bbox.max.y + bbox.min.y) / 2;
    const centerZ = (bbox.max.z + bbox.min.z) / 2;

    // Normalize Geometry: center the cylinder at (0,0,0) and scale to typical mug height (2.1)
    const height = bbox.max.y - bbox.min.y;
    const scale = height > 0 ? 2.1 / height : 1;

    geo.translate(-centerX, -centerY, -centerZ);
    geo.scale(scale, scale, scale);

    // Recompute normals and bounds after transformations
    geo.computeVertexNormals();
    geo.computeBoundingBox();
    bbox = geo.boundingBox!;
    // Now the cylinder is perfectly centered at X=0, Z=0
    const normalizedRadius = radius * scale;
    // Push the handle color boundary right to the surface of the cylinder body
    // so the handle is fully colored exactly to the joint, just like the reference.
    const handleDistThreshold = normalizedRadius * 1.01;

    return {
      geometry: geo,
      shaderParams: {
        handleDistThreshold,
        minY: bbox.min.y,
        maxY: bbox.max.y
      }
    };
  }, [scene]);

  // Unified Material with custom shader for masking
  const mugMaterial = React.useMemo(() => createCeramicMaskedMaterial(), []);

  React.useEffect(() => {
    return () => {
      mugMaterial.dispose();
    };
  }, [mugMaterial]);

  React.useEffect(() => {
    if (shaderParams) {
      mugMaterial.customUniforms.uHandleThreshold.value = shaderParams.handleDistThreshold;
      mugMaterial.customUniforms.uMinY.value = shaderParams.minY;
      mugMaterial.customUniforms.uMaxY.value = shaderParams.maxY;
    }
  }, [mugMaterial, shaderParams]);

  React.useEffect(() => {
    const color = baseColor === "#ffffff" ? "#fbf9f5" : baseColor;
    mugMaterial.customUniforms.uCustomColor.value.set(color);
  }, [mugMaterial, baseColor]);

  const handlers = useDragHandler(
    logoTransform,
    onTransformChange,
    setOrbitEnabled,
    isLocked,
    onLockedDragAttempt
  );

  // Fallback to procedural mug if GLB parsing yields no geometry
  if (!geometry) {
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
      {/* Unified Mug Mesh with Shader Masking */}
      <mesh
        geometry={geometry}
        material={mugMaterial}
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

  const rawLogoTexture = useSafeTexture(logoUrl);

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
