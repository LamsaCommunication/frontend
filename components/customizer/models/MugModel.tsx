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
  useSafeTexture,
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
  const rawLogoTexture = useSafeTexture(logoUrl);

  // Parse GLTF scene and dynamically split single mesh into body (outside) and colored parts (inside + handle)
  const { bodyGeometry, coloredGeometry } = React.useMemo(() => {
    let sourceGeo: THREE.BufferGeometry | null = null;

    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        if (!sourceGeo) {
           sourceGeo = mesh.geometry.clone();
        } else if ((mesh.geometry.attributes.position?.count ?? 0) > (sourceGeo.attributes.position?.count ?? 0)) {
           // Take the largest geometry if there are multiple
           sourceGeo = mesh.geometry.clone();
        }
      }
    });

    if (!sourceGeo) return { bodyGeometry: null, coloredGeometry: null };

    // Explicitly cast to help TypeScript since it loses track in the callback
    const geo = sourceGeo as THREE.BufferGeometry;

    geo.computeBoundingBox();
    let bbox = geo.boundingBox;
    if (!bbox) return { bodyGeometry: geo, coloredGeometry: null };

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

    const position = geo.attributes.position;
    const normal = geo.attributes.normal;
    const index = geo.index;

    if (!position || !normal || !index) {
        return { bodyGeometry: geo, coloredGeometry: null };
    }

    const idxArr = index.array;
    const outerIndices: number[] = [];
    const innerIndices: number[] = [];
    
    // Now the cylinder is perfectly centered at X=0, Z=0
    const normalizedRadius = radius * scale;
    const handleDistThreshold = normalizedRadius * 1.15;

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const nA = new THREE.Vector3();
    const nB = new THREE.Vector3();
    const nC = new THREE.Vector3();

    for (let i = 0; i < idxArr.length; i += 3) {
      const i0 = idxArr[i];
      const i1 = idxArr[i+1];
      const i2 = idxArr[i+2];

      vA.fromBufferAttribute(position, i0);
      vB.fromBufferAttribute(position, i1);
      vC.fromBufferAttribute(position, i2);

      nA.fromBufferAttribute(normal, i0);
      nB.fromBufferAttribute(normal, i1);
      nC.fromBufferAttribute(normal, i2);

      const cX = (vA.x + vB.x + vC.x) / 3;
      const cY = (vA.y + vB.y + vC.y) / 3;
      const cZ = (vA.z + vB.z + vC.z) / 3;

      const nx = (nA.x + nB.x + nC.x) / 3;
      const ny = (nA.y + nB.y + nC.y) / 3;
      const nz = (nA.z + nB.z + nC.z) / 3;

      // Distance from center (0,0)
      const dist = Math.sqrt(cX * cX + cZ * cZ);

      let isColored = false;

      // 1. Is it the handle? (Outside the main cylinder radius)
      if (dist > handleDistThreshold) {
        isColored = true;
      } else {
        // 2. Is it the inside of the cylinder?
        // Normal dot vector from center
        const dot = nx * cX + nz * cZ;
        
        // Inner wall (normal points towards center)
        if (dot < -0.01) {
            isColored = true;
        } 
        // Inner bottom (faces up, but lower half of the mug to avoid top rim issues)
        else if (ny > 0.8 && cY < bbox.min.y + (bbox.max.y - bbox.min.y) * 0.5) {
            isColored = true;
        }
      }

      if (isColored) {
        innerIndices.push(i0, i1, i2);
      } else {
        outerIndices.push(i0, i1, i2);
      }
    }

    const bGeo = geo.clone();
    bGeo.setIndex(outerIndices);
    bGeo.clearGroups();

    const cGeo = geo.clone();
    cGeo.setIndex(innerIndices);
    cGeo.clearGroups();

    return { bodyGeometry: bGeo, coloredGeometry: cGeo };
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

      {/* Handle and Inside mesh — user-selected color */}
      {coloredGeometry && (
        <mesh
          geometry={coloredGeometry}
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
