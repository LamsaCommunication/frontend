"use client";

import * as React from "react";
import * as THREE from "three";
import { RotateCw, ZoomIn, ZoomOut, Sparkles, Layers, RefreshCw } from "lucide-react";
import { Product3DModelType } from "@/lib/store/useCatalogStore";

interface Product3DCanvasProps {
  modelType: Product3DModelType | string;
  rectoArtworkUrl: string | null;
  versoArtworkUrl: string | null;
  customText?: string;
  activeFace: "recto" | "verso";
  onToggleFace: () => void;
  onCaptureSnapshot?: (dataUrl: string) => void;
}

export function Product3DCanvas({
  modelType,
  rectoArtworkUrl,
  versoArtworkUrl,
  customText,
  activeFace,
  onToggleFace,
  onCaptureSnapshot
}: Product3DCanvasProps) {
  const mountRef = React.useRef<HTMLDivElement>(null);
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = React.useRef<THREE.Scene | null>(null);
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null);
  const meshGroupRef = React.useRef<THREE.Group | null>(null);
  const targetRotationYRef = React.useRef<number>(0);
  const currentRotationYRef = React.useRef<number>(0);
  const isDraggingRef = React.useRef<boolean>(false);
  const previousMousePositionRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update target rotation when activeFace changes
  React.useEffect(() => {
    targetRotationYRef.current = activeFace === "recto" ? 0 : Math.PI;
  }, [activeFace]);

  // Helper to create texture from image URL or default placeholder
  const createFaceTexture = React.useCallback(
    (artworkUrl: string | null, label: string, isVerso = false) => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);

      // Clean background
      ctx.fillStyle = isVerso ? "#f4f4f4" : "#ffffff";
      ctx.fillRect(0, 0, 1024, 1024);

      // Subtle border
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 8;
      ctx.strokeRect(16, 16, 992, 992);

      // Texture patterns
      ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
      for (let i = 0; i < 1024; i += 32) {
        ctx.fillRect(i, 0, 1, 1024);
        ctx.fillRect(0, i, 1024, 1);
      }

      if (artworkUrl) {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = artworkUrl;
        img.onload = () => {
          ctx.drawImage(img, 128, 128, 768, 768);
          if (customText) {
            ctx.fillStyle = "#141414";
            ctx.font = "bold 42px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(customText, 512, 920);
          }
          texture.needsUpdate = true;
        };
      } else {
        // Brand logo watermark
        const logoImg = new window.Image();
        logoImg.src = "/lamsa2.png";
        logoImg.onload = () => {
          ctx.drawImage(logoImg, 312, 312, 400, 400);

          ctx.fillStyle = "#a7a29a";
          ctx.font = "600 32px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(label, 512, 800);

          if (customText) {
            ctx.fillStyle = "#e30613";
            ctx.font = "bold 38px sans-serif";
            ctx.fillText(customText, 512, 860);
          }
          texture.needsUpdate = true;
        };
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.anisotropy = 16;
      return texture;
    },
    [customText]
  );

  React.useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f5f2);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.2);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(5, 8, 5);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xe30613, 0.35); // subtle brand red rim light
    dirLight2.position.set(-5, -3, -4);
    scene.add(dirLight2);

    // 3D Object Group
    const group = new THREE.Group();
    meshGroupRef.current = group;
    scene.add(group);

    // Materials
    const rectoTexture = createFaceTexture(rectoArtworkUrl, "Face Avant (Recto)");
    const versoTexture = createFaceTexture(versoArtworkUrl, "Face Arrière (Verso)", true);

    const rectoMaterial = new THREE.MeshStandardMaterial({
      map: rectoTexture,
      roughness: 0.25,
      metalness: 0.05
    });

    const versoMaterial = new THREE.MeshStandardMaterial({
      map: versoTexture,
      roughness: 0.3,
      metalness: 0.05
    });

    const edgeMaterial = new THREE.MeshStandardMaterial({
      color: 0x141414,
      roughness: 0.6
    });

    // Mesh construction based on modelType
    if (modelType === "card") {
      // Business Card / Postcard (Double-sided box)
      const geometry = new THREE.BoxGeometry(2.4, 1.4, 0.03);
      const materials = [
        edgeMaterial, // right
        edgeMaterial, // left
        edgeMaterial, // top
        edgeMaterial, // bottom
        rectoMaterial, // front
        versoMaterial // back
      ];
      const cardMesh = new THREE.Mesh(geometry, materials);
      cardMesh.castShadow = true;
      group.add(cardMesh);
    } else if (modelType === "box") {
      // Packaging Box
      const geometry = new THREE.BoxGeometry(1.8, 1.4, 1.8);
      const materials = [
        edgeMaterial,
        edgeMaterial,
        rectoMaterial, // top
        edgeMaterial, // bottom
        rectoMaterial, // front
        versoMaterial // back
      ];
      const boxMesh = new THREE.Mesh(geometry, materials);
      boxMesh.castShadow = true;
      group.add(boxMesh);
    } else if (modelType === "neon") {
      // Neon LED on Acrylic Plaque
      const acrylicGeo = new THREE.BoxGeometry(2.5, 1.5, 0.08);
      const acrylicMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transmission: 0.9,
        opacity: 1,
        transparent: true,
        roughness: 0.1,
        ior: 1.5
      });
      const acrylicMesh = new THREE.Mesh(acrylicGeo, acrylicMat);

      // Neon plane
      const neonGeo = new THREE.PlaneGeometry(2.2, 1.2);
      const neonMat = new THREE.MeshBasicMaterial({
        map: rectoTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      const neonMesh = new THREE.Mesh(neonGeo, neonMat);
      neonMesh.position.z = 0.05;

      group.add(acrylicMesh);
      group.add(neonMesh);
    } else {
      // Default: Rollup / Substrate Sheet
      const geometry = new THREE.BoxGeometry(1.8, 2.4, 0.04);
      const materials = [
        edgeMaterial,
        edgeMaterial,
        edgeMaterial,
        edgeMaterial,
        rectoMaterial,
        versoMaterial
      ];
      const mesh = new THREE.Mesh(geometry, materials);
      mesh.castShadow = true;
      group.add(mesh);
    }

    // Floor Shadow Plane
    const shadowPlaneGeo = new THREE.PlaneGeometry(6, 6);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.3;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (meshGroupRef.current) {
        // Smooth rotation interpolation
        currentRotationYRef.current +=
          (targetRotationYRef.current - currentRotationYRef.current) * 0.08;
        meshGroupRef.current.rotation.y = currentRotationYRef.current;

        // Subtle floating idle motion
        if (!isDraggingRef.current) {
          meshGroupRef.current.position.y = Math.sin(Date.now() * 0.0015) * 0.04;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse / Touch Drag Orbit handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !meshGroupRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      targetRotationYRef.current += deltaX * 0.01;
      meshGroupRef.current.rotation.x += deltaY * 0.005;
      meshGroupRef.current.rotation.x = Math.max(-0.5, Math.min(0.5, meshGroupRef.current.rotation.x));

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Handle Resize
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [modelType, rectoArtworkUrl, versoArtworkUrl, customText, createFaceTexture]);

  const handleZoom = (direction: "in" | "out") => {
    if (!cameraRef.current) return;
    const delta = direction === "in" ? -0.4 : 0.4;
    cameraRef.current.position.z = Math.max(2.5, Math.min(6.5, cameraRef.current.position.z + delta));
  };

  const handleResetView = () => {
    targetRotationYRef.current = activeFace === "recto" ? 0 : Math.PI;
    if (meshGroupRef.current) {
      meshGroupRef.current.rotation.x = 0;
    }
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 0, 4.2);
    }
  };

  return (
    <div className="relative h-full min-h-[420px] w-full select-none overflow-hidden rounded-3xl border border-brand-light-gray bg-[#f7f5f2] shadow-inner lg:min-h-[580px]">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Controls */}
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-xs font-bold text-brand-charcoal backdrop-blur-md shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-brand-red" />
          Rendu 3D Temps Réel
        </span>

        <span className="rounded-full bg-brand-charcoal px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
          {activeFace === "recto" ? "Face Avant (Recto)" : "Face Arrière (Verso)"}
        </span>
      </div>

      {/* Bottom Action Controls Bar */}
      <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none">
        {/* Face Flip Toggle */}
        <button
          type="button"
          onClick={onToggleFace}
          className="pointer-events-auto flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold text-brand-charcoal shadow-md transition-all hover:bg-brand-red hover:text-white hover:border-brand-red cursor-pointer"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Tourner ({activeFace === "recto" ? "Verso" : "Recto"})
        </button>

        {/* View Tools */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 p-1 shadow-md backdrop-blur-sm">
          <button
            type="button"
            onClick={() => handleZoom("in")}
            aria-label="Zoom avant"
            className="flex h-8 w-8 items-center justify-center rounded-full text-brand-charcoal transition-colors hover:bg-brand-soft-white cursor-pointer"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom("out")}
            aria-label="Zoom arrière"
            className="flex h-8 w-8 items-center justify-center rounded-full text-brand-charcoal transition-colors hover:bg-brand-soft-white cursor-pointer"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            aria-label="Réinitialiser la vue"
            className="flex h-8 w-8 items-center justify-center rounded-full text-brand-charcoal transition-colors hover:bg-brand-soft-white cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Drag helper hint */}
      <div className="absolute top-4 right-4 pointer-events-none hidden sm:block">
        <span className="text-[11px] font-medium text-brand-warm-gray bg-white/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-black/5">
          Glissez pour faire pivoter à 360°
        </span>
      </div>
    </div>
  );
}
