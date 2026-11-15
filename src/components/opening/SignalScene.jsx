import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { DrawSVGPlugin, SplitText } from 'gsap/all';
import { ArrowDown, Radio } from 'lucide-react';
import { MOTION_DURATION, MOTION_EASE } from '../../styles/motion.js';

// ─── Real Photo Moon with GSAP float animation ───────────────────────────────
function RotatingMoon() {
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    // Gentle slow rotation (slight tilt to show depth)
    gsap.to(el, {
      rotate: 360,
      duration: 60,
      repeat: -1,
      ease: 'none',
    });

    // Gentle vertical float
    gsap.to(el, {
      y: -22,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }, []);

  return (
    <div
      aria-hidden="true"
      className="signal-rotating-moon"
      style={{
        position: 'absolute',
        right: 'clamp(20px, 8vw, 170px)',
        top: '50%',
        transform: 'translateY(-52%)',
        width: 'clamp(180px, 28vw, 480px)',
        height: 'clamp(180px, 28vw, 480px)',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {/* The real moon photo */}
      <div
        ref={wrapperRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <img
          src="/assets/moon-hero-isolated.png"
          alt="Crescent Moon"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </div>
    </div>
  );
}

gsap.registerPlugin(DrawSVGPlugin, SplitText);

export default function SignalScene({ onEnter }) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const arc1Ref = useRef(null);
  const arc2Ref = useRef(null);
  const arc3Ref = useRef(null);
  const pulseDotRef = useRef(null);
  const bgImageRef = useRef(null);
  const headlineRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let splitInstance = null;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Slow amber pulse on the carrier lock indicator
      if (pulseDotRef.current) {
        gsap.to(pulseDotRef.current, {
          opacity: 0.35,
          scale: 0.85,
          repeat: -1,
          yoyo: true,
          duration: 1.6,
          ease: MOTION_EASE.smooth
        });
      }

      // 2. SplitText on headline
      if (headlineRef.current) {
        splitInstance = new SplitText(headlineRef.current, { type: 'words,chars' });
      }

      // 3. Main cinematic reveal timeline
      const tl = gsap.timeline({ defaults: { ease: MOTION_EASE.editorial } });

      // Background image removed — no ambient fade-in needed

      // Telemetry bar reveal
      tl.fromTo('.signal-telemetry-bar',
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: MOTION_DURATION.medium },
        0.2
      );

      // SVG Concentric Carrier Arcs and Waveform (DrawSVG)
      const svgElements = [arc1Ref.current, arc2Ref.current, arc3Ref.current, pathRef.current].filter(Boolean);
      if (svgElements.length > 0) {
        tl.fromTo(svgElements,
          { drawSVG: '0%' },
          { drawSVG: '100%', duration: 1.4, stagger: 0.15, ease: 'power2.inOut' },
          0.3
        );
      }

      // SplitText headline reveal
      if (splitInstance && splitInstance.words) {
        tl.from(splitInstance.words,
          {
            opacity: 0,
            y: 18,
            stagger: 0.04,
            duration: 0.8,
            ease: MOTION_EASE.editorial
          },
          0.7
        );
      }

      // Body copy fade up
      tl.fromTo('.signal-body',
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: MOTION_DURATION.medium },
        1.1
      );

      // CTA button reveal
      tl.fromTo('.signal-cta',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: MOTION_DURATION.medium },
        1.3
      );

      // Footprint metrics bar
      tl.fromTo('.signal-footprint',
        { opacity: 0 },
        { opacity: 1, duration: MOTION_DURATION.slow },
        1.5
      );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Instant static layout for accessibility
      // Background image removed
      gsap.set(['.signal-telemetry-bar', '.signal-headline', '.signal-body', '.signal-cta', '.signal-footprint'], {
        opacity: 1,
        y: 0
      });
      const svgElements = [arc1Ref.current, arc2Ref.current, arc3Ref.current, pathRef.current].filter(Boolean);
      if (svgElements.length > 0) {
        gsap.set(svgElements, { drawSVG: '100%' });
      }
    });

    return () => {
      if (splitInstance) splitInstance.revert();
      mm.revert();
    };
  }, []);

  return (
    <section 
      ref={containerRef}
      id="signal-scene"
      aria-label="The Signal: Mission Introduction"
      style={{
        minHeight: '100vh',
        minHeight: '100svh',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(24px, 4vw, 64px) var(--space-md)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background: clean — dusty deep-field image removed; 3D starfield shows through */}

      {/* Top Telemetry Header */}
      <div 
        className="signal-telemetry-bar"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-sm)',
          borderBottom: '1px solid var(--color-surface-border-subtle)',
          paddingBottom: 'var(--space-sm)'
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span 
            ref={pulseDotRef}
            style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-amber-bright)', display: 'inline-block' }} 
          />
          <span className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Radio size={14} style={{ color: 'var(--color-amber-bright)' }} aria-hidden="true" />
            CARRIER DETECTED · 2295.000 MHz (S-BAND TELEMETRY)
          </span>
        </div>
        <div className="font-telemetry" style={{ color: 'var(--color-muted-slate)' }}>
          DEEP SPACE NETWORK · GOLDSTONE / MADRID / CANBERRA
        </div>
      </div>

      {/* Rotating Moon — right-side decorative element */}
      <RotatingMoon />

      {/* Center Cinematic Decryption Scene */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: '880px', margin: 'auto 0', padding: 'var(--space-xl) 0' }}>
        
        {/* Code-Made Telemetry Arcs & Frequency Waveform (DrawSVG) */}
        <div style={{ width: '100%', maxWidth: '440px', height: '54px', marginBottom: 'var(--space-lg)' }}>
          <svg viewBox="0 0 440 54" fill="none" style={{ width: '100%', height: '100%' }} aria-hidden="true">
            {/* Concentric Signal Carrier Arcs */}
            <path
              ref={arc1Ref}
              d="M 16 46 A 32 32 0 0 1 16 8"
              stroke="rgba(232, 144, 32, 0.35)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              ref={arc2Ref}
              d="M 28 40 A 22 22 0 0 1 28 14"
              stroke="rgba(232, 144, 32, 0.6)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              ref={arc3Ref}
              d="M 40 34 A 12 12 0 0 1 40 20"
              stroke="var(--color-amber-bright)"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
            {/* Carrier Radio Waveform */}
            <path 
              ref={pathRef}
              d="M 54 27 H 140 Q 152 27 158 11 T 170 43 T 182 7 T 194 47 T 206 27 H 440" 
              stroke="var(--color-lunar-amber)" 
              strokeWidth="1.75" 
            />
          </svg>
        </div>

        {/* Challenge Copy Beat 1 (SplitText Animated) */}
        <h1 
          ref={headlineRef}
          className="signal-headline text-display-1" 
          style={{ marginBottom: 'var(--space-md)' }}
        >
          Some machines never made it home.
        </h1>

        {/* Challenge Copy Beat 2 */}
        <p 
          className="signal-body text-lead" 
          style={{
            color: 'var(--color-telemetry-silver)',
            maxWidth: '720px',
            lineHeight: 1.7,
            marginBottom: 'var(--space-2xl)'
          }}
        >
          Left in the regolith of Hadley Rille. Silenced under a planet-wide Martian dust storm. Operating past the edge of the Sun's realm. Yet across millions of miles, what they discovered changed how we understand the universe.
        </p>

        {/* Call to Action: ENTER THE MISSION */}
        <div className="signal-cta">
          <button
            onClick={onEnter}
            autoFocus
            aria-label="Enter The Unfinished Mission and choose a world"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              padding: '16px 30px',
              backgroundColor: 'var(--color-lunar-amber)',
              borderRadius: 'var(--radius-sm)',
              color: '#0B0D11',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 4px 20px rgba(232, 144, 32, 0.25)',
              transition: 'background-color var(--transition-fast), transform var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-amber-bright)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-lunar-amber)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span>ENTER THE MISSION</span>
            <ArrowDown size={18} aria-hidden="true" />
          </button>
        </div>

      </div>

      {/* Astronomical Traversal Footprint Indicator */}
      <div 
        className="signal-footprint"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--space-md)',
          borderTop: '1px solid var(--color-surface-border-subtle)',
          paddingTop: 'var(--space-md)',
          fontSize: '0.8125rem'
        }}
      >
        <div>
          <span style={{ color: 'var(--color-telemetry-silver)' }}>DESTINATION 01 · </span>
          <strong style={{ color: 'var(--color-regolith-white)' }}>THE MOON</strong>
          <div className="font-telemetry" style={{ color: 'var(--color-muted-slate)' }}>384,400 KM · 1.3 SECONDS</div>
        </div>
        <div>
          <span style={{ color: 'var(--color-telemetry-silver)' }}>DESTINATION 02 · </span>
          <strong style={{ color: 'var(--color-regolith-white)' }}>MARS</strong>
          <div className="font-telemetry" style={{ color: 'var(--color-muted-slate)' }}>~225,000,000 KM · ~12.5 MINUTES</div>
        </div>
        <div>
          <span style={{ color: 'var(--color-telemetry-silver)' }}>DESTINATION 03 · </span>
          <strong style={{ color: 'var(--color-regolith-white)' }}>DEEP SPACE</strong>
          <div className="font-telemetry" style={{ color: 'var(--color-muted-slate)' }}>25.9 BILLION KM · 1.0 LIGHT-DAY</div>
        </div>
      </div>

    </section>
  );
}
