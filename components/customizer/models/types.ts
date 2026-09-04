"use client";

/** Supported 3D product model types */
export type Product3DType = "CUP" | "TSHIRT" | "CASQUET";

/** Logo/decal transform state for positioning on 3D surface */
export interface TextureTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

/** Default transform values */
export const DEFAULT_TRANSFORM: TextureTransform = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
};

/** Shared props interface for all 3D model components */
export interface ModelComponentProps {
  baseColor: string;
  logoUrl?: string | null;
  logoTransform?: TextureTransform;
  onTransformChange?: (updates: Partial<TextureTransform>) => void;
  setOrbitEnabled?: (enabled: boolean) => void;
  isLocked?: boolean;
  onLockedDragAttempt?: () => void;
}

/** Props for the main ProductModel dispatcher */
export interface ProductModelProps extends ModelComponentProps {
  modelType: string | Product3DType;
  isHovered?: boolean;
}
