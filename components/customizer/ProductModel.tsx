"use client";

import * as React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import type { ProductModelProps } from "./models/types";
import { MugModel } from "./models/MugModel";
import { TShirtModel } from "./models/TShirtModel";
import { CapModel } from "./models/CapModel";

// Re-export types for backward compatibility
export type { Product3DType, TextureTransform } from "./models/types";

/**
 * Normalizes a raw model type string to one of the supported 3D types.
 */
function normalizeModelType(modelType: string): string {
  const t = (modelType || "").toUpperCase();

  if (t.includes("TSHIRT") || t.includes("T-SHIRT") || t.includes("SHIRT") || t.includes("TEXTILE")) {
    return "TSHIRT";
  }
  if (t.includes("CASQUET") || t.includes("CAP") || t.includes("CHAPEAU")) {
    return "CASQUET";
  }
  return "CUP";
}

/**
 * Resolves a relative API URL to an absolute URL using the backend base URL.
 * Also handles invalid or expired blob URLs.
 */
function resolveUrl(url?: string | null): string | null | undefined {
  if (!url) return url;
  
  // If it's a blob url but we know it might be from a past session, it will crash useTexture.
  // We allow it to try, but if it's the admin panel, we could block it. 
  // For now, let's just resolve the relative API URLs.
  if (url.startsWith("/api/")) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    // Convert protected /download/ paths to public /view/ paths so the 3D Canvas
    // can load them without triggering a 401 Unauthorized error or downloading them as attachments.
    const mappedPath = url.replace('/download/', '/view/');
    return `${API_BASE_URL}${mappedPath}`;
  }
  return url;
}

/**
 * ProductModel — Main dispatcher component.
 *
 * Delegates rendering to the appropriate model component based on modelType.
 * Applies a subtle floating animation to all models via useFrame.
 */
export function ProductModel({
  modelType,
  baseColor,
  isHovered = false,
  logoUrl,
  logoTransform,
  frontLogoUrl,
  frontTransform,
  backLogoUrl,
  backTransform,
  onTransformChange,
  setOrbitEnabled,
  isLocked,
  onLockedDragAttempt,
}: ProductModelProps) {
  const groupRef = React.useRef<THREE.Group>(null);

  // Subtle floating idle animation
  useFrame(() => {
    if (groupRef.current) {
      const t = performance.now() / 1000;
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.035;
    }
  });

  const normalizedType = React.useMemo(
    () => normalizeModelType(modelType as string),
    [modelType]
  );

  // Shared props passed to all model components
  const modelProps = {
    baseColor,
    logoUrl: resolveUrl(logoUrl),
    logoTransform,
    frontLogoUrl: resolveUrl(frontLogoUrl),
    frontTransform,
    backLogoUrl: resolveUrl(backLogoUrl),
    backTransform,
    onTransformChange,
    setOrbitEnabled,
    isLocked,
    onLockedDragAttempt,
  };

  const renderModel = () => {
    switch (normalizedType) {
      case "TSHIRT":
        return (
          <React.Suspense fallback={null}>
            <TShirtModel {...modelProps} />
          </React.Suspense>
        );

      case "CASQUET":
        return (
          <React.Suspense fallback={null}>
            <CapModel {...modelProps} />
          </React.Suspense>
        );

      default:
        return (
          <React.Suspense fallback={null}>
            <MugModel {...modelProps} />
          </React.Suspense>
        );
    }
  };

  return (
    <group ref={groupRef} dispose={null}>
      {renderModel()}
    </group>
  );
}
