import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * ChildAstronaut.jsx
 *
 * A small child astronaut companion floating peacefully against the immense universe.
 * Inspired by Interstellar: restrained, quiet, evoking cosmic awe and wonder.
 * Styled with elegant vector line work, soft visor reflection, and gentle microgravity drift.
 */
export default function ChildAstronaut({ style = {} }) {
  const astronautRef = useRef(null);
  const tetherRef = useRef(null);
  const beaconRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const el = astronautRef.current;
    if (!el) return;

    // 1. Slow, microgravity orbital float (subtle 7-second sine wave)
    const floatAnim = gsap.to(el, {
      y: -14,
      rotation: 3,
      duration: 6.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // 2. Slow horizontal micro-drift
    const driftAnim = gsap.to(el, {
      x: 8,
      duration: 8.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // 3. Life-support telemetry pulse (calm amber heartbeat)
    let beaconAnim = null;
    if (beaconRef.current) {
      beaconAnim = gsap.to(beaconRef.current, {
        opacity: 0.25,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }

    return () => {
      floatAnim.kill();
      driftAnim.kill();
      if (beaconAnim) beaconAnim.kill();
    };
  }, []);

  return (
    <div
      ref={astronautRef}
      className="child-astronaut-wrapper"
      style={{
        position: 'fixed',
        right: 'clamp(20px, 5vw, 64px)',
        bottom: 'clamp(80px, 12vh, 140px)',
        zIndex: 40,
        pointerEvents: 'none',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.12))',
        opacity: 0.9,
        transition: 'opacity 0.6s ease',
        ...style
      }}
      aria-hidden="true"
    >
      {/* Astronaut Vector Silhouette & Helmet */}
      <svg
        width="62"
        height="78"
        viewBox="0 0 62 78"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Helmet Visor Gold-Amber Gradient */}
          <radialGradient id="visorGold" cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#451A03" />
          </radialGradient>

          {/* Visor Specular Reflection */}
          <linearGradient id="visorSpecular" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Suit Shading Gradient */}
          <linearGradient id="suitShade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4F6F8" />
            <stop offset="70%" stopColor="#D1D5DB" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </linearGradient>

          {/* Backpack Shadow */}
          <linearGradient id="packGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1F2937" />
          </linearGradient>
        </defs>

        {/* Life-Support Backpack (PLSS) */}
        <rect x="11" y="24" width="12" height="30" rx="3" fill="url(#packGrad)" stroke="#4B5563" strokeWidth="1" />
        {/* Antenna */}
        <line x1="14" y1="24" x2="14" y2="14" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
        <circle x1="14" y1="14" cx="14" cy="14" r="1.5" fill="#E89020" />

        {/* Floating Tether Line drifting into space */}
        <path
          ref={tetherRef}
          d="M 12 36 C 4 38, -6 34, -14 42 C -22 50, -30 46, -42 54"
          stroke="rgba(168, 179, 194, 0.35)"
          strokeWidth="1.2"
          strokeDasharray="2 3"
          fill="none"
        />

        {/* Suit Legs & Soft Boots */}
        <path d="M 23 52 L 21 68 Q 20 73 24 73 L 28 73 Q 30 73 30 68 L 30 52" fill="url(#suitShade)" stroke="#4B5563" strokeWidth="0.8" />
        <path d="M 33 52 L 35 68 Q 36 73 40 73 L 44 73 Q 46 73 45 68 L 41 52" fill="url(#suitShade)" stroke="#4B5563" strokeWidth="0.8" />
        {/* Boot Soles */}
        <path d="M 19 72 L 28 72" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
        <path d="M 36 72 L 45 72" stroke="#374151" strokeWidth="2" strokeLinecap="round" />

        {/* Suit Torso */}
        <rect x="20" y="26" width="23" height="28" rx="6" fill="url(#suitShade)" stroke="#4B5563" strokeWidth="0.8" />
        
        {/* Chest Telemetry Pack */}
        <rect x="24" y="31" width="15" height="11" rx="2" fill="#1F2937" stroke="#374151" strokeWidth="0.7" />
        {/* Telemetry Status Dots */}
        <circle cx="27" cy="36" r="1.2" fill="#10B981" />
        <circle cx="31" cy="36" r="1.2" fill="#38BDF8" />
        <circle ref={beaconRef} cx="35" cy="36" r="1.2" fill="#F59E0B" />

        {/* Arms (Gentle, weightless float posture) */}
        {/* Left Arm reaching forward slightly */}
        <path d="M 21 28 Q 13 34 16 43 Q 17 46 20 46" fill="none" stroke="url(#suitShade)" strokeWidth="5.5" strokeLinecap="round" />
        {/* Right Arm raised looking up */}
        <path d="M 42 28 Q 50 33 49 42 Q 48 45 45 46" fill="none" stroke="url(#suitShade)" strokeWidth="5.5" strokeLinecap="round" />

        {/* Suit Helmet Base Ring */}
        <ellipse cx="31.5" cy="22" rx="14" ry="4" fill="#374151" />

        {/* Large Rounded Helmet */}
        <circle cx="31.5" cy="18" r="14" fill="url(#suitShade)" stroke="#6B7280" strokeWidth="0.8" />

        {/* Golden Visor (Reflective dome) */}
        <ellipse cx="32" cy="18.5" rx="10.5" ry="9" fill="url(#visorGold)" />
        {/* Visor Glass Highlight Arc */}
        <ellipse cx="30" cy="16" rx="7" ry="5" fill="url(#visorSpecular)" opacity="0.8" />
        {/* Star Reflection inside Visor */}
        <circle cx="35" cy="17" r="0.75" fill="#FFFFFF" opacity="0.9" />
        <circle cx="28" cy="21" r="0.5" fill="#FFFFFF" opacity="0.6" />
      </svg>

      {/* Understated Mission Telemetry Stamp */}
      <div
        style={{
          marginTop: '6px',
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '0.625rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-telemetry-silver, #A8B3C2)',
          opacity: 0.65,
          whiteSpace: 'nowrap',
          textShadow: '0 1px 4px rgba(0,0,0,0.8)'
        }}
      >
        EVA-01 · ORBITAL WATCHER
      </div>
    </div>
  );
}
