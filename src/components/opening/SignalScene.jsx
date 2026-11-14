import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { MOTION_DURATION, MOTION_EASE } from '../../styles/motion.js';

export default function SignalScene({ onEnter }) {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const pulseDotRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Accessible matchMedia context
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Slow amber pulse on the carrier status dot
      if (pulseDotRef.current) {
        gsap.to(pulseDotRef.current, {
          opacity: 0.35,
          scale: 0.85,
          repeat: -1,
          yoyo: true,
          duration: 1.4,
          ease: MOTION_EASE.smooth
        });
      }

      // 2. SVG waveform self-drawing setup
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength ? pathRef.current.getTotalLength() : 450;
        gsap.set(pathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length
        });
      }

      // 3. Staggered reveal timeline
      const tl = gsap.timeline({ defaults: { ease: MOTION_EASE.editorial } });

      tl.fromTo('.signal-telemetry-bar', 
        { opacity: 0, y: -6 }, 
        { opacity: 1, y: 0, duration: MOTION_DURATION.medium }
      )
      .to(pathRef.current, {
        strokeDashoffset: 0,
        duration: MOTION_DURATION.deliberate,
        ease: 'power1.inOut'
      }, '-=0.1')
      .fromTo('.signal-headline', 
        { opacity: 0, y: 16 }, 
        { opacity: 1, y: 0, duration: MOTION_DURATION.slow }, 
        '-=0.4'
      )
      .fromTo('.signal-body', 
        { opacity: 0, y: 12 }, 
        { opacity: 1, y: 0, duration: MOTION_DURATION.medium }, 
        '-=0.2'
      )
      .fromTo('.signal-cta', 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: MOTION_DURATION.medium }, 
        '-=0.1'
      )
      .fromTo('.signal-footprint', 
        { opacity: 0 }, 
        { opacity: 1, duration: MOTION_DURATION.medium }, 
        '-=0.1'
      );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Instant display without movement or opacity tweens
      gsap.set(['.signal-telemetry-bar', '.signal-headline', '.signal-body', '.signal-cta', '.signal-footprint'], {
        opacity: 1,
        y: 0
      });
      if (pathRef.current) {
        gsap.set(pathRef.current, { strokeDashoffset: 0, strokeDasharray: 'none' });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      aria-label="The Signal: Mission Introduction"
      style={{
        minHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--space-2xl) var(--space-md)',
        position: 'relative'
      }}
    >
      {/* Top Telemetry Header */}
      <div 
        className="signal-telemetry-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-sm)',
          borderBottom: '1px solid var(--color-surface-border-subtle)',
          paddingBottom: 'var(--space-sm)'
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span 
            ref={pulseDotRef}
            style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-amber-bright)', display: 'inline-block' }} 
          />
          <span className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)' }}>
            CARRIER DETECTED · 2295.000 MHz (S-BAND)
          </span>
        </div>
        <div className="font-telemetry" style={{ color: 'var(--color-muted-slate)' }}>
          DEEP SPACE NETWORK · GOLDSTONE / MADRID / CANBERRA
        </div>
      </div>

      {/* Center Cinematic Decryption Scene */}
      <div style={{ maxWidth: '880px', margin: 'auto 0', padding: 'var(--space-2xl) 0' }}>
        
        {/* Self-drawing SVG Frequency Waveform */}
        <div style={{ width: '100%', maxWidth: '440px', height: '40px', marginBottom: 'var(--space-xl)' }}>
          <svg viewBox="0 0 440 40" fill="none" style={{ width: '100%', height: '100%' }} aria-hidden="true">
            <path 
              ref={pathRef}
              d="M0 20 H140 Q152 20 158 8 T170 32 T182 4 T194 36 T206 20 H440" 
              stroke="var(--color-lunar-amber)" 
              strokeWidth="1.75" 
            />
          </svg>
        </div>

        {/* Challenge Copy Beat 1 */}
        <h1 
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
            maxWidth: '700px',
            lineHeight: 1.7,
            marginBottom: 'var(--space-2xl)'
          }}
        >
          Left in the regolith of Hadley Rille. Silenced under a Martian global sky. Drifting past the edge of the Sun's realm. Yet across millions of miles, what they discovered changed how we understand the universe.
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
              padding: '16px 28px',
              backgroundColor: 'var(--color-lunar-amber)',
              borderRadius: 'var(--radius-sm)',
              color: '#0B0D11',
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: '0.04em',
              cursor: 'pointer',
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
            ENTER THE MISSION →
          </button>
        </div>

      </div>

      {/* Astronomical Traversal Footprint Indicator */}
      <div 
        className="signal-footprint"
        style={{
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
