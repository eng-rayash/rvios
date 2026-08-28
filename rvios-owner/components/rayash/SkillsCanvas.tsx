"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SkillsCanvas() {
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
      camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
      camera.position.set(0, 0, 15);

      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch (e) {
        console.warn("WebGL not supported:", e);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      clock = new THREE.Clock();

      const group = new THREE.Group();
      const cols = 7;
      const rows = 4;
      const spacing = 2.1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const size = 0.4 + Math.random() * 0.3;
          const geo = new THREE.BoxGeometry(size, size, size);
          const color = Math.random() > 0.6 ? 0x9e2226 : 0x2a1d18;
          const mat = new THREE.MeshBasicMaterial({
            color,
            wireframe: true,
            transparent: true,
            opacity: 0.32,
          });
          const cube = new THREE.Mesh(geo, mat);
          const baseY = (j - (rows - 1) / 2) * spacing + (Math.random() - 0.5) * 0.6;
          cube.position.set(
            (i - (cols - 1) / 2) * spacing + (Math.random() - 0.5) * 0.6,
            baseY,
            (Math.random() - 0.5) * 4
          );
          cube.userData = {
            speedX: 0.15 + Math.random() * 0.3,
            speedY: 0.1 + Math.random() * 0.25,
            bobSpeed: 0.4 + Math.random() * 0.5,
            bobOffset: Math.random() * Math.PI * 2,
            baseY,
          };
          group.add(cube);
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
          group.children.forEach((child) => {
            const cube = child as THREE.Mesh;
            cube.rotation.x = t * cube.userData.speedX;
            cube.rotation.y = t * cube.userData.speedY;
            cube.position.y =
              cube.userData.baseY + Math.sin(t * cube.userData.bobSpeed + cube.userData.bobOffset) * 0.15;
          });
          group.rotation.y = Math.sin(t * 0.05) * 0.1;
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-55 z-0" />;
}
