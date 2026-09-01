"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { Decal, useTexture } from "@react-three/drei";
import { OBJLoader } from "three-stdlib";

export type Product3DType = "CUP" | "TSHIRT" | "CASQUET" | "box" | "card" | "neon";

export interface TextureTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

interface ProductModelProps {
  modelType: string | Product3DType;
  baseColor: string;
  isHovered?: boolean;
  logoUrl?: string | null;
  logoTransform?: TextureTransform;
  onTransformChange?: (updates: Partial<TextureTransform>) => void;
  setOrbitEnabled?: (enabled: boolean) => void;
  isLocked?: boolean;
  onLockedDragAttempt?: () => void;
}

const TRANSPARENT_PIXEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

function useDragHandler(
  transform: TextureTransform | undefined,
  onChange: ((updates: Partial<TextureTransform>) => void) | undefined,
  setOrbit: ((enabled: boolean) => void) | undefined,
  isLocked: boolean | undefined,
  onLockedDragAttempt: (() => void) | undefined
) {
  const [isDragging, setIsDragging] = React.useState(false);
  const startPos = React.useRef({ x: 0, y: 0 });
  const startOffset = React.useRef({ x: 0, y: 0 });

  const onPointerDown = (e: any) => {
    e.stopPropagation();
    if (isLocked) {
      if (onLockedDragAttempt) onLockedDragAttempt();
      return;
    }
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { x: transform?.offsetX || 0, y: transform?.offsetY || 0 };
    if (setOrbit) setOrbit(false);

    document.body.style.cursor = "grabbing";
  };

  const onPointerMove = (e: any) => {
    if (isDragging && onChange) {
      e.stopPropagation();
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      const sensitivity = 1.2;

      onChange({
        offsetX: startOffset.current.x + deltaX * sensitivity,
        offsetY: startOffset.current.y + deltaY * sensitivity
      });
    }
  };

  const onPointerUp = (e: any) => {
    if (isDragging) {
      e.stopPropagation();
      setIsDragging(false);
      if (setOrbit) setOrbit(true);
      document.body.style.cursor = "auto";
    }
  };

  const onPointerOut = (e: any) => {
    if (isDragging) {
      setIsDragging(false);
      if (setOrbit) setOrbit(true);
      document.body.style.cursor = "auto";
    }
  };

  return { onPointerDown, onPointerMove, onPointerUp, onPointerOut, isDragging };
}

function getTextureAspect(texture: THREE.Texture): number {
  if (texture && texture.image) {
    const img = texture.image as any;
    const w = img.width || 1;
    const h = img.height || 1;
    return w / h;
  }
  return 1;
}

// ── 1. Loaded OBJ Mug Component ───────────────────────────────────
function LoadedObjMug({
  ceramicMaterial,
  logoUrl,
  logoTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt
}: {
  ceramicMaterial: THREE.Material;
  logoUrl?: string | null;
  logoTransform?: TextureTransform;
  onTransformChange?: (updates: Partial<TextureTransform>) => void;
  setOrbitEnabled?: (enabled: boolean) => void;
  isLocked?: boolean;
  onLockedDragAttempt?: () => void;
}) {
  const obj = useLoader(OBJLoader, "/MUGS.obj");
  const rawLogoTexture = useTexture(logoUrl || TRANSPARENT_PIXEL);

  React.useEffect(() => {
    rawLogoTexture.flipY = true;
    rawLogoTexture.needsUpdate = true;
  }, [rawLogoTexture]);

  const mugGeometry = React.useMemo(() => {
    let mainMesh: THREE.Mesh | null = null;
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && (child.name === "Mug" || !mainMesh)) {
        mainMesh = child as THREE.Mesh;
      }
    });

    if (mainMesh) {
      const geom = (mainMesh as THREE.Mesh).geometry.clone();
      geom.center();
      geom.computeVertexNormals();
      return geom;
    }
    return null;
  }, [obj]);

  const handlers = useDragHandler(logoTransform, onTransformChange, setOrbitEnabled, isLocked, onLockedDragAttempt);

  if (!mugGeometry) {
    return <ProceduralMug
      ceramicMaterial={ceramicMaterial}
      logoUrl={logoUrl}
      logoTransform={logoTransform}
      onTransformChange={onTransformChange}
      setOrbitEnabled={setOrbitEnabled}
      isLocked={isLocked}
      onLockedDragAttempt={onLockedDragAttempt}
    />;
  }

  const tScale = logoTransform?.scale || 1;
  const aspect = getTextureAspect(rawLogoTexture);

  // Map offsetX to a rotation angle for 360 dragging
  const theta = (logoTransform?.offsetX || 0) * 0.003;
  const offsetY = (logoTransform?.offsetY || 0) * -0.002;

  // Depth 1.0 covers the outer curve but doesn't reach the inner back wall
  const decalScale = [1.2 * aspect * tScale, 1.2 * tScale, 1.0] as [number, number, number];

  const r = 0.95;
  const posX = Math.sin(theta) * r;
  const posZ = Math.cos(theta) * r;

  return (
    <mesh
      geometry={mugGeometry}
      material={ceramicMaterial}
      castShadow
      receiveShadow
      position={[0, 0, 0]}
      scale={[1.1, 1.1, 1.1]}
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
            transparent={true}
            polygonOffset
            polygonOffsetFactor={-1}
            roughness={0.05}
            clearcoat={1.0}
            metalness={0.1}
            depthTest={true}
            depthWrite={false}
            toneMapped={false}
          />
        </Decal>
      )}
    </mesh>
  );
}

// ── 2. Procedural Mug (Fallback during load or offline) ────────────
function ProceduralMug({
  ceramicMaterial,
  logoUrl,
  logoTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt
}: {
  ceramicMaterial: THREE.Material;
  logoUrl?: string | null;
  logoTransform?: TextureTransform;
  onTransformChange?: (updates: Partial<TextureTransform>) => void;
  setOrbitEnabled?: (enabled: boolean) => void;
  isLocked?: boolean;
  onLockedDragAttempt?: () => void;
}) {
  const innerMat = React.useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.15,
      metalness: 0.02,
      clearcoat: 0.3
    });
  }, []);

  const rawLogoTexture = useTexture(logoUrl || TRANSPARENT_PIXEL);

  React.useEffect(() => {
    rawLogoTexture.flipY = true;
    rawLogoTexture.needsUpdate = true;
  }, [rawLogoTexture]);

  const handlers = useDragHandler(logoTransform, onTransformChange, setOrbitEnabled, isLocked, onLockedDragAttempt);

  const tScale = logoTransform?.scale || 1;
  const aspect = getTextureAspect(rawLogoTexture);

  const theta = (logoTransform?.offsetX || 0) * 0.003;
  const offsetY = (logoTransform?.offsetY || 0) * -0.002;

  // Depth 1.0 covers the outer curve but doesn't reach the inner back wall
  const decalScale = [1.2 * aspect * tScale, 1.2 * tScale, 1.0] as [number, number, number];

  const r = 0.95;
  const posX = Math.sin(theta) * r;
  const posZ = Math.cos(theta) * r;

  return (
    <group position={[0, -0.1, 0]}>
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.0, 0.92, 2.1, 64, 1, false]} />
        <primitive object={ceramicMaterial} attach="material" />

        {!!logoUrl && (
          <Decal
            position={[posX, offsetY, posZ]}
            rotation={[0, theta, 0]}
            scale={decalScale}
            {...handlers}
          >
            <meshPhysicalMaterial
              map={rawLogoTexture}
              transparent={true}
              polygonOffset
              polygonOffsetFactor={-1}
              roughness={0.05}
              clearcoat={1.0}
              metalness={0.1}
              depthTest={true}
              depthWrite={false}
              toneMapped={false}
            />
          </Decal>
        )}
      </mesh>

      {/* Mug physical details */}
      <mesh castShadow receiveShadow position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.92, 0.92, 0.08, 64]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.92, 0.85, 2.0, 64, 1, true]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      <mesh position={[0, 1.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.96, 0.04, 16, 64]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      <mesh castShadow position={[-1.02, 0.0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.55, 0.12, 24, 48, Math.PI * 1.1]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
    </group>
  );
}

// ── 1.5. Loaded OBJ T-Shirt Component ─────────────────────────────
function LoadedObjTShirt({
  baseColor,
  logoUrl,
  logoTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt
}: {
  baseColor: string;
  logoUrl?: string | null;
  logoTransform?: TextureTransform;
  onTransformChange?: (updates: Partial<TextureTransform>) => void;
  setOrbitEnabled?: (enabled: boolean) => void;
  isLocked?: boolean;
  onLockedDragAttempt?: () => void;
}) {
  const obj = useLoader(OBJLoader, "/Low_T-shirt.obj");
  const textures = useTexture({
    map: "/TEXTURES/body/base color.png",
    normalMap: "/TEXTURES/body/normal.png",
    roughnessMap: "/TEXTURES/body/rougness.png",
    metalnessMap: "/TEXTURES/body/metallic.png",
    displacementMap: "/TEXTURES/body/height.png"
  });

  const rawLogoTexture = useTexture(logoUrl || TRANSPARENT_PIXEL);

  React.useEffect(() => {
    rawLogoTexture.flipY = true;
    rawLogoTexture.needsUpdate = true;
  }, [rawLogoTexture]);

  const material = React.useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      map: textures.map,
      normalMap: textures.normalMap,
      roughnessMap: textures.roughnessMap,
      metalnessMap: textures.metalnessMap,
      displacementMap: textures.displacementMap,
      displacementScale: 0.02,
      roughness: 0.95,
      metalness: 0.02
    });
  }, [baseColor, textures]);

  const { geometry, scale, bounds } = React.useMemo(() => {
    let mainMesh: THREE.Mesh | null = null;
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !mainMesh) {
        mainMesh = child as THREE.Mesh;
      }
    });

    if (mainMesh) {
      const geom = (mainMesh as THREE.Mesh).geometry.clone();
      geom.center();
      geom.computeVertexNormals();
      geom.computeBoundingBox();
      const box = geom.boundingBox!;
      const height = box.max.y - box.min.y;
      const targetScale = 2.3 / height;
      return { geometry: geom, scale: [targetScale, targetScale, targetScale] as [number, number, number], bounds: box };
    }
    return { geometry: null, scale: [1, 1, 1] as [number, number, number], bounds: null };
  }, [obj]);

  const handlers = useDragHandler(logoTransform, onTransformChange, setOrbitEnabled, isLocked, onLockedDragAttempt);

  React.useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  if (!geometry || !bounds) return null;

  const tScale = logoTransform?.scale || 1;
  const aspect = getTextureAspect(rawLogoTexture);

  const offsetX = (logoTransform?.offsetX || 0) * 0.002;
  const offsetY = (logoTransform?.offsetY || 0) * -0.002;

  const baseSize = (bounds.max.x - bounds.min.x) * 0.4;

  const decalScale = [
    baseSize * aspect * tScale,
    baseSize * tScale,
    0.8
  ] as [number, number, number];

  return (
    <mesh
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
      position={[0, -0.15, 0]}
      scale={scale}
    >
      {!!logoUrl && (
        <Decal
          position={[offsetX, bounds.max.y * 0.2 + offsetY, bounds.max.z]}
          rotation={[0, 0, 0]}
          scale={decalScale}
          {...handlers}
        >
          <meshStandardMaterial
            map={rawLogoTexture}
            transparent={true}
            depthTest={true}
            depthWrite={false}
            polygonOffset={true}
            polygonOffsetFactor={-1}
            roughness={0.9}
            toneMapped={false}
          />
        </Decal>
      )}
    </mesh>
  );
}

// ── 1.6. Loaded OBJ Cap Component ─────────────────────────────────
function LoadedObjCap({
  baseColor,
  logoUrl,
  logoTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt
}: {
  baseColor: string;
  logoUrl?: string | null;
  logoTransform?: TextureTransform;
  onTransformChange?: (updates: Partial<TextureTransform>) => void;
  setOrbitEnabled?: (enabled: boolean) => void;
  isLocked?: boolean;
  onLockedDragAttempt?: () => void;
}) {
  const obj = useLoader(OBJLoader, "/obj+BASE+BALL+CAP.obj");
  const rawLogoTexture = useTexture(logoUrl || TRANSPARENT_PIXEL);

  React.useEffect(() => {
    rawLogoTexture.flipY = true;
    rawLogoTexture.needsUpdate = true;
  }, [rawLogoTexture]);

  const material = React.useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(baseColor),
      roughness: 0.95,
      metalness: 0.02
    });
  }, [baseColor]);

  const { geometry, scale, bounds } = React.useMemo(() => {
    let mainMesh: THREE.Mesh | null = null;
    obj.traverse((child) => {
      if ((child as THREE.Mesh).isMesh && !mainMesh) {
        mainMesh = child as THREE.Mesh;
      }
    });

    if (mainMesh) {
      const geom = (mainMesh as THREE.Mesh).geometry.clone();
      geom.center();
      geom.computeVertexNormals();
      geom.computeBoundingBox();
      const box = geom.boundingBox!;
      const size = Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z);
      const targetScale = 2.0 / size;
      return { geometry: geom, scale: [targetScale, targetScale, targetScale] as [number, number, number], bounds: box };
    }
    return { geometry: null, scale: [1, 1, 1] as [number, number, number], bounds: null };
  }, [obj]);

  const handlers = useDragHandler(logoTransform, onTransformChange, setOrbitEnabled, isLocked, onLockedDragAttempt);

  React.useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  if (!geometry || !bounds) return null;

  const tScale = logoTransform?.scale || 1;
  const aspect = getTextureAspect(rawLogoTexture);

  const offsetX = (logoTransform?.offsetX || 0) * 0.002;
  const offsetY = (logoTransform?.offsetY || 0) * -0.002;

  const baseSize = (bounds.max.x - bounds.min.x) * 0.4;

  const decalScale = [
    baseSize * aspect * tScale,
    baseSize * tScale,
    0.8
  ] as [number, number, number];

  return (
    <mesh
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
      position={[0, -0.2, 0]}
      scale={scale}
    >
      {!!logoUrl && (
        <Decal
          position={[offsetX, bounds.max.y * 0.3 + offsetY, bounds.max.z]}
          rotation={[-0.2, 0, 0]}
          scale={decalScale}
          {...handlers}
        >
          <meshStandardMaterial
            map={rawLogoTexture}
            transparent={true}
            depthTest={true}
            depthWrite={false}
            polygonOffset={true}
            polygonOffsetFactor={-1}
            roughness={0.9}
            toneMapped={false}
          />
        </Decal>
      )}
    </mesh>
  );
}

// ── 3. Main ProductModel Dispatcher ────────────────────────────────
export function ProductModel({
  modelType,
  baseColor,
  isHovered = false,
  logoUrl,
  logoTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt
}: ProductModelProps) {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      const t = performance.now() / 1000;
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.035;
    }
  });

  const normalizedType = React.useMemo(() => {
    const t = (modelType || "").toUpperCase();
    if (t.includes("TSHIRT") || t.includes("T-SHIRT") || t.includes("SHIRT") || t.includes("TEXTILE")) {
      return "TSHIRT";
    }
    if (t.includes("CASQUET") || t.includes("CAP") || t.includes("CHAPEAU")) {
      return "CASQUET";
    }
    if (t.includes("BOX") || t.includes("PACKAGING")) {
      return "BOX";
    }
    if (t.includes("NEON") || t.includes("LED")) {
      return "NEON";
    }
    if (t.includes("CARD") || t.includes("CARTE")) {
      return "CARD";
    }
    return "CUP";
  }, [modelType]);

  const resolvedColor = React.useMemo(() => {
    const hex = baseColor?.toLowerCase() || "#ffffff";
    if (hex === "#ffffff") return "#fbf9f5";
    return baseColor;
  }, [baseColor]);

  const ceramicMaterial = React.useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(resolvedColor),
      roughness: 0.05,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      reflectivity: 1.0
    });
  }, [resolvedColor]);

  React.useEffect(() => {
    return () => {
      ceramicMaterial.dispose();
    };
  }, [ceramicMaterial]);

  if (normalizedType === "TSHIRT") {
    return (
      <group ref={groupRef} dispose={null}>
        <React.Suspense fallback={null}>
          <LoadedObjTShirt
            baseColor={resolvedColor}
            logoUrl={logoUrl}
            logoTransform={logoTransform}
            onTransformChange={onTransformChange}
            setOrbitEnabled={setOrbitEnabled}
            isLocked={isLocked}
            onLockedDragAttempt={onLockedDragAttempt}
          />
        </React.Suspense>
      </group>
    );
  }

  if (normalizedType === "CASQUET") {
    return (
      <group ref={groupRef} dispose={null}>
        <React.Suspense fallback={null}>
          <LoadedObjCap
            baseColor={resolvedColor}
            logoUrl={logoUrl}
            logoTransform={logoTransform}
            onTransformChange={onTransformChange}
            setOrbitEnabled={setOrbitEnabled}
            isLocked={isLocked}
            onLockedDragAttempt={onLockedDragAttempt}
          />
        </React.Suspense>
      </group>
    );
  }

  // Fallback for Box/Neon (basic rendering)
  if (normalizedType === "BOX") {
    return (
      <group ref={groupRef} dispose={null}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[2.0, 1.5, 2.0]} />
          <primitive object={ceramicMaterial} attach="material" />
        </mesh>
      </group>
    );
  }

  if (normalizedType === "NEON") {
    return (
      <group ref={groupRef} dispose={null}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[2.6, 1.6, 0.08]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transmission={0.92}
            opacity={1}
            transparent={true}
            roughness={0.08}
            ior={1.49}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef} dispose={null}>
      <React.Suspense
        fallback={
          <ProceduralMug
            ceramicMaterial={ceramicMaterial}
            logoUrl={logoUrl}
            logoTransform={logoTransform}
            onTransformChange={onTransformChange}
            setOrbitEnabled={setOrbitEnabled}
            isLocked={isLocked}
            onLockedDragAttempt={onLockedDragAttempt}
          />
        }
      >
        <LoadedObjMug
          ceramicMaterial={ceramicMaterial}
          logoUrl={logoUrl}
          logoTransform={logoTransform}
          onTransformChange={onTransformChange}
          setOrbitEnabled={setOrbitEnabled}
          isLocked={isLocked}
          onLockedDragAttempt={onLockedDragAttempt}
        />
      </React.Suspense>
    </group>
  );
}
