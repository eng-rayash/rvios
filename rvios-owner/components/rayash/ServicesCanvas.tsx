"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ServicesCanvas() {
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
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0.5, 6.5);

      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch (e) {
        console.warn("WebGL not supported:", e);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      clock = new THREE.Clock();

      const group = new THREE.Group();
      const count = 6;
      for (let i = 0; i < count; i++) {
        const radius = 1.1 + i * 0.14;
        const geo = new THREE.TorusGeometry(radius, 0.018, 8, 60);
        const color = i % 2 === 0 ? 0x9e2226 : 0xc7484c;
        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.65 - i * 0.06,
        });
        const ring = new THREE.Mesh(geo, mat);
        ring.position.y = (i - count / 2) * 0.22;
        ring.rotation.x = Math.PI / 2.3;
        ring.userData = { spin: 0.08 + i * 0.03 };
        group.add(ring);
      }
      group.rotation.z = 0.25;
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
          group.rotation.y = t * 0.22;
          group.children.forEach((ring: THREE.Object3D, i: number) => {
            ring.position.y = (i - group.children.length / 2) * 0.22 + Math.sin(t * 0.6 + i) * 0.03;
          });
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

  return (
    <canvas
      ref={canvasRef}
      className="hidden md:block absolute -top-[10%] ltr:right-[-4%] rtl:left-[-4%] w-[340px] h-[340px] z-0 opacity-90 pointer-events-none"
    />
  );
}
