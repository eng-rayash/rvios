"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ProjectsCanvas() {
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
      camera.position.set(0, 0, 11);

      try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      } catch (e) {
        console.warn("WebGL not supported:", e);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      clock = new THREE.Clock();

      const group = new THREE.Group();
      const nodePositions = [
        new THREE.Vector3(-5, 2.2, -1),
        new THREE.Vector3(0.5, -1.6, 1),
        new THREE.Vector3(5, 1.8, -2),
      ];
      const nodes: THREE.Mesh[] = [];
      const nodeGeo = new THREE.IcosahedronGeometry(0.16, 0);

      nodePositions.forEach((pos, i) => {
        const mat = new THREE.MeshBasicMaterial({
          color: 0xc7484c,
          wireframe: true,
          transparent: true,
          opacity: 0.9,
        });
        const node = new THREE.Mesh(nodeGeo, mat);
        node.position.copy(pos);
        node.userData = { phase: i * 2.1 };
        nodes.push(node);
        group.add(node);
      });

      const lineMat = new THREE.LineBasicMaterial({
        color: 0xfaf8ed,
        transparent: true,
        opacity: 0.14,
      });

      for (let i = 0; i < nodePositions.length; i++) {
        for (let j = i + 1; j < nodePositions.length; j++) {
          const lineGeo = new THREE.BufferGeometry().setFromPoints([nodePositions[i], nodePositions[j]]);
          group.add(new THREE.Line(lineGeo, lineMat));
        }
      }

      const starCount = 180;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      for (let s = 0; s < starCount; s++) {
        starPos[s * 3] = (Math.random() - 0.5) * 16;
        starPos[s * 3 + 1] = (Math.random() - 0.5) * 8;
        starPos[s * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0xfaf8ed,
        size: 0.02,
        transparent: true,
        opacity: 0.3,
      });
      group.add(new THREE.Points(starGeo, starMat));

      scene.add(group);
      scene.userData.group = group;
      scene.userData.nodes = nodes;

      resize();
      window.addEventListener("resize", resize);
      inited = true;
    };

    const loop = () => {
      animId = requestAnimationFrame(loop);
      if (clock && scene && renderer && camera) {
        const t = clock.getElapsedTime();
        if (!reduceMotion && scene.userData.nodes && scene.userData.group) {
          const nodes = scene.userData.nodes as THREE.Mesh[];
          const group = scene.userData.group as THREE.Group;
          nodes.forEach((node) => {
            const s = 1 + Math.sin(t * 1.4 + node.userData.phase) * 0.28;
            node.scale.setScalar(s);
            node.rotation.y = t * 0.4;
          });
          group.rotation.y = Math.sin(t * 0.06) * 0.12;
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
}
