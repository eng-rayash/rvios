"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
    camera.position.set(0, 0, 7.5);

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
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight || w;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    const cream = new THREE.Color(0xfaf8ed);
    const maroon = new THREE.Color(0x9e2226);
    const maroonLight = new THREE.Color(0xc7484c);

    // Core mesh
    const coreGroup = new THREE.Group();
    const geoOuter = new THREE.IcosahedronGeometry(1.5, 0);
    const matOuter = new THREE.MeshBasicMaterial({ color: maroon, wireframe: true });
    const core = new THREE.Mesh(geoOuter, matOuter);
    coreGroup.add(core);

    const geoInner = new THREE.IcosahedronGeometry(1.48, 1);
    const matInner = new THREE.MeshBasicMaterial({
      color: maroonLight,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    });
    const inner = new THREE.Mesh(geoInner, matInner);
    coreGroup.add(inner);
    scene.add(coreGroup);

    // Rings
    const ringGroup = new THREE.Group();
    const ringConfig = [
      { r: 2.3, color: maroon, speed: 0.006, axis: "z" as const },
      { r: 3.0, color: maroonLight, speed: -0.004, axis: "x" as const },
    ];
    ringConfig.forEach((cfg) => {
      const geo = new THREE.TorusGeometry(cfg.r, 0.015, 8, 60);
      const mat = new THREE.MeshBasicMaterial({ color: cfg.color, transparent: true, opacity: 0.5 });
      const ring = new THREE.Mesh(geo, mat);
      ring.userData = { axis: cfg.axis, speed: cfg.speed };
      ringGroup.add(ring);
    });
    scene.add(ringGroup);

    // Orbiting nodes
    const nodeGeo = new THREE.SphereGeometry(0.04, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: maroonLight });
    const nodes: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / 6) * Math.PI * 2;
      const radius = 2.3 + (i % 2) * 0.7;
      node.userData = { angle, radius, speed: 0.25 };
      scene.add(node);
      nodes.push(node);
    }

    // Particles
    const pCount = 280;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    for (let p = 0; p < pCount; p++) {
      const r = 1.2 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[p * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[p * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[p * 3 + 2] = r * Math.cos(phi) - 4;
    }
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: cream, size: 0.028, transparent: true, opacity: 0.35 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    size();
    const ro = new ResizeObserver(size);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", onMouseMove);

    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (!reduceMotion) {
        core.rotation.y = t * 0.18;
        core.rotation.x = t * 0.09;
        inner.rotation.copy(core.rotation);
        ringGroup.children.forEach((child: THREE.Object3D) => {
          const axis = child.userData.axis as "x" | "y" | "z";
          child.rotation[axis] += child.userData.speed;
        });
        nodes.forEach((node, i) => {
          const a = node.userData.angle + t * 0.25 + i * 2;
          node.position.set(
            Math.cos(a) * node.userData.radius,
            Math.sin(a * 0.6) * 0.6,
            Math.sin(a) * node.userData.radius
          );
        });
        particles.rotation.y = t * 0.015;
        scene.rotation.y += (mouseX * 0.25 - scene.rotation.y) * 0.02;
        scene.rotation.x += (-mouseY * 0.15 - scene.rotation.x) * 0.02;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      ro.disconnect();
      renderer.dispose();
      geoOuter.dispose();
      matOuter.dispose();
      geoInner.dispose();
      matInner.dispose();
      pGeo.dispose();
      pMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-none z-[1]" />;
}
