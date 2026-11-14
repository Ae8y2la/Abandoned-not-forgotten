/**
 * StarfieldBackground.jsx
 *
 * 3D animated starfield using @react-three/fiber + @react-three/drei.
 * - Single Points geometry (3 200 stars) for performance
 * - Slow Y-axis rotation (0.0003 rad/frame)
 * - Mouse parallax: camera tilt ±5° via smooth lerp (ref-only, no re-renders)
 * - Scroll parallax: group Y shift = scrollY * 0.04, capped ±60 px→world units
 * - Shooting stars: 1-3 bright streaks every 8-15 s, fade in/out
 * - Fully respects prefers-reduced-motion
 */

import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ─── constants ───────────────────────────────────────────────────────────────
const STAR_COUNT          = 3200;
const ROTATION_SPEED      = 0.0003;        // rad / frame
const PARALLAX_MAX_DEG    = 5;             // degrees
const PARALLAX_LERP       = 0.05;
const SCROLL_FACTOR       = 0.04;
const SCROLL_CAP          = 60;            // world units (same scale as px here)
const SHOOT_MIN_S         = 8_000;
const SHOOT_MAX_S         = 15_000;
const SHOOT_MAX_COUNT     = 3;
const SHOOT_DURATION      = 1_200;        // ms per streak

// ─── helpers ─────────────────────────────────────────────────────────────────
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ─── StarField (inner scene component) ───────────────────────────────────────
function StarField({ reduced }) {
  const groupRef      = useRef();
  const mouseTarget   = useRef({ x: 0, y: 0 });   // desired tilt (radians)
  const mouseCurrent  = useRef({ x: 0, y: 0 });   // current lerped tilt
  const scrollY       = useRef(0);
  const { camera }    = useThree();

  // ── Star geometry (single Points, built once) ──
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const colors    = new Float32Array(STAR_COUNT * 3);

    for (let i = 0; i < STAR_COUNT; i++) {
      const i3 = i * 3;
      // Spread across a large sphere-ish volume
      const r     = randomInRange(80, 400);
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);

      positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);

      // Slight warm-to-cool colour variation
      const warm    = Math.random();
      colors[i3]     = 0.7 + warm * 0.3;
      colors[i3 + 1] = 0.8 + warm * 0.1;
      colors[i3 + 2] = 1.0;
    }
    return { positions, colors };
  }, []);

  // ── Mouse listener ──
  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * 2;   // -1 … 1
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      const maxRad = (PARALLAX_MAX_DEG * Math.PI) / 180;
      mouseTarget.current.x =  ny * maxRad;   // pitch
      mouseTarget.current.y = -nx * maxRad;   // yaw
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced]);

  // ── Scroll listener ──
  useEffect(() => {
    if (reduced) return;
    const onScroll = () => { scrollY.current = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced]);

  // ── Animation loop ──
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!reduced) {
      // Slow rotation
      groupRef.current.rotation.y += ROTATION_SPEED;

      // Smooth mouse parallax (lerp camera rotation toward target)
      mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * PARALLAX_LERP;
      mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * PARALLAX_LERP;
      camera.rotation.x = mouseCurrent.current.x;
      camera.rotation.y = mouseCurrent.current.y;

      // Scroll parallax (Y shift on group)
      const rawShift = scrollY.current * SCROLL_FACTOR;
      const shift    = Math.max(-SCROLL_CAP, Math.min(SCROLL_CAP, rawShift));
      groupRef.current.position.y = -shift;   // scroll down → stars move up
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          sizeAttenuation
          vertexColors
          transparent
          opacity={0.9}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ─── Shooting star data shape ─────────────────────────────────────────────────
// { id, startPos:[x,y,z], dir:[dx,dy,dz], length, progress (0→1), opacity }

function ShootingStars({ reduced }) {
  const streaksRef = useRef([]);    // array of streak state objects (mutable)
  const nextFireRef = useRef(null); // timestamp (ms) of next batch
  const linesRef  = useRef([]);     // array of line mesh refs

  // We manage up to SHOOT_MAX_COUNT simultaneous streaks via refs only.
  // We use a small fixed pool of THREE objects so garbage is minimal.
  const pool = useMemo(() => {
    return Array.from({ length: SHOOT_MAX_COUNT }, () => {
      const geo = new THREE.BufferGeometry();
      // 2 points per line
      const positions = new Float32Array(6);
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color(1, 1, 1),
        transparent: true,
        opacity: 0,
        linewidth: 1,
        depthWrite: false,
      });
      const line = new THREE.Line(geo, mat);
      line.visible = false;
      return { geo, mat, line };
    });
  }, []);

  // Schedule next emission
  const scheduleNext = useCallback(() => {
    nextFireRef.current = performance.now() + randomInRange(SHOOT_MIN_S, SHOOT_MAX_S);
  }, []);

  useEffect(() => {
    if (reduced) return;
    scheduleNext();
  }, [reduced, scheduleNext]);

  const emitStreaks = useCallback(() => {
    const count = Math.round(randomInRange(1, SHOOT_MAX_COUNT));
    for (let s = 0; s < count; s++) {
      const slot = pool[s];
      if (!slot) continue;

      // Random position within visible sphere
      const x = randomInRange(-150, 150);
      const y = randomInRange(-80, 80);
      const z = randomInRange(-200, -50);

      // Random direction (mostly "falling" diagonally)
      const angle  = randomInRange(20, 60) * (Math.PI / 180);
      const length = randomInRange(15, 40);
      const dx = Math.cos(angle) * length;
      const dy = -Math.sin(angle) * length;

      // Set geometry positions: start → end
      const pos = slot.geo.attributes.position.array;
      pos[0] = x;      pos[1] = y;      pos[2] = z;
      pos[3] = x + dx; pos[4] = y + dy; pos[5] = z;
      slot.geo.attributes.position.needsUpdate = true;

      slot.mat.opacity = 0;
      slot.line.visible = true;

      streaksRef.current[s] = {
        startTime: performance.now(),
        slot,
      };
    }
    // Clear unused slots
    for (let s = count; s < SHOOT_MAX_COUNT; s++) {
      streaksRef.current[s] = null;
    }
  }, [pool]);

  useFrame(() => {
    if (reduced) return;

    const now = performance.now();

    // Fire new batch?
    if (nextFireRef.current !== null && now >= nextFireRef.current) {
      emitStreaks();
      scheduleNext();
    }

    // Animate active streaks
    for (let s = 0; s < SHOOT_MAX_COUNT; s++) {
      const streak = streaksRef.current[s];
      if (!streak) continue;

      const elapsed  = now - streak.startTime;
      const progress = Math.min(elapsed / SHOOT_DURATION, 1);

      // Opacity: ramp up for first 20%, sustain to 70%, ramp down
      let opacity;
      if (progress < 0.2)       opacity = progress / 0.2;
      else if (progress < 0.7)  opacity = 1;
      else                       opacity = 1 - (progress - 0.7) / 0.3;

      streak.slot.mat.opacity = opacity * 0.85;   // keep subtle

      if (progress >= 1) {
        streak.slot.line.visible = false;
        streak.slot.mat.opacity  = 0;
        streaksRef.current[s]    = null;
      }
    }
  });

  // Attach pool lines to scene on mount
  const { scene } = useThree();
  useEffect(() => {
    pool.forEach(({ line }) => scene.add(line));
    return () => pool.forEach(({ line }) => scene.remove(line));
  }, [pool, scene]);

  return null;   // geometry managed imperatively via pool
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function StarfieldBackground() {
  const reduced = prefersReducedMotion();

  return (
    <div
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
        width:         '100vw',
        height:        '100vh',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
        gl={{
          antialias:          false,
          alpha:              true,
          powerPreference:    'high-performance',
          preserveDrawingBuffer: false,
        }}
        style={{ background: 'transparent' }}
        frameloop={reduced ? 'demand' : 'always'}
        dpr={[1, 1.5]}
      >
        <StarField    reduced={reduced} />
        <ShootingStars reduced={reduced} />
      </Canvas>
    </div>
  );
}
