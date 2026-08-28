"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FooterCanvas() {
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
      camera.position.set(0, 0, 8.5);

      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch (e) {
        console.warn("WebGL not supported:", e);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      clock = new THREE.Clock();

      const group = new THREE.Group();
      const globeGeo = new THREE.IcosahedronGeometry(2.6, 2);
      const globeMat = new THREE.MeshBasicMaterial({
        color: 0xfaf8ed,
        wireframe: true,
        transparent: true,
        opacity: 0.14,
      });
      const globe = new THREE.Mesh(globeGeo, globeMat);
      group.add(globe);

      const innerGeo = new THREE.IcosahedronGeometry(2.55, 1);
      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x9e2226,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
      });
      group.add(new THREE.Mesh(innerGeo, innerMat));

      const markers: THREE.Mesh[] = [];
      const markerGeo = new THREE.SphereGeometry(0.05, 10, 10);
      const markerMat = new THREE.MeshBasicMaterial({ color: 0xc7484c });
      for (let i = 0; i < 7; i++) {
        const m = new THREE.Mesh(markerGeo, markerMat);
        const phi = Math.acos(1 - 2 * Math.random());
        const theta = Math.random() * Math.PI * 2;
        m.position.set(
          2.62 * Math.sin(phi) * Math.cos(theta),
          2.62 * Math.sin(phi) * Math.sin(theta),
          2.62 * Math.cos(phi)
        );
        m.userData = { phase: Math.random() * Math.PI * 2 };
        markers.push(m);
        group.add(m);
      }
      group.rotation.x = 0.25;
      scene.add(group);
      scene.userData.group = group;
      scene.userData.markers = markers;

      resize();
      window.addEventListener("resize", resize);
      inited = true;
    };

    const loop = () => {
      animId = requestAnimationFrame(loop);
      if (clock && scene && renderer && camera) {
        const t = clock.getElapsedTime();
        if (!reduceMotion && scene.userData.group && scene.userData.markers) {
          const group = scene.userData.group as THREE.Group;
          const markers = scene.userData.markers as THREE.Mesh[];
          group.rotation.y = t * 0.06;
          markers.forEach((m) => {
            m.scale.setScalar(1 + Math.sin(t * 1.6 + m.userData.phase) * 0.6);
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-55 z-0" />;
}
