import React, { useEffect, useState } from 'react';

export default function SignalScene({ onEnter }) {
  const [typedStage, setTypedStage] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 2;
    }
    return 0;
  });

  useEffect(() => {
    if (typedStage === 2) return;

    const t1 = setTimeout(() => setTypedStage(1), 600);
    const t2 = setTimeout(() => setTypedStage(2), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [typedStage]);

  return (
    <section 
      aria-label="The Signal: Mission Introduction"
      style={{
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--space-2xl) var(--space-md)',
        position: 'relative'
      }}
    >
      {/* Top Telemetry Header */}
      <div 
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
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-amber-bright)', display: 'inline-block' }} />
          <span className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)' }}>
            CARRIER DETECTED · 2295.000 MHz (S-BAND)
          </span>
        </div>
        <div className="font-telemetry" style={{ color: 'var(--color-muted-slate)' }}>
          DEEP SPACE NETWORK · GOLDSTONE / MADRID / CANBERRA
        </div>
      </div>

      {/* Center Cinematic Decryption Scene */}
      <div style={{ maxWidth: '860px', margin: 'auto 0', padding: 'var(--space-2xl) 0' }}>
        
        {/* Subtle SVG Frequency Baseline Tracer */}
        <div style={{ width: '100%', maxWidth: '420px', height: '36px', marginBottom: 'var(--space-xl)', opacity: 0.75 }}>
          <svg viewBox="0 0 420 36" fill="none" style={{ width: '100%', height: '100%' }} aria-hidden="true">
            <path 
              d="M0 18 H140 Q150 18 155 10 T165 26 T175 6 T185 30 T195 18 H420" 
              stroke="var(--color-lunar-amber)" 
              strokeWidth="1.5" 
              strokeDasharray="4 2" 
            />
          </svg>
        </div>

        {/* Challenge Copy Beat 1 */}
        <h1 
          className="text-display-1" 
          style={{
            marginBottom: 'var(--space-md)',
            opacity: typedStage >= 1 ? 1 : 0,
            transform: typedStage >= 1 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 600ms ease, transform 600ms ease'
          }}
        >
          Some machines never made it home.
        </h1>

        {/* Challenge Copy Beat 2 */}
        <p 
          className="text-lead" 
          style={{
            color: 'var(--color-telemetry-silver)',
            maxWidth: '680px',
            lineHeight: 1.7,
            marginBottom: 'var(--space-2xl)',
            opacity: typedStage >= 2 ? 1 : 0,
            transform: typedStage >= 2 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 600ms ease, transform 600ms ease'
          }}
        >
          Left in the regolith of Hadley Rille. Silenced under a Martian global sky. Drifting past the edge of the Sun's realm. Yet across millions of miles, what they discovered changed how we understand the universe.
        </p>

        {/* Call to Action: ENTER THE MISSION */}
        <div 
          style={{
            opacity: typedStage >= 2 ? 1 : 0,
            transform: typedStage >= 2 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 600ms ease 200ms, transform 600ms ease 200ms'
          }}
        >
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
              transition: 'background-color var(--transition-fast), transform var(--transition-fast)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-amber-bright)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-lunar-amber)'}
          >
            ENTER THE MISSION →
          </button>
        </div>

      </div>

      {/* Astronomical Traversal Footprint Indicator */}
      <div 
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
