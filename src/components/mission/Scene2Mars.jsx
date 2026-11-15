import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Scene2Mars.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Procedural Martian Terrain Texture Generator ───────────────────────────
function createMarsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep iron-oxide red to ochre rust gradient
  const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
  grad.addColorStop(0, '#A64B2A');
  grad.addColorStop(0.5, '#84351B');
  grad.addColorStop(1, '#5C2210');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Surface micro-noise (fine ferric dust)
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 42;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise * 0.6));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise * 0.3));
  }
  ctx.putImageData(imgData, 0, 0);

  // Martian impact craters and bedrock fractures
  for (let i = 0; i < 180; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const r = Math.pow(Math.random(), 3) * 55 + 5;

    // Interior shadow
    const craterGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    craterGrad.addColorStop(0, 'rgba(40, 12, 6, 0.85)');
    craterGrad.addColorStop(0.7, 'rgba(65, 22, 12, 0.7)');
    craterGrad.addColorStop(1, 'rgba(120, 45, 20, 0)');
    ctx.fillStyle = craterGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();

    // Sunlit rim (warm butterscotch highlight)
    ctx.strokeStyle = 'rgba(235, 140, 90, 0.35)';
    ctx.lineWidth = Math.max(1, r * 0.14);
    ctx.beginPath();
    ctx.arc(x, y, r, Math.PI * 0.75, Math.PI * 1.75);
    ctx.stroke();
  }

  // Hematite spherules ("Blueberries") scattered on the bedrock
  ctx.fillStyle = '#2C3E50';
  for (let i = 0; i < 400; i++) {
    const bx = Math.random() * 1024;
    const by = Math.random() * 1024;
    const br = 1.2 + Math.random() * 2.5;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// ─── 3D Opportunity Rover (MER-B) ───────────────────────────────────────────
function OpportunityRover({ position = [0, 0, 0], powerProgress = 1.0 }) {
  const solarPanelRef = useRef();
  const mastRef = useRef();

  // Emissive color dims from active blue-gold down to extinguished black
  const emissiveIntensity = Math.max(0, powerProgress * 0.85);

  return (
    <group position={position} scale={0.72} rotation={[0, 0.45, 0]}>
      {/* Soft Ground Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.2, 0.02, 0.2]}>
        <planeGeometry args={[3.4, 3.8]} />
        <meshBasicMaterial color="#0A0403" transparent opacity={0.8} />
      </mesh>

      {/* Warm Body Chassis (Warm Electronics Box - WEB) */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.3, 0.35, 1.5]} />
        <meshStandardMaterial color="#8B4513" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Triangular Solar Array Deck (Wings) */}
      <group position={[0, 0.7, 0]}>
        {/* Main Central Array */}
        <mesh position={[0, 0, 0]} ref={solarPanelRef}>
          <boxGeometry args={[1.4, 0.05, 1.6]} />
          <meshStandardMaterial
            color="#1E293B"
            metalness={0.9}
            roughness={0.2}
            emissive={powerProgress > 0.1 ? "#2563EB" : "#000000"}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>

        {/* Left Solar Wing Extension */}
        <mesh position={[-0.95, 0, 0.1]} rotation={[0, 0, 0.08]}>
          <boxGeometry args={[0.55, 0.04, 1.3]} />
          <meshStandardMaterial
            color="#1E293B"
            metalness={0.9}
            roughness={0.2}
            emissive={powerProgress > 0.1 ? "#2563EB" : "#000000"}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>

        {/* Right Solar Wing Extension */}
        <mesh position={[0.95, 0, 0.1]} rotation={[0, 0, -0.08]}>
          <boxGeometry args={[0.55, 0.04, 1.3]} />
          <meshStandardMaterial
            color="#1E293B"
            metalness={0.9}
            roughness={0.2}
            emissive={powerProgress > 0.1 ? "#2563EB" : "#000000"}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>

        {/* Photovoltaic Cell Grid Lines */}
        <mesh position={[0, 0.035, 0]}>
          <planeGeometry args={[1.35, 1.55]} />
          <meshBasicMaterial
            color="#38BDF8"
            wireframe={true}
            transparent
            opacity={Math.max(0.05, powerProgress * 0.4)}
          />
        </mesh>
      </group>

      {/* 1.5-Meter Pancam Mast & Stereo Cameras */}
      <group ref={mastRef} position={[0.3, 0.72, 0.45]}>
        {/* Mast Tube */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.1]} />
          <meshStandardMaterial color="#94A3B8" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Stereo Camera Bar */}
        <group position={[0, 1.15, 0]} rotation={[0.1, -0.2, 0]}>
          <mesh>
            <boxGeometry args={[0.38, 0.1, 0.12]} />
            <meshStandardMaterial color="#1E293B" roughness={0.5} />
          </mesh>
          {/* Left Pancam Eye */}
          <mesh position={[-0.14, 0, 0.06]}>
            <cylinderGeometry args={[0.035, 0.035, 0.08]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* Right Pancam Eye */}
          <mesh position={[0.14, 0, 0.06]}>
            <cylinderGeometry args={[0.035, 0.035, 0.08]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      </group>

      {/* High-Gain Steerable Antenna (HGA Dish) */}
      <group position={[-0.35, 0.75, -0.45]} rotation={[0.3, -0.4, 0]}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshStandardMaterial color="#94A3B8" />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.04, 16]} />
          <meshStandardMaterial color="#E2E8F0" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* 6 Cleated Aluminum Wheels with Rocker-Bogie Suspension */}
      {[
        [-0.85, 0.25, 0.75],
        [0.85, 0.25, 0.75],
        [-0.95, 0.25, 0],
        [0.95, 0.25, 0],
        [-0.85, 0.25, -0.75],
        [0.85, 0.25, -0.75]
      ].map((wheelPos, i) => (
        <group key={i} position={wheelPos}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.22, 0.22, 0.16, 16]} />
            <meshStandardMaterial
              color="#A1A1AA"
              metalness={0.8}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}

      {/* Robotic Arm (Instrument Deployment Device) Folded at Front */}
      <mesh position={[0, 0.35, 0.85]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.45]} />
        <meshStandardMaterial color="#64748B" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ─── Dynamic Martian Dust Storm Particle System ─────────────────────────────
function MartianDustStorm({ stormIntensity = 0.2 }) {
  const count = 950;
  const pointsRef = useRef();

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = Math.random() * 5.0; // Sky to surface
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
      spd[i] = 0.02 + Math.random() * 0.04;
    }
    return [pos, spd];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const posArr = pointsRef.current.geometry.attributes.position.array;
    const windSpeed = 0.03 + stormIntensity * 0.18;

    for (let i = 0; i < count; i++) {
      // Horizontal swirling wind vector across Martian plain
      posArr[i * 3] += windSpeed * (1 + speeds[i]);
      posArr[i * 3 + 1] -= (0.004 + stormIntensity * 0.01); // Falling dust

      // Loop particles around boundaries
      if (posArr[i * 3] > 11) posArr[i * 3] = -11;
      if (posArr[i * 3 + 1] < 0) posArr[i * 3 + 1] = 5.0;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055 + stormIntensity * 0.045}
        color={stormIntensity > 0.6 ? "#782E1E" : "#C85632"}
        transparent
        opacity={Math.min(0.85, 0.2 + stormIntensity * 0.65)}
        blending={THREE.NormalBlending}
      />
    </points>
  );
}

// ─── 3D Mars Scene Orchestrator ─────────────────────────────────────────────
function MarsScene({ scrollProgress }) {
  const marsTexture = useMemo(() => createMarsTexture(), []);
  const { camera, scene } = useThree();

  const dirLightRef = useRef();
  const sunDotRef = useRef();

  useFrame(() => {
    const p = scrollProgress.current;

    // 1. Sky & Sun intensity dimming (tau optical depth increases from 0.5 to 10.8)
    // p: 0.00 -> 0.40: Warm butterscotch orange sky
    // p: 0.40 -> 0.70: Deep dusky rust red
    // p: 0.70 -> 1.00: Dark choking twilight (solar panels die)
    const stormIntensity = THREE.MathUtils.clamp((p - 0.2) / 0.7, 0, 1);

    if (dirLightRef.current) {
      // Sunlight dims from 3.6 to near-darkness 0.18
      dirLightRef.current.intensity = THREE.MathUtils.lerp(3.6, 0.18, stormIntensity);
      
      // Light color shifts from warm gold to dull deep rust
      const r = THREE.MathUtils.lerp(1.0, 0.45, stormIntensity);
      const g = THREE.MathUtils.lerp(0.8, 0.18, stormIntensity);
      const b = THREE.MathUtils.lerp(0.6, 0.08, stormIntensity);
      dirLightRef.current.color.setRGB(r, g, b);
    }

    // Obscured Sun in sky dims and fades
    if (sunDotRef.current) {
      sunDotRef.current.material.opacity = Math.max(0.04, 1.0 - stormIntensity * 0.95);
    }

    // Atmospheric Fog thickens
    if (scene.fog) {
      scene.fog.near = THREE.MathUtils.lerp(6, 1.5, stormIntensity);
      scene.fog.far = THREE.MathUtils.lerp(28, 7.5, stormIntensity);
      
      // Fog color shifts from warm dust orange to dark reddish black
      const fogColor = new THREE.Color().setHSL(
        0.04,
        THREE.MathUtils.lerp(0.7, 0.9, stormIntensity),
        THREE.MathUtils.lerp(0.35, 0.04, stormIntensity)
      );
      scene.fog.color.lerp(fogColor, 0.08);
      scene.background = scene.fog.color;
    }

    // 2. Camera Choreography (Slow, quiet drift focused on lonely rover)
    let targetX, targetY, targetZ;
    let lookX, lookY, lookZ;

    if (p < 0.35) {
      const t = p / 0.35;
      // Establishing wide shot of Opportunity small on Perseverance Valley plain
      targetX = THREE.MathUtils.lerp(0, -1.2, t);
      targetY = THREE.MathUtils.lerp(2.8, 1.5, t);
      targetZ = THREE.MathUtils.lerp(7.5, 4.8, t);
      lookX = 0;
      lookY = 0.5;
      lookZ = 0;
    } else if (p < 0.75) {
      const t = (p - 0.35) / 0.4;
      // Moving closer as the storm thickens around her
      targetX = THREE.MathUtils.lerp(-1.2, 0.8, t);
      targetY = THREE.MathUtils.lerp(1.5, 1.1, t);
      targetZ = THREE.MathUtils.lerp(4.8, 3.2, t);
      lookX = 0;
      lookY = 0.55;
      lookZ = 0;
    } else {
      const t = (p - 0.75) / 0.25;
      // Final low angle: silent solitary monument in dark storm
      targetX = THREE.MathUtils.lerp(0.8, 0.5, t);
      targetY = THREE.MathUtils.lerp(1.1, 0.85, t);
      targetZ = THREE.MathUtils.lerp(3.2, 2.8, t);
      lookX = 0;
      lookY = 0.6;
      lookZ = 0;
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
    camera.lookAt(lookX, lookY, lookZ);
  });

  const p = scrollProgress.current;
  const stormIntensity = THREE.MathUtils.clamp((p - 0.2) / 0.7, 0, 1);
  const powerProgress = Math.max(0, 1.0 - stormIntensity * 1.3);

  return (
    <>
      <fog attach="fog" args={['#84351B', 6, 28]} />

      {/* Diminishing Martian Sun */}
      <directionalLight
        ref={dirLightRef}
        position={[-10, 8, 5]}
        intensity={3.6}
        color="#F59E0B"
      />
      <ambientLight intensity={0.2} color="#782E1E" />

      {/* Obscured Pale Sun in the Dust Sky */}
      <mesh ref={sunDotRef} position={[-16, 12, 8]}>
        <sphereGeometry args={[0.65, 16, 16]} />
        <meshBasicMaterial color="#FEF3C7" transparent opacity={0.9} />
      </mesh>

      {/* Vast Martian Bedrock & Dunes of Perseverance Valley */}
      <mesh rotation={[-Math.PI / 2.2, 0, 0]} position={[0, -0.4, -3]}>
        <planeGeometry args={[80, 80, 64, 64]} />
        <meshStandardMaterial
          map={marsTexture}
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>

      {/* Endeavour Crater Rim Ridge in the Background */}
      <group position={[-8, 0.5, -24]}>
        <mesh>
          <coneGeometry args={[16, 3.8, 32]} />
          <meshStandardMaterial color="#4A1E17" roughness={0.98} />
        </mesh>
      </group>
      <group position={[12, 0.8, -26]}>
        <mesh>
          <coneGeometry args={[20, 4.6, 32]} />
          <meshStandardMaterial color="#3E1712" roughness={0.98} />
        </mesh>
      </group>

      {/* Opportunity Rover (MER-B) resting small and alone on the plain */}
      <OpportunityRover position={[0, 0, 0]} powerProgress={powerProgress} />

      {/* Thickening Dust Storm Particle System */}
      <MartianDustStorm stormIntensity={stormIntensity} />
    </>
  );
}

// ─── Existing Opportunity Story Text (Strict Sequential Typewriter) ─────────
const MARS_STORY_BEATS = [
  {
    phase: "01 // THE 90-SOL DESIGN LIFE",
    fullText: "Built to survive just 90 Martian days, Opportunity was expected to drive one kilometer."
  },
  {
    phase: "02 // 14 YEARS ACROSS THE RED PLANET",
    fullText: "Instead, she journeyed for 14 years across 45 kilometers—finding ancient lakebeds, hematite blueberries, and strong evidence of ancient liquid water."
  },
  {
    phase: "03 // THE PLANET-ENCIRCLING STORM",
    fullText: "In June 2018, a catastrophic global dust storm blotted out the Sun, sweeping across the entire planet."
  },
  {
    phase: "04 // THE FINAL TRANSMISSION",
    fullText: "Starved of sunlight, the brave rover sent her final telemetry from Perseverance Valley—popularized as 'My battery is low and it's getting dark' (a poetic interpretation of her final data, not a literal transmission)."
  },
  {
    phase: "05 // PERSEVERANCE VALLEY · SILENT REST",
    fullText: "NASA beamed more than 1,000 commands to wake her. She remains where she fell asleep, resting in the quiet red dust."
  }
];

export default function Scene2Mars() {
  const trackRef = useRef(null);
  const scrollProgress = useRef(0);

  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [powerPercent, setPowerPercent] = useState(100);

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

        const p = self.progress;
        
        // Update power telemetry bar
        const powerVal = Math.max(0, Math.round(100 - p * 115));
        setPowerPercent(powerVal);

        let index = -1;
        let beatProgress = 0;

        if (p >= 0.04 && p < 0.22) {
          index = 0;
          beatProgress = (p - 0.04) / 0.18;
        } else if (p >= 0.23 && p < 0.41) {
          index = 1;
          beatProgress = (p - 0.23) / 0.18;
        } else if (p >= 0.42 && p < 0.60) {
          index = 2;
          beatProgress = (p - 0.42) / 0.18;
        } else if (p >= 0.61 && p < 0.79) {
          index = 3;
          beatProgress = (p - 0.61) / 0.18;
        } else if (p >= 0.80 && p < 0.94) {
          index = 4;
          beatProgress = (p - 0.80) / 0.14;
        } else {
          // Final long pause: silence, everything fades into darkness
          index = -1;
        }

        if (index === -1) {
          setIsFadingOut(true);
        } else {
          setActiveBeatIndex(index);
          const full = MARS_STORY_BEATS[index].fullText;

          if (reduced) {
            setDisplayedText(full);
            setIsFadingOut(false);
          } else {
            if (beatProgress < 0.75) {
              const charCount = Math.floor((beatProgress / 0.75) * full.length);
              setDisplayedText(full.slice(0, charCount));
              setIsFadingOut(false);
            } else if (beatProgress >= 0.75 && beatProgress < 0.90) {
              setDisplayedText(full);
              setIsFadingOut(false);
            } else {
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

  const activeBeat = MARS_STORY_BEATS[activeBeatIndex] || MARS_STORY_BEATS[0];

  return (
    <section className="scene2-mars-root" aria-label="Scene 2: Mars — Opportunity Rover MER-B">
      <div ref={trackRef} className="scene2-mars-track">
        
        {/* Sticky Pinned Stage */}
        <div className="scene2-mars-stage">
          {/* 3D WebGL Canvas */}
          <div className="scene2-mars-canvas-wrap">
            <Canvas
              camera={{ position: [0, 2.8, 7.5], fov: 45 }}
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
              dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)]}
            >
              <MarsScene scrollProgress={scrollProgress} />
            </Canvas>
          </div>

          {/* Film Grain, Dust Fog & Vignette */}
          <div className="scene2-mars-grain" />
          <div className="scene2-mars-dust-overlay" />
          <div className="scene2-mars-vignette" />

          {/* Telemetry Header HUD */}
          <header className="scene2-mars-hud-header">
            <div>
              <div className="scene2-hud-tag">
                SCENE 02 // OPPORTUNITY MER-B
              </div>
              <div style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)', marginTop: '3px' }}>
                <span style={{ color: 'var(--color-telemetry-silver)' }}>ARCHIVE: </span>
                <a
                  href="https://science.nasa.gov/mission/mer/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--color-mars-rust, #E07A5F)', textDecoration: 'underline' }}
                >
                  NASA MER Mission Page ↗
                </a>
              </div>
              <div className="scene2-power-hud" style={{ marginTop: '4px' }}>
                <span style={{ fontSize: '0.625rem', color: 'var(--color-telemetry-silver)' }}>SOLAR ARRAY:</span>
                <div className="scene2-power-bar">
                  <div
                    className="scene2-power-fill"
                    style={{
                      width: `${powerPercent}%`,
                      backgroundColor: powerPercent > 20 ? 'var(--color-mars-rust, #E07A5F)' : '#EF4444'
                    }}
                  />
                </div>
                <span style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)', color: powerPercent > 0 ? '#F4F6F8' : '#EF4444' }}>
                  {powerPercent}%
                </span>
              </div>
            </div>

            <div className="scene2-hud-meta">
              <div>PERSEVERANCE VALLEY · ENDEAVOUR RIM</div>
              <div style={{ color: 'var(--color-mars-rust, #E07A5F)' }}>1.9483° S, 354.4742° E</div>
              <div>SOL 5,111 · GLOBAL DUST STORM</div>
            </div>
          </header>

          {/* Story Text (Strict Sequential Typewriter, One Idea at a Time) */}
          <div className="scene2-mars-story-container">
            <div
              className="scene2-story-card"
              style={{
                opacity: isFadingOut ? 0 : 1,
                transform: isFadingOut ? 'translateY(8px)' : 'translateY(0)',
                transition: 'opacity 0.4s ease, transform 0.4s ease'
              }}
            >
              <span className="scene2-story-phase">{activeBeat.phase}</span>
              <p className="scene2-story-text">
                <span aria-hidden="true">{displayedText}</span>
                <span className="visually-hidden">{activeBeat.fullText}</span>
                <span className="scene2-typewriter-cursor" aria-hidden="true" />
              </p>
            </div>

            {/* Subtle Scroll Cue */}
            <div className="scene2-scroll-cue">
              <span>SCROLL TO DESCEND INTO STORM</span>
              <span className="scene2-scroll-arrow">↓</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
