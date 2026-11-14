import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Scene3Voyager.css';

gsap.registerPlugin(ScrollTrigger);

// ─── 3D Multi-Layered Starfield with Gentle Depth Parallax (No Fast Warp) ───
function DeepSpaceStarfield({ scrollProgress }) {
  const fgCount = 280;
  const bgCount = 2600;

  const fgRef = useRef();
  const bgRef = useRef();

  // Foreground stars
  const [fgPositions] = useMemo(() => {
    const pos = new Float32Array(fgCount * 3);
    for (let i = 0; i < fgCount; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return [pos];
  }, [fgCount]);

  // Deep background stars
  const [bgPositions] = useMemo(() => {
    const pos = new Float32Array(bgCount * 3);
    for (let i = 0; i < bgCount; i++) {
      const r = 60 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return [pos];
  }, [bgCount]);

  useFrame((_, delta) => {
    const p = scrollProgress.current;

    // Gentle, restrained drift along Z-axis (slow glide)
    if (fgRef.current) {
      fgRef.current.position.z = p * 12;
      fgRef.current.rotation.y += delta * 0.008;
    }
    if (bgRef.current) {
      bgRef.current.rotation.y += delta * 0.002;
    }
  });

  return (
    <group>
      {/* Foreground Stars with Gentle Parallax */}
      <points ref={fgRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fgPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.065}
          color="#E2E8F0"
          transparent
          opacity={0.7}
        />
      </points>

      {/* Deep Background Stars */}
      <points ref={bgRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bgPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#CBD5E1"
          transparent
          opacity={0.5}
        />
      </points>
    </group>
  );
}

// ─── 3D Voyager 1 Spacecraft Model ──────────────────────────────────────────
function VoyagerSpacecraft({ scrollProgress }) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const p = scrollProgress.current;

    // Voyager drifts slowly into the cosmic distance:
    // Starts at [0, 0, 1.8] with scale 0.95
    // Recedes toward [1.5, 0.8, -18] with scale 0.08
    const driftT = THREE.MathUtils.clamp(p / 0.82, 0, 1);

    const x = THREE.MathUtils.lerp(0.2, 2.2, driftT);
    const y = THREE.MathUtils.lerp(0.1, 1.4, driftT);
    const z = THREE.MathUtils.lerp(1.8, -20.0, driftT);
    const s = THREE.MathUtils.lerp(0.95, 0.04, driftT);

    groupRef.current.position.set(x, y, z);
    groupRef.current.scale.set(s, s, s);

    // Very slow, majestic attitude drift
    groupRef.current.rotation.y += delta * 0.04;
    groupRef.current.rotation.x = 0.2 + Math.sin(Date.now() * 0.0003) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0.2, 0.1, 1.8]} scale={0.95}>
      {/* 3.7-Meter Parabolic High-Gain Dish (Pointed toward Earth / Camera) */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.85, 0.55, 32, 1, true]} />
        <meshStandardMaterial
          color="#F8FAFC"
          roughness={0.3}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Feed Horn Support Struts (Tripod) */}
      <group position={[0, -0.6, 0]}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#E2E8F0" />
        </mesh>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.7]} />
          <meshBasicMaterial color="#94A3B8" />
        </mesh>
      </group>

      {/* Decagonal Equipment Bus (Body with Golden Kapton Thermal Foil) */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.5, 10]} />
        <meshStandardMaterial
          color="#D97706"
          metalness={0.85}
          roughness={0.3}
          emissive="#78350F"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* The Golden Record (Mounted on the Bus Flank) */}
      <group position={[0.92, 0.45, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.34, 0.34, 0.03, 32]} />
          <meshStandardMaterial
            color="#F59E0B"
            metalness={0.95}
            roughness={0.15}
            emissive="#B45309"
            emissiveIntensity={0.3}
          />
        </mesh>
        {/* Stylus / Cartridge Detail */}
        <mesh position={[0.18, 0, 0.03]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[0.04, 0.22, 0.01]} />
          <meshBasicMaterial color="#FEF3C7" />
        </mesh>
      </group>

      {/* 13-Meter Magnetometer (MAG) Boom */}
      <group position={[-0.8, 0.45, -0.3]} rotation={[0.2, -0.8, 0]}>
        <mesh position={[0, 0, -2.4]}>
          <cylinderGeometry args={[0.02, 0.02, 4.8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#64748B" roughness={0.5} />
        </mesh>
        {/* MAG Sensor Canister */}
        <mesh position={[0, 0, -4.8]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.7} />
        </mesh>
      </group>

      {/* Radioisotope Thermoelectric Generators (RTGs - Nuclear Power) */}
      <group position={[0.7, 0.45, -0.7]} rotation={[-0.3, 0.6, 0]}>
        <mesh position={[0, 0, -1.1]}>
          <boxGeometry args={[0.08, 0.08, 2.2]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        {/* 3 Plutonium-238 RTG Canisters with Faint Thermal Glow */}
        {[0, 0.35, 0.7].map((offsetZ, i) => (
          <mesh key={i} position={[0, 0.12, -0.6 - offsetZ]}>
            <cylinderGeometry args={[0.12, 0.12, 0.32, 16]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial
              color="#334155"
              metalness={0.8}
              roughness={0.4}
              emissive="#EA580C"
              emissiveIntensity={0.35}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ─── 3D Deep Space Scene ────────────────────────────────────────────────────
function VoyagerScene({ scrollProgress }) {
  const { camera } = useThree();

  useFrame(() => {
    const p = scrollProgress.current;

    // Slow, stately camera drift forward
    const camZ = THREE.MathUtils.lerp(6.8, 3.2, p);
    const camY = THREE.MathUtils.lerp(0.8, 0.2, p);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.15} color="#94A3B8" />

      {/* Gentle Distant Star Fill Light */}
      <directionalLight position={[6, 4, 10]} intensity={1.8} color="#FEF3C7" />
      <directionalLight position={[-8, -4, -6]} intensity={0.4} color="#38BDF8" />

      {/* Multi-layered Starfield with Parallax */}
      <DeepSpaceStarfield scrollProgress={scrollProgress} />

      {/* Voyager 1 Spacecraft drifting into distance */}
      <VoyagerSpacecraft scrollProgress={scrollProgress} />
    </>
  );
}

// ─── Story Beats (Sequential Typewriter) ────────────────────────────────────
const VOYAGER_STORY_BEATS = [
  {
    phase: "01 // THE LAUNCH OF 1977",
    fullText: "In 1977, Voyager 1 lifted off from Cape Canaveral to explore Jupiter and Saturn, carrying our voice into the unknown."
  },
  {
    phase: "02 // CROSSING THE HELIOPAUSE",
    fullText: "On 25 August 2012, she crossed the heliopause—leaving the realm of our Sun forever to enter the interstellar ocean."
  },
  {
    phase: "03 // ACTIVE & ALIVE · NEVER ABANDONED",
    fullText: "She is not abandoned. She is not dead. Operating on nuclear decay 25.9 billion kilometers away, she still speaks to Earth."
  },
  {
    phase: "04 // THE LIGHT-DAY MILESTONE",
    fullText: "On 18 November 2026, her radio telemetry will take a full light-day—24 hours—to cross the gulf of space back home."
  }
];

export default function Scene3Voyager({ onExploreAgain, onOpenSources }) {
  const trackRef = useRef(null);
  const scrollProgress = useRef(0);

  const [activeBeatIndex, setActiveBeatIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showPaleDot, setShowPaleDot] = useState(false);

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

        // Pale Blue Dot finale trigger (progress >= 0.82)
        if (p >= 0.82) {
          setShowPaleDot(true);
        } else {
          setShowPaleDot(false);
        }

        let index = -1;
        let beatProgress = 0;

        if (p >= 0.05 && p < 0.22) {
          index = 0;
          beatProgress = (p - 0.05) / 0.17;
        } else if (p >= 0.24 && p < 0.42) {
          index = 1;
          beatProgress = (p - 0.24) / 0.18;
        } else if (p >= 0.44 && p < 0.62) {
          index = 2;
          beatProgress = (p - 0.44) / 0.18;
        } else if (p >= 0.64 && p < 0.80) {
          index = 3;
          beatProgress = (p - 0.64) / 0.16;
        } else {
          index = -1;
        }

        if (index === -1) {
          setIsFadingOut(true);
        } else {
          setActiveBeatIndex(index);
          const full = VOYAGER_STORY_BEATS[index].fullText;

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

  const activeBeat = VOYAGER_STORY_BEATS[activeBeatIndex] || VOYAGER_STORY_BEATS[0];

  return (
    <section className="scene3-voyager-root" aria-label="Scene 3: Deep Space — Voyager 1 & The Pale Blue Dot Finale">
      <div ref={trackRef} className="scene3-voyager-track">
        
        {/* Sticky Pinned Stage */}
        <div className="scene3-voyager-stage">
          {/* 3D WebGL Canvas */}
          <div className="scene3-voyager-canvas-wrap">
            <Canvas
              camera={{ position: [0, 0.8, 6.8], fov: 45 }}
              gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
              dpr={[1, 1.5]}
            >
              <VoyagerScene scrollProgress={scrollProgress} />
            </Canvas>
          </div>

          {/* Film Grain & Vignette */}
          <div className="scene3-voyager-grain" />
          <div className="scene3-voyager-vignette" />

          {/* Telemetry Header HUD */}
          <header className="scene3-voyager-hud-header">
            <div>
              <div className="scene3-hud-tag">
                SCENE 03 // VOYAGER 1 · INTERSTELLAR
              </div>
              <div style={{ fontSize: '0.625rem', fontFamily: 'var(--font-mono)', color: 'var(--color-telemetry-silver)', marginTop: '4px' }}>
                SPEED: 38,000 MPH (17 KM/S) · VIM ACTIVE
              </div>
            </div>

            <div className="scene3-hud-meta">
              <div>INTERSTELLAR OCEAN · OPHIUCHUS</div>
              <div style={{ color: 'var(--color-deep-gold, #D97706)' }}>25.902 BILLION KM · 173.1 AU</div>
              <div>RADIO DELAY: 24.0 LIGHT-HOURS</div>
            </div>
          </header>

          {/* Story Text (One Idea at a Time) */}
          {!showPaleDot && (
            <div className="scene3-voyager-story-container">
              <div
                className="scene3-story-card"
                style={{
                  opacity: isFadingOut ? 0 : 1,
                  transform: isFadingOut ? 'translateY(8px)' : 'translateY(0)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease'
                }}
              >
                <span className="scene3-story-phase">{activeBeat.phase}</span>
                <p className="scene3-story-text">
                  {displayedText}
                  <span className="scene3-typewriter-cursor" aria-hidden="true" />
                </p>
              </div>

              {/* Scroll Cue */}
              <div className="scene3-scroll-cue">
                <span>SCROLL INTO THE INTERSTELLAR VOID</span>
                <span className="scene3-scroll-arrow">↓</span>
              </div>
            </div>
          )}

          {/* ── The Quiet "Pale Blue Dot" Moment ── */}
          {showPaleDot && (
            <div className="scene3-pale-dot-overlay" style={{ opacity: showPaleDot ? 1 : 0 }}>
              {/* Slanted Sunbeam Ray */}
              <div className="scene3-sunbeam" />

              {/* The Pale Blue Dot (Earth) */}
              <div className="scene3-pale-dot" />
              <div className="scene3-pale-dot-label">EARTH · 6 BILLION KILOMETERS</div>

              {/* Contemplative Closing Quote */}
              <div style={{ maxWidth: '780px', marginTop: '2.5rem', padding: '0 2rem', textAlign: 'center' }}>
                <p
                  style={{
                    fontFamily: "var(--font-editorial, 'Newsreader', Georgia, serif)",
                    fontWeight: 300,
                    fontSize: 'clamp(1.2rem, 2.4vw, 1.8rem)',
                    lineHeight: 1.5,
                    color: '#F4F6F8',
                    letterSpacing: '0.04em',
                    marginBottom: '1rem',
                    textShadow: '0 0 20px rgba(56, 189, 248, 0.4)'
                  }}
                >
                  "Look again at that dot. That's here. That's home. That's us."
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'Space Grotesk', monospace)",
                    fontSize: '0.75rem',
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'var(--color-telemetry-silver, #A8B3C2)',
                    display: 'block',
                    marginBottom: '1.5rem'
                  }}
                >
                  — Carl Sagan · Pale Blue Dot (1994)
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-editorial, 'Newsreader', Georgia, serif)",
                    fontWeight: 300,
                    fontSize: '1.05rem',
                    color: 'rgba(244, 246, 248, 0.85)',
                    letterSpacing: '0.05em',
                    lineHeight: 1.6
                  }}
                >
                  Every machine we left behind was a promise: we will never stop reaching for the stars.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ── Grand Finale Section: Explore Again & Credits ── */}
      <footer className="scene3-finale-section">
        <div className="scene3-finale-container">
          {/* Calm Call-To-Action */}
          <div>
            <button
              onClick={() => {
                if (onExploreAgain) {
                  onExploreAgain();
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="scene3-cta-btn"
              aria-label="Restart cinematic exploration from prologue"
            >
              EXPLORE AGAIN ↺
            </button>
          </div>

          {/* Credits & Verified NASA Data Sources Section */}
          <div
            style={{
              backgroundColor: 'var(--color-surface-charcoal)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(1.5rem, 4vw, 3rem)',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem', borderBottom: '1px solid var(--color-surface-border-subtle)', paddingBottom: '1rem' }}>
              <span className="badge-tag badge-tag--amber">
                CREDITS & VERIFIED DATA PROVENANCE
              </span>
              <span className="badge-tag" style={{ color: 'var(--color-telemetry-silver)' }}>
                NASA SPACE APPS CHALLENGE 2026
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              {/* Mission 01 Credits */}
              <div>
                <h4 style={{ fontSize: '0.8125rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-lunar-amber)', marginBottom: '8px' }}>
                  01 // Apollo 15 LRV-001
                </h4>
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--color-telemetry-silver)' }}>
                  Primary Sources: NASA Technical Note TN D-7469 (Lunar Roving Vehicle Navigation System Performance), Apollo 15 Flight Evaluation Report MSC-05161. LROC Station 9A Coordinates: 26.13174°N, 3.63803°E.
                </p>
              </div>

              {/* Mission 02 Credits */}
              <div>
                <h4 style={{ fontSize: '0.8125rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-mars-rust)', marginBottom: '8px' }}>
                  02 // Opportunity MER-B
                </h4>
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--color-telemetry-silver)' }}>
                  Primary Sources: NASA JPL MER Pancam Tau Datasets, Opportunity 5,111-Sol Traverse Log. Mineral Fingerprints: Athena APXS, Mössbauer & Mini-TES Science Dossiers (Neutral water non-biological disclaimer).
                </p>
              </div>

              {/* Mission 03 Credits */}
              <div>
                <h4 style={{ fontSize: '0.8125rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--color-deep-gold)', marginBottom: '8px' }}>
                  03 // Voyager 1 Interstellar
                </h4>
                <p style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--color-telemetry-silver)' }}>
                  Primary Sources: NASA JPL Deep Space Network Telecommunications, Voyager Interstellar Mission (VIM). Distance: 25.902 Billion km (~173.1 AU). Heliopause crossing verified on 25 August 2012.
                </p>
              </div>
            </div>

            {/* Educational Attribution & Sources Modal Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid var(--color-surface-border-subtle)', paddingTop: '1.2rem', fontSize: '0.75rem', color: 'var(--color-muted-slate)' }}>
              <div>
                Built for students aged 8–14 · All planetary imagery: NASA Public Domain Archives.
              </div>
              {onOpenSources && (
                <button
                  onClick={onOpenSources}
                  className="badge-tag badge-tag--amber"
                  style={{ cursor: 'pointer' }}
                >
                  View Full NASA Dossier & Disclaimers ↗
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
}
