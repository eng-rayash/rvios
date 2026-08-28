"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function EduVisionCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer | null = null;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let clock: THREE.Clock;
    let animId: number | null = null;
    let inited = false;

    const resize = () => {
      if (!renderer || !canvas) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || w;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const init = () => {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 0, 7);

      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch (e) {
        console.warn("WebGL not supported:", e);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      clock = new THREE.Clock();

      const group = new THREE.Group();
      const steps = 26;
      const dotGeo = new THREE.SphereGeometry(0.045, 8, 8);
      const matA = new THREE.MeshBasicMaterial({ color: 0x9e2226 });
      const matB = new THREE.MeshBasicMaterial({ color: 0xc7484c });

      for (let i = 0; i < steps; i++) {
        const yy = (i - steps / 2) * 0.22;
        const angle = i * 0.55;
        const dA = new THREE.Mesh(dotGeo, matA);
        dA.position.set(Math.cos(angle) * 0.55, yy, Math.sin(angle) * 0.55);
        const dB = new THREE.Mesh(dotGeo, matB);
        dB.position.set(Math.cos(angle + Math.PI) * 0.55, yy, Math.sin(angle + Math.PI) * 0.55);
        group.add(dA);
        group.add(dB);

        if (i > 0) {
          const rungGeo = new THREE.BufferGeometry().setFromPoints([dA.position, dB.position]);
          const rungMat = new THREE.LineBasicMaterial({ color: 0x9e2226, transparent: true, opacity: 0.18 });
          group.add(new THREE.Line(rungGeo, rungMat));
        }
      }

      scene.add(group);
      scene.userData.group = group;

      resize();
      window.addEventListener("resize", resize);
      inited = true;
    };

    const loop = () => {
      animId = requestAnimationFrame(loop);
      if (clock && scene && renderer && camera) {
        const t = clock.getElapsedTime();
        if (!reduceMotion && scene.userData.group) {
          const group = scene.userData.group as THREE.Group;
          group.rotation.y = t * 0.35;
        }
        renderer.render(scene, camera);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!inited) init();
            else resize();
            if (!animId) loop();
          } else if (animId) {
            cancelAnimationFrame(animId);
            animId = null;
          }
        });
      },
      { threshold: 0.05 }
    );

    io.observe(canvas);

    return () => {
      io.disconnect();
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      if (renderer) renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="hidden md:block w-full h-full min-h-[280px]" />;
}
