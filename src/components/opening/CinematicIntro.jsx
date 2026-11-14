import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const TYPEWRITER_TEXT = 'INITIATING MISSION TELEMETRY...';

export default function CinematicIntro({ onComplete }) {
  const overlayRef = useRef(null);
  const cursorRef = useRef(null);
  const typeRowRef = useRef(null);
  const countdown3Ref = useRef(null);
  const countdown2Ref = useRef(null);
  const countdown1Ref = useRef(null);
  const liftoffRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    // prefers-reduced-motion: skip entirely
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      const timer = setTimeout(() => onComplete?.(), 300);
      return () => clearTimeout(timer);
    }

    const overlay = overlayRef.current;
    const cursor = cursorRef.current;
    const typeRow = typeRowRef.current;
    const spans = typeRow ? Array.from(typeRow.querySelectorAll('span')) : [];
    const c3 = countdown3Ref.current;
    const c2 = countdown2Ref.current;
    const c1 = countdown1Ref.current;
    const liftoff = liftoffRef.current;

    // Set initial states
    gsap.set(cursor, { opacity: 0 });
    gsap.set(spans, { opacity: 0 });
    gsap.set([c3, c2, c1], { opacity: 0, scale: 1.4 });
    gsap.set(liftoff, { opacity: 0, scale: 0.6 });
    gsap.set(typeRow, { opacity: 1 });

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    tlRef.current = tl;

    // t=0 — fade in blinking cursor
    tl.to(cursor, { opacity: 1, duration: 0.3 }, 0);

    // t=0.5 — typewriter: stagger each character span into visibility
    tl.to(
      spans,
      {
        opacity: 1,
        duration: 0.001,
        stagger: 0.04, // ~40ms per character
      },
      0.5
    );

    // t=2.8 — fade out typewriter row + cursor
    tl.to([typeRow, cursor], { opacity: 0, duration: 0.4 }, 2.8);

    // Helper: countdown digit sequence
    const addCountdown = (el, startTime) => {
      tl.to(el, { opacity: 1, scale: 1, duration: 0.25, ease: 'back.out(1.4)' }, startTime);
      tl.to(el, { opacity: 0, scale: 0.8, duration: 0.25, ease: 'power2.in' }, startTime + 0.7);
    };

    // t=3.5 — "3"
    addCountdown(c3, 3.5);
    // t=4.2 — "2"
    addCountdown(c2, 4.2);
    // t=4.9 — "1"
    addCountdown(c1, 4.9);

    // t=5.6 — LIFTOFF
    tl.to(liftoff, { opacity: 1, scale: 1.2, duration: 0.4, ease: 'back.out(1.2)' }, 5.6);

    // t=6.2 — dramatic zoom-out reveal
    tl.to(
      overlay,
      {
        scale: 8,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.in',
        onComplete: () => onComplete?.(),
      },
      6.2
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  const handleSkip = () => {
    tlRef.current?.kill();
    onComplete?.();
  };

  /* ── Styles ─────────────────────────────────────────────── */

  const styles = {
    overlay: {
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    cursorLine: {
      width: '2px',
      height: 'clamp(1rem, 2.5vw, 1.4rem)',
      background: '#E89020', // --color-lunar-amber
      marginBottom: '1rem',
      display: 'block',
      animation: 'ciBlink 0.9s step-end infinite',
    },
    typeRow: {
      fontFamily: "'Space Grotesk', -apple-system, sans-serif",
      color: '#E89020',
      fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
      letterSpacing: '0.12em',
      textAlign: 'center',
      marginTop: '0.5rem',
    },
    countdownWrap: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    },
    countdownNum: {
      fontFamily: "'Newsreader', Georgia, serif",
      fontSize: 'clamp(4rem, 15vw, 12rem)',
      color: '#F4F6F8',
      lineHeight: 1,
      userSelect: 'none',
    },
    liftoff: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Space Grotesk', -apple-system, sans-serif",
      fontSize: 'clamp(2rem, 6vw, 5rem)',
      fontWeight: 700,
      letterSpacing: '0.2em',
      color: '#fff',
      userSelect: 'none',
    },
    skipBtn: {
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 1001,
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#F4F6F8',
      fontFamily: "'Space Grotesk', -apple-system, sans-serif",
      fontSize: '0.75rem',
      letterSpacing: '0.1em',
      opacity: 0.5,
      padding: '0.4rem 0.8rem',
      textTransform: 'uppercase',
    },
  };

  return (
    <>
      {/* Global keyframes for blinking cursor — injected once */}
      <style>{`
        @keyframes ciBlink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>

      <div ref={overlayRef} style={styles.overlay}>
        {/* Blinking cursor */}
        <span ref={cursorRef} style={styles.cursorLine} aria-hidden="true" />

        {/* Typewriter line */}
        <div ref={typeRowRef} style={styles.typeRow} aria-label={TYPEWRITER_TEXT}>
          {TYPEWRITER_TEXT.split('').map((char, i) => (
            <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
              {char}
            </span>
          ))}
        </div>

        {/* Countdown digits — stacked in absolute position */}
        <div style={styles.countdownWrap}>
          <span ref={countdown3Ref} style={styles.countdownNum} aria-hidden="true">3</span>
        </div>
        <div style={styles.countdownWrap}>
          <span ref={countdown2Ref} style={styles.countdownNum} aria-hidden="true">2</span>
        </div>
        <div style={styles.countdownWrap}>
          <span ref={countdown1Ref} style={styles.countdownNum} aria-hidden="true">1</span>
        </div>

        {/* LIFTOFF */}
        <div ref={liftoffRef} style={styles.liftoff} aria-label="LIFTOFF">
          LIFTOFF
        </div>
      </div>

      {/* Skip button — outside overlay so it's always clickable */}
      <button onClick={handleSkip} style={styles.skipBtn} aria-label="Skip intro">
        SKIP INTRO
      </button>
    </>
  );
}
