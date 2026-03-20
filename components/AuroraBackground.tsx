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
      camera.position.set(0, 0, 4);

      const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      
      // EXTREME PERFORMANCE: Lower pixel ratio for 60fps on high-DPI screens
      // Since it's a blurry nebula, lower resolution is almost unnoticeable.
      renderer.setPixelRatio(0.8); 
      
      renderer.setClearColor(0x09090b, 1);
      mount.appendChild(renderer.domElement);

      const noiseShaderHeader = `
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 a0 = x - floor(x + 0.5);
          vec3 g = a0 * vec3(x0.x,x12.xz) + h * vec3(x0.y,x12.yw);
          return 130.0 * dot(m, g);
        }
      `;

      const vertexShader = `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(pos.x * 1.5 + uTime * 0.2) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `;

      const fragmentShader = `
        uniform float uTime;
        varying vec2 vUv;
        ${noiseShaderHeader}

        void main() {
          vec2 uv = vUv;
          
          // Original Nebula Noise (that the user liked)
          float n1 = snoise(uv * 2.8 + uTime * 0.1);
          float n2 = snoise(uv * 4.5 - uTime * 0.15 + n1 * 0.5);
          float combined = (n1 + n2) * 0.5 + 0.5;

          vec3 emerald = vec3(0.063, 0.725, 0.506);
          vec3 cyan    = vec3(0.024, 0.714, 0.831);
          vec3 indigo  = vec3(0.388, 0.400, 0.949);
          vec3 dark    = vec3(0.035, 0.035, 0.043);

          vec3 color = mix(emerald, cyan, n1 * 0.5 + 0.5);
          color = mix(color, indigo, n2 * 0.45 + 0.2);
          
          float contrastEffect = pow(combined, 1.3);
          color = mix(dark, color, contrastEffect * 0.9 + 0.1);

          float dist = distance(vUv, vec2(0.5, 0.5));
          float vignette = 1.0 - smoothstep(0.25, 0.9, dist);
          
          gl_FragColor = vec4(color * vignette, vignette * 0.82);
        }
      `;

      const geometry = new THREE.PlaneGeometry(10, 8, 8, 8); // Minimal segments for FPS
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -0.2;
      scene.add(mesh);

      const onResize = () => {
        if (!mount) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener('resize', onResize);

      const clock = new THREE.Clock();
      const animate = () => {
        animId = requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsed * 0.5;
        mesh.rotation.y = Math.sin(elapsed * 0.05) * 0.02;
        renderer.render(scene, camera);
      };
      animate();

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', onResize);
        geometry.dispose();
        material.dispose();
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
    <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }} />
  );
}