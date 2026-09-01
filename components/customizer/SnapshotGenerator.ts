import * as THREE from "three";

export class SnapshotGenerator {
  /**
   * Captures the current WebGL canvas render as a high-resolution data URL
   */
  public static capture(
    gl: THREE.WebGLRenderer | null,
    scene: THREE.Scene | null,
    camera: THREE.Camera | null,
    format: "image/webp" | "image/png" = "image/webp",
    quality = 0.92
  ): string | null {
    if (!gl || !scene || !camera) return null;

    try {
      // Force immediate render to ensure the buffer is freshly populated
      gl.render(scene, camera);
      return gl.domElement.toDataURL(format, quality);
    } catch (err) {
      console.error("Failed to capture 3D snapshot", err);
      return null;
    }
  }
}
