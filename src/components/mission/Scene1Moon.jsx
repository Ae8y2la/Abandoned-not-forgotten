import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Scene1Moon.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Procedural Lunar Surface Texture Generator ─────────────────────────────
function createMoonTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Base charcoal to dust-grey regolith gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#5A606A');
  grad.addColorStop(0.5, '#444952');
  grad.addColorStop(1, '#32363E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Surface micro-noise (fine basaltic dust)
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 38;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Procedural impact craters
  for (let i = 0; i < 220; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.pow(Math.random(), 3) * 60 + 4;

    // Crater depression
    const craterGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    craterGrad.addColorStop(0, 'rgba(18, 20, 24, 0.85)');
    craterGrad.addColorStop(0.7, 'rgba(38, 42, 50, 0.7)');
    craterGrad.addColorStop(1, 'rgba(60, 65, 75, 0)');
    ctx.fillStyle = craterGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Raised sunlit rim (illuminated by low sun from upper left)
    ctx.strokeStyle = 'rgba(230, 235, 245, 0.35)';
    ctx.lineWidth = Math.max(1, r * 0.12);
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI * 0.75, Math.PI * 1.75);
    ctx.stroke();

    // Shadowed rim on opposite edge
    ctx.strokeStyle = 'rgba(10, 12, 16, 0.6)';
    ctx.lineWidth = Math.max(1, r * 0.12);
    ctx.beginPath();
    ctx.arc(x, y, r, -Math.PI * 0.25, Math.PI * 0.75);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// ─── Procedural Earth Texture Generator ─────────────────────────────────────
function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Deep oceanic blue
  ctx.fillStyle = '#0B254E';
  ctx.fillRect(0, 0, 512, 256);

  // Continental landmasses
  ctx.fillStyle = '#22543D';
  for (let i = 0; i < 28; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 256;
    const cr = 20 + Math.random() * 55;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Cloud bands
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  for (let i = 0; i < 35; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 256;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 35 + Math.random() * 60, 8 + Math.random() * 15, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

// ─── 3D Earth in the Lunar Sky ──────────────────────────────────────────────
function GlowingEarth() {
  const earthTexture = useMemo(() => createEarthTexture(), []);
  const earthRef = useRef();

  useFrame((_, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group position={[4.5, 6.5, -16]}>
      {/* Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.65}
          metalness={0.1}
          emissive="#1E3A8A"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Atmospheric Glow Aura Ring */}
      <mesh scale={1.12}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#38BDF8"
          transparent
          opacity={0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// ─── 3D Tiny Child Astronaut ────────────────────────────────────────────────
function TinyChildAstronaut({ position = [0, 0, 0] }) {
  return (
    <group position={position} scale={0.22}>
      {/* Cast Shadow on Lunar Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0.2]} position={[0.4, 0.02, 0.8]}>
        <planeGeometry args={[1.4, 3.2]} />
        <meshBasicMaterial color="#080A0E" transparent opacity={0.7} />
      </mesh>

      {/* Backpack (PLSS) */}
      <mesh position={[-0.15, 1.25, 0]}>
        <boxGeometry args={[0.35, 0.8, 0.45]} />
        <meshStandardMaterial color="#374151" roughness={0.7} />
      </mesh>

      {/* Antenna */}
      <mesh position={[-0.2, 1.85, 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshBasicMaterial color="#9CA3AF" />
      </mesh>

      {/* Torso */}
      <mesh position={[0.1, 1.2, 0]}>
        <boxGeometry args={[0.5, 0.7, 0.45]} />
        <meshStandardMaterial color="#F4F6F8" roughness={0.8} />
      </mesh>

      {/* Legs */}
      <mesh position={[0.1, 0.5, -0.15]}>
        <cylinderGeometry args={[0.12, 0.14, 0.7]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.85} />
      </mesh>
      <mesh position={[0.1, 0.5, 0.15]}>
        <cylinderGeometry args={[0.12, 0.14, 0.7]} />
        <meshStandardMaterial color="#E5E7EB" roughness={0.85} />
      </mesh>

      {/* Helmet Base */}
      <mesh position={[0.1, 1.75, 0]}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
      </mesh>

      {/* Golden Visor reflecting low sunlight and Earth */}
      <mesh position={[0.22, 1.75, 0]}>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.9}
          roughness={0.15}
          emissive="#78350F"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

// ─── 3D Apollo 15 Lunar Roving Vehicle (LRV-001) ────────────────────────────
function Apollo15Rover({ position = [2.2, 0, 0], rotation = [0, -0.35, 0] }) {
  return (
    <group position={position} rotation={rotation} scale={0.75}>
      {/* Soft Cast Shadow on Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.6, 0.02, 0.5]}>
        <planeGeometry args={[3.8, 5.2]} />
        <meshBasicMaterial color="#05070A" transparent opacity={0.75} />
      </mesh>

      {/* Chassis Body with Gold Foil Insulation */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[1.8, 0.25, 3.2]} />
        <meshStandardMaterial
          color="#D97706"
          metalness={0.85}
          roughness={0.3}
          emissive="#92400E"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Front Floorboard & Control Console */}
      <mesh position={[0, 0.7, 0.9]}>
        <boxGeometry args={[1.5, 0.1, 1.2]} />
        <meshStandardMaterial color="#4B5563" roughness={0.7} />
      </mesh>

      {/* T-Handle Steering Joystick */}
      <mesh position={[0, 0.95, 0.7]}>
        <cylinderGeometry args={[0.03, 0.03, 0.4]} />
        <meshStandardMaterial color="#9CA3AF" />
      </mesh>
      <mesh position={[0, 1.15, 0.7]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.25]} />
        <meshStandardMaterial color="#F59E0B" />
      </mesh>

      {/* Dual Astronaut Folded Mesh Seats */}
      <mesh position={[-0.45, 0.95, 0.2]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.6} />
      </mesh>
      <mesh position={[0.45, 0.95, 0.2]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#9CA3AF" roughness={0.6} />
      </mesh>

      {/* 4 Resilient Piano-Wire Wheels with Chevron Treads */}
      {[
        [-1.05, 0.45, 1.1],
        [1.05, 0.45, 1.1],
        [-1.05, 0.45, -1.1],
        [1.05, 0.45, -1.1]
      ].map((wheelPos, i) => (
        <group key={i} position={wheelPos}>
          {/* Outer Mesh Tire Ring */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.42, 0.12, 16, 24]} />
            <meshStandardMaterial
              color="#9CA3AF"
              wireframe={true}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>
          {/* Wheel Hub & Drive Motor */}
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.18, 0.18, 0.28, 16]} />
            <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* High-Gain Umbrella Dish Antenna (Gimbaled towards Earth) */}
      <group position={[0.65, 1.1, 1.2]} rotation={[-0.4, 0.5, 0]}>
        <mesh>
          <cylinderGeometry args={[0.03, 0.03, 0.9]} />
          <meshStandardMaterial color="#A8B3C2" />
        </mesh>
        {/* Parabolic Mesh Dish */}
        <mesh position={[0, 0.55, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.55, 0.25, 24, 1, true]} />
          <meshStandardMaterial
            color="#D1D5DB"
            wireframe={true}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
        {/* Antenna Feed Horn */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial color="#E89020" />
        </mesh>
      </group>

      {/* RCA Color Television Camera (Which filmed Apollo 15 Lunar Module Liftoff) */}
      <group position={[-0.6, 0.9, 1.4]} rotation={[0, 0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.22, 0.22, 0.35]} />
          <meshStandardMaterial color="#1F2937" roughness={0.5} />
        </mesh>
        {/* Camera Lens */}
        <mesh position={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Subtle Lunar Dust Particles (1/6th Gravity Drift) ──────────────────────
function LunarDustParticles() {
  const particleCount = 450;
  const pointsRef = useRef();

  const [positions] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = Math.random() * 2.5; // Near surface
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    return [pos];
  }, [particleCount]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posArray = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      // Gentle microgravity horizontal drift
      posArray[i * 3] += Math.sin(i + Date.now() * 0.0003) * 0.002;
      posArray[i * 3 + 1] += Math.cos(i + Date.now() * 0.0004) * 0.001;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FDE68A"
        transparent
        opacity={0.45}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ─── Main 3D Lunar Scene Orchestrator ───────────────────────────────────────
function MoonScene({ scrollProgress }) {
  const moonTexture = useMemo(() => createMoonTexture(), []);
  const { camera } = useThree();

  // Scroll scrub drives camera choreography
  useFrame(() => {
    const p = scrollProgress.current;

    // Phase 1 (0.00 -> 0.28): Slow descent from high black space
    // Phase 2 (0.28 -> 0.55): Low over lunar horizon, child astronaut revealed
    // Phase 3 (0.55 -> 0.80): Tracking right towards abandoned rover
    // Phase 4 (0.80 -> 1.00): Circling parked rover in contemplative quiet

    let targetX, targetY, targetZ;
    let lookX, lookY, lookZ;

    if (p < 0.3) {
      const t = p / 0.3;
      // High space descent
      targetX = THREE.MathUtils.lerp(0, -0.6, t);
      targetY = THREE.MathUtils.lerp(7.5, 1.6, t);
      targetZ = THREE.MathUtils.lerp(12.0, 5.2, t);
      lookX = THREE.MathUtils.lerp(0, 0, t);
      lookY = THREE.MathUtils.lerp(0, 0.4, t);
      lookZ = THREE.MathUtils.lerp(0, 0, t);
    } else if (p < 0.65) {
      const t = (p - 0.3) / 0.35;
      // Moving toward child astronaut and revealing vast plain
      targetX = THREE.MathUtils.lerp(-0.6, 0.4, t);
      targetY = THREE.MathUtils.lerp(1.6, 1.25, t);
      targetZ = THREE.MathUtils.lerp(5.2, 4.4, t);
      lookX = THREE.MathUtils.lerp(0, 0.8, t);
      lookY = THREE.MathUtils.lerp(0.4, 0.5, t);
      lookZ = THREE.MathUtils.lerp(0, 0, t);
    } else {
      const t = (p - 0.65) / 0.35;
      // Close in on abandoned LRV in warm golden light
      targetX = THREE.MathUtils.lerp(0.4, 1.7, t);
      targetY = THREE.MathUtils.lerp(1.25, 0.95, t);
      targetZ = THREE.MathUtils.lerp(4.4, 3.6, t);
      lookX = THREE.MathUtils.lerp(0.8, 2.2, t);
      lookY = THREE.MathUtils.lerp(0.5, 0.5, t);
      lookZ = THREE.MathUtils.lerp(0, 0, t);
    }

    // Smooth camera lerp for cinematic restraint
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);

    camera.lookAt(lookX, lookY, lookZ);
  });

  return (
    <>
      {/* Harsh Low-Angle Lunar Sunlight (Interstellar warm amber side light) */}
      <directionalLight
        position={[-12, 4.5, 6]}
        intensity={3.8}
        color="#FFFBEB"
      />

      {/* Cool Blue Earthlight Ambient Fill (Airless deep space contrast) */}
      <ambientLight intensity={0.25} color="#60A5FA" />
      <directionalLight position={[4, 6, -10]} intensity={0.4} color="#38BDF8" />

      {/* Distant Earth in the Sky */}
      <GlowingEarth />

      {/* Undulating Lunar Plain & Curved Horizon */}
      <mesh rotation={[-Math.PI / 2.25, 0, 0]} position={[0, -0.4, -4]}>
        <planeGeometry args={[80, 80, 64, 64]} />
        <meshStandardMaterial
          map={moonTexture}
          roughness={0.96}
          metalness={0.04}
        />
      </mesh>

      {/* Distant Mons Hadley Mountain Ridge Silhouette */}
      <group position={[-6, 0.8, -22]}>
        <mesh>
          <coneGeometry args={[14, 4.5, 32]} />
          <meshStandardMaterial color="#1E232D" roughness={0.98} />
        </mesh>
      </group>
      <group position={[10, 0.4, -26]}>
        <mesh>
          <coneGeometry args={[18, 5.2, 32]} />
          <meshStandardMaterial color="#181C24" roughness={0.98} />
        </mesh>
      </group>

      {/* Tiny Child Astronaut Standing on the Surface */}
      <TinyChildAstronaut position={[-0.8, 0, 0.8]} />

      {/* Abandoned Apollo 15 Lunar Roving Vehicle */}
      <Apollo15Rover position={[2.2, 0, 0]} />

      {/* Drifting Lunar Regolith Dust Particles */}
      <LunarDustParticles />
    </>
  );
}

// ─── Existing Apollo 15 Story Text (Strict Sequential Typewriter) ────────────
const STORY_BEATS = [
  {
    phase: "01 // THE HORIZON CONSTRAINT",
    fullText: "On Apollo 11, 12, and 14, astronauts were restricted to how far they could safely walk on foot."
  },
  {
    phase: "02 // THE UNREACHABLE VALLEY",
    fullText: "Towering lunar peaks and deep volcanic canyons remained frustratingly out of reach on the horizon."
  },
  {
    phase: "03 // THE ENGINEERING BREAKTHROUGH",
    fullText: "NASA invented the Lunar Roving Vehicle—the first wheels to carry humanity across another world."
  },
  {
    phase: "04 // THE GENESIS TRAVERSE",
    fullText: "Over three days, Dave Scott and Jim Irwin traversed 27.9 kilometers across Hadley Rille, finding the 4-billion-year-old Genesis Rock."
  },
  {
    phase: "05 // STATION 9A · SILENT MONUMENT",
    fullText: "When their mission ended, they parked LRV-001 at Station 9A. It still rests in the silent vacuum of Hadley."
  }
];

export default function Scene1Moon() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const scrollProgress = useRef(0);

  // Typewriter state
  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        scrollProgress.current = self.progress;

        // Map scroll progress to sequential story beats:
        // Beat 0: 0.05 - 0.22
        // Beat 1: 0.24 - 0.42
        // Beat 2: 0.44 - 0.62
        // Beat 3: 0.64 - 0.82
        // Beat 4: 0.84 - 1.00
        const p = self.progress;
        let index = -1;
        let beatProgress = 0;

        if (p >= 0.04 && p < 0.23) {
          index = 0;
          beatProgress = (p - 0.04) / 0.19;
        } else if (p >= 0.24 && p < 0.43) {
          index = 1;
          beatProgress = (p - 0.24) / 0.19;
        } else if (p >= 0.44 && p < 0.63) {
          index = 2;
          beatProgress = (p - 0.44) / 0.19;
        } else if (p >= 0.64 && p < 0.83) {
          index = 3;
          beatProgress = (p - 0.64) / 0.19;
        } else if (p >= 0.84) {
          index = 4;
          beatProgress = Math.min(1, (p - 0.84) / 0.16);
        }

        if (index === -1) {
          // In-between gap: clean empty black void, previous line faded out completely!
          setIsFadingOut(true);
        } else {
          setActiveBeatIndex(index);
          const full = STORY_BEATS[index].fullText;

          if (reduced) {
            setDisplayedText(full);
            setIsFadingOut(false);
          } else {
            // Typewriter character reveal across the first 65% of the beat, then hold, then fade
            if (beatProgress < 0.75) {
              const charCount = Math.floor((beatProgress / 0.75) * full.length);
              setDisplayedText(full.slice(0, charCount));
              setIsFadingOut(false);
            } else if (beatProgress >= 0.75 && beatProgress < 0.90) {
              setDisplayedText(full);
              setIsFadingOut(false);
            } else {
              // Fade out before next line appears
              setIsFadingOut(true);
            }
          }
        }
      }
    });

    return () => {
      st.kill();
    };
  }, []);

  const activeBeat = STORY_BEATS[activeBeatIndex] || STORY_BEATS[0];

  return (
    <section ref={containerRef} className="scene1-moon-root" aria-label="Scene 1: Moon — Apollo 15 Lunar Roving Vehicle">
      {/* Scroll track: 400vh gives generous pacing and smooth scrub */}
      <div ref={trackRef} className="scene1-moon-track">
        
        {/* Sticky Pinned Stage */}
        <div className="scene1-moon-stage">
          {/* 3D WebGL Canvas */}
          <div className="scene1-moon-canvas-wrap">
            <Canvas
              camera={{ position: [0, 7.5, 12], fov: 45 }}
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
              dpr={[1, 1.5]}
            >
              <MoonScene scrollProgress={scrollProgress} />
            </Canvas>
          </div>

          {/* Film Grain & Vignette */}
          <div className="scene1-moon-grain" />
          <div className="scene1-moon-vignette" />

          {/* Telemetry Header HUD */}
          <header className="scene1-moon-hud-header">
            <div className="scene1-hud-tag">
              SCENE 01 // APOLLO 15 LRV-001
            </div>
            <div className="scene1-hud-meta">
              <div>STATION 9A · HADLEY-APENNINE</div>
              <div style={{ color: 'var(--color-lunar-amber, #E89020)' }}>26.1317° N, 3.6380° E</div>
              <div>DISTANCE: 384,400 KM · VACUUM</div>
            </div>
          </header>

          {/* Story Text (Strict Sequential Typewriter, One Idea at a Time) */}
          <div className="scene1-moon-story-container">
            <div
              className="scene1-story-card"
              style={{
                opacity: isFadingOut ? 0 : 1,
                transform: isFadingOut ? 'translateY(8px)' : 'translateY(0)',
                transition: 'opacity 0.4s ease, transform 0.4s ease'
              }}
            >
              <span className="scene1-story-phase">{activeBeat.phase}</span>
              <p className="scene1-story-text">
                {displayedText}
                <span className="scene1-typewriter-cursor" aria-hidden="true" />
              </p>
            </div>

            {/* Subtle Scroll Cue */}
            <div className="scene1-scroll-cue">
              <span>SCROLL TO TRAVERSE HORIZON</span>
              <span className="scene1-scroll-arrow">↓</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
