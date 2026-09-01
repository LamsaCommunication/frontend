"use client";

import * as React from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { ProductModel, Product3DType, TextureTransform } from "./ProductModel";

interface Scene3DProps {
  modelType: string | Product3DType;
  baseColor: string;
  onCanvasReady?: (gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void;
  controlsRef?: React.RefObject<OrbitControlsImpl | null>;
  logoUrl?: string | null;
  logoTransform?: TextureTransform;
  onTransformChange?: (updates: Partial<TextureTransform>) => void;
  orbitEnabled?: boolean;
  setOrbitEnabled?: (enabled: boolean) => void;
  isLocked?: boolean;
  onLockedDragAttempt?: () => void;
}

function SceneContent({
  modelType,
  baseColor,
  onCanvasReady,
  controlsRef,
  logoUrl,
  logoTransform,
  onTransformChange,
  orbitEnabled = true,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt
}: Scene3DProps) {
  const { gl, scene, camera } = useThree();
  const localControlsRef = React.useRef<OrbitControlsImpl | null>(null);
  const activeControlsRef = controlsRef || localControlsRef;

  React.useEffect(() => {
    if (onCanvasReady) {
      onCanvasReady(gl, scene, camera);
    }
  }, [gl, scene, camera, onCanvasReady]);

  return (
    <>
      {/* ── Studio Lighting Rig & Environment ──────────────────────── */}
      <Environment preset="studio" environmentIntensity={0.8} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize={1024}
        shadow-bias={-0.0001}
      />

      {/* ── Procedural & OBJ Product Mesh with Drei Decals ─────────── */}
      <ProductModel 
        modelType={modelType} 
        baseColor={baseColor} 
        logoUrl={logoUrl}
        logoTransform={logoTransform}
        onTransformChange={onTransformChange}
        setOrbitEnabled={setOrbitEnabled}
        isLocked={isLocked}
        onLockedDragAttempt={onLockedDragAttempt}
      />

      {/* ── Contact Shadows (Soft Blurred Drop Shadow) ─────────────── */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.6}
        scale={10}
        blur={2.5}
        far={4}
        color="#000000"
      />

      {/* ── Smooth Orbit Controls ──────────────────────────────────── */}
      <OrbitControls
        ref={activeControlsRef}
        enabled={orbitEnabled}
        enableZoom={true}
        minDistance={2.0}
        maxDistance={8.0}
        maxPolarAngle={Math.PI / 2 + 0.12}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  );
}

export function Scene3D(props: Scene3DProps) {
  return (
    <div className="relative h-full w-full select-none overflow-hidden touch-none">
      <Canvas
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0
        }}
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
      >
        <React.Suspense fallback={null}>
          <SceneContent {...props} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
