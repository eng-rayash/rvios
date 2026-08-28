"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AboutCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 6);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
    } catch (e) {
      console.warn("WebGL not supported:", e);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const size = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight || w;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const geo = new THREE.IcosahedronGeometry(1.7, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0x9e2226, wireframe: true });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const dotGeo = new THREE.SphereGeometry(0.035, 10, 10);
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xc7484c });
    const dots: THREE.Mesh[] = [];

    const posAttr = geo.attributes.position;
    if (posAttr && posAttr.count) {
      let used = 0;
      const step = Math.max(1, Math.floor(posAttr.count / 8));
      for (let i = 0; i < posAttr.count && used < 8; i += step) {
        const d = new THREE.Mesh(dotGeo, dotMat);
        d.position.set(posAttr.getX(i), posAttr.getY(i), posAttr.getZ(i));
        scene.add(d);
        dots.push(d);
        used++;
      }
    }

    size();
    const ro = new ResizeObserver(size);
    ro.observe(canvas);

    const clock = new THREE.Clock();
    let animId: number;
    const axis = new THREE.Vector3(0.3, 1, 0.1).normalize();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!reduceMotion) {
        const t = clock.getElapsedTime();
        mesh.rotation.y = t * 0.35;
        mesh.rotation.x = t * 0.2;
        dots.forEach((d) => {
          d.position.applyAxisAngle(axis, 0.0055);
        });
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      dotGeo.dispose();
      dotMat.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full aspect-square max-w-[320px] mx-auto block" />;
}
