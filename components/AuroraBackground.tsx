'use client';

import { useEffect, useRef } from 'react';

export default function AuroraBackground() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let animId: number;
    let cleanup: (() => void) | undefined;

    import('three').then((THREE) => {
      if (!mount) return;

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 3);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x09090b, 1);
      mount.appendChild(renderer.domElement);

      const vertexShader = `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float wave1 = sin(pos.x * 2.0 + uTime * 0.6) * 0.18;
          float wave2 = sin(pos.y * 3.0 + uTime * 0.4) * 0.12;
          float wave3 = cos(pos.x * 1.5 + pos.y * 2.0 + uTime * 0.3) * 0.10;
          pos.z += wave1 + wave2 + wave3;
          vElevation = pos.z;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `;

      const fragmentShader = `
        uniform float uTime;
        varying vec2 vUv;
        varying float vElevation;
        vec3 emerald = vec3(0.063, 0.725, 0.506);
        vec3 cyan    = vec3(0.024, 0.714, 0.831);
        vec3 indigo  = vec3(0.388, 0.400, 0.949);
        vec3 dark    = vec3(0.035, 0.035, 0.043);
        void main() {
          float t1 = sin(vUv.x * 3.0 + uTime * 0.4) * 0.5 + 0.5;
          float t2 = cos(vUv.y * 2.5 + uTime * 0.3) * 0.5 + 0.5;
          float t3 = sin((vUv.x + vUv.y) * 2.0 + uTime * 0.5) * 0.5 + 0.5;
          vec3 color = mix(emerald, cyan, t1);
          color = mix(color, indigo, t2 * 0.5);
          color = mix(dark, color, t3 * 0.6 + vElevation * 1.5 + 0.3);
          float dist = distance(vUv, vec2(0.5));
          float vignette = 1.0 - smoothstep(0.3, 0.9, dist);
          color *= vignette;
          float alpha = smoothstep(0.0, 0.4, vignette) * 0.85;
          gl_FragColor = vec4(color, alpha);
        }
      `;

      const geometry = new THREE.PlaneGeometry(6, 4, 80, 60);
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -0.3;
      scene.add(mesh);

      const particleGeo = new THREE.BufferGeometry();
      const count       = 120;
      const positions   = new Float32Array(count * 3);
      for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 8;
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({ color: 0x10b981, size: 0.018, transparent: true, opacity: 0.5 });
      const particles   = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      const onResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener('resize', onResize);

      let mouseX = 0, mouseY = 0;
      const onMouse = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.3;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.2;
      };
      window.addEventListener('mousemove', onMouse);

      const clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsed;
        mesh.rotation.y = mouseX * 0.4;
        mesh.rotation.x = -0.3 + mouseY * 0.3;
        particles.rotation.y = elapsed * 0.03;
        particles.rotation.x = elapsed * 0.015;
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('mousemove', onMouse);
        geometry.dispose();
        material.dispose();
        particleGeo.dispose();
        particleMat.dispose();
        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelAnimationFrame(animId);
      cleanup?.();
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />
  );
}