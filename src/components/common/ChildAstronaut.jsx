import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { getGuideLine } from '../../data/guideLines.js';

/**
 * ChildAstronaut.jsx (EVA-01 Custom Cursor & Guide Companion)
 *
 * Requirements:
 * 1. Acts as the custom cursor on desktop (centered on pointer, pointer-events: none, 0.1s lag).
 * 2. Reduced size by ~35% (38px × 48px, roughly 40-48px tall).
 * 3. Minimal "EVA-01" label (9.5px, letter-spaced, low opacity) and removed connector tether.
 * 4. Subtle hover feedback: 1.15x scale + brightened glow over clickable elements.
 * 5. Guide Mode: flies smoothly to destination, typing out 2 simple sentences (ages 8-14).
 * 6. Respects prefers-reduced-motion (no lag, no hover scale).
 */
export default function ChildAstronaut({ guideTrigger, style = {}, onMounted }) {
  const outerRef = useRef(null);
  const innerDriftRef = useRef(null);
  const tiltRef = useRef(null);
  const beaconRef = useRef(null);
  const bubbleRef = useRef(null);

  const [bubbleState, setBubbleState] = useState({
    visible: false,
    title: '',
    destination: '',
    text: '',
    fullText: '',
    isTyping: false,
  });

  const [isTouch, setIsTouch] = useState(false);
  const isGuideActiveRef = useRef(false);
  const isTouchRef = useRef(false);
  const isHoveringClickableRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const lastXRef = useRef(0);
  const tiltResetTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const hideTimerRef = useRef(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Initial Position, Microgravity Float & Touch Detection
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    isTouchRef.current = isTouchDevice;
    setIsTouch(isTouchDevice);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Default position
    const initX = isTouchDevice ? window.innerWidth - 65 : window.innerWidth / 2;
    const initY = isTouchDevice ? window.innerHeight - 85 : window.innerHeight / 2;
    lastMousePosRef.current = { x: initX, y: initY };
    lastXRef.current = initX;

    gsap.set(outerRef.current, {
      x: initX,
      y: initY,
      opacity: isTouchDevice ? 0.9 : 0, // Hidden until first mouse movement on desktop
    });

    onMounted?.();

    // Close speech bubble on Escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setBubbleState((prev) => ({ ...prev, visible: false }));
        isGuideActiveRef.current = false;
      }
    };
    window.addEventListener('keydown', handleEscape);

    if (reducedMotion) {
      return () => window.removeEventListener('keydown', handleEscape);
    }

    // Gentle floating idle (microgravity drift)
    const floatAnim = gsap.to(innerDriftRef.current, {
      y: -6,
      duration: 5.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    let beaconAnim = null;
    if (beaconRef.current) {
      beaconAnim = gsap.to(beaconRef.current, {
        opacity: 0.2,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      floatAnim.kill();
      if (beaconAnim) beaconAnim.kill();
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Custom Cursor Follow (Accurate 0.1s lag, centered, hover feedback)
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    if (isTouch) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const outerEl = outerRef.current;
    const tiltEl = tiltRef.current;
    const driftEl = innerDriftRef.current;
    if (!outerEl || !tiltEl || !driftEl) return;

    // Extremely low latency lag (0.1s) for responsive, accurate pointer aiming
    const lagDuration = reducedMotion ? 0 : 0.1;
    const xTo = gsap.quickTo(outerEl, 'x', { duration: lagDuration, ease: 'power2.out' });
    const yTo = gsap.quickTo(outerEl, 'y', { duration: lagDuration, ease: 'power2.out' });
    const rotTo = gsap.quickTo(tiltEl, 'rotation', { duration: 0.15, ease: 'power2.out' });

    let hasRevealed = false;

    const handlePointerMove = (e) => {
      // Reveal astronaut on first pointer move
      if (!hasRevealed) {
        hasRevealed = true;
        gsap.to(outerEl, { opacity: 1, duration: 0.15 });
      }

      // If in guide mode, break back into cursor follow on intentional mouse move
      if (isGuideActiveRef.current) {
        const dx = Math.abs(e.clientX - lastMousePosRef.current.x);
        const dy = Math.abs(e.clientY - lastMousePosRef.current.y);
        if (dx + dy > 70) {
          isGuideActiveRef.current = false;
        } else {
          return;
        }
      }

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };

      // Exact pointer coordinates (no offset: centered exactly where the click lands)
      if (reducedMotion) {
        gsap.set(outerEl, { x: e.clientX, y: e.clientY });
      } else {
        xTo(e.clientX);
        yTo(e.clientY);

        // Directional movement tilt
        const vx = e.clientX - lastXRef.current;
        lastXRef.current = e.clientX;
        const tilt = Math.max(-10, Math.min(10, vx * 0.12));
        rotTo(tilt);

        if (tiltResetTimerRef.current) clearTimeout(tiltResetTimerRef.current);
        tiltResetTimerRef.current = setTimeout(() => {
          rotTo(0);
        }, 80);
      }

      // Check if hovering over a clickable element
      const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
      const isInteractive = Boolean(
        hoveredElement?.closest(
          'button, a, input, select, textarea, [role="button"], .world-card, .planet-hop-item, .scroll-progress-button, [data-interactive], [onclick]'
        )
      );

      if (isInteractive !== isHoveringClickableRef.current) {
        isHoveringClickableRef.current = isInteractive;

        if (reducedMotion) {
          // In reduced motion mode, brighten glow without scaling
          gsap.to(outerEl, {
            filter: isInteractive
              ? 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.65)) drop-shadow(0 0 24px rgba(232, 144, 32, 0.45))'
              : 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.22))',
            duration: 0.15,
          });
        } else {
          // Subtle hover feedback: 1.15x scale + glowing aura brightening
          gsap.to(driftEl, {
            scale: isInteractive ? 1.15 : 1.0,
            duration: 0.18,
            ease: 'power2.out',
          });

          gsap.to(outerEl, {
            filter: isInteractive
              ? 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.7)) drop-shadow(0 0 28px rgba(232, 144, 32, 0.5))'
              : 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.22))',
            duration: 0.18,
          });
        }
      }
    };

    const handleMouseLeave = () => {
      if (!isGuideActiveRef.current) {
        gsap.to(outerEl, { opacity: 0, duration: 0.15 });
      }
    };

    const handleMouseEnter = () => {
      gsap.to(outerEl, { opacity: 1, duration: 0.15 });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (tiltResetTimerRef.current) clearTimeout(tiltResetTimerRef.current);
    };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Guide Mode: Fly to section and display speech bubble
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!guideTrigger || !guideTrigger.missionId) return;

    const missionId = guideTrigger.missionId;
    const guideData = getGuideLine(missionId);
    if (!guideData) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

    isGuideActiveRef.current = true;

    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

    // Safe flight target coordinates in editorial header area
    const guideTargetX = Math.max(70, window.innerWidth - 180);
    const guideTargetY = Math.min(135, window.innerHeight * 0.2);

    const startSpeech = () => {
      const fullText = guideData.text;

      if (reducedMotion) {
        setBubbleState({
          visible: true,
          title: guideData.title,
          destination: guideData.destination,
          text: fullText,
          fullText,
          isTyping: false,
        });

        hideTimerRef.current = setTimeout(() => {
          setBubbleState((prev) => ({ ...prev, visible: false }));
          isGuideActiveRef.current = false;
        }, 6000);
        return;
      }

      setBubbleState({
        visible: true,
        title: guideData.title,
        destination: guideData.destination,
        text: '',
        fullText,
        isTyping: true,
      });

      let charIndex = 0;
      typingTimerRef.current = setInterval(() => {
        charIndex += 1;
        setBubbleState((prev) => ({
          ...prev,
          text: fullText.slice(0, charIndex),
        }));

        if (charIndex >= fullText.length) {
          clearInterval(typingTimerRef.current);
          setBubbleState((prev) => ({ ...prev, isTyping: false }));

          hideTimerRef.current = setTimeout(() => {
            if (bubbleRef.current) {
              gsap.to(bubbleRef.current, {
                opacity: 0,
                y: -6,
                duration: 0.6,
                ease: 'power2.out',
                onComplete: () => {
                  setBubbleState((prev) => ({ ...prev, visible: false }));
                  isGuideActiveRef.current = false;
                },
              });
            } else {
              setBubbleState((prev) => ({ ...prev, visible: false }));
              isGuideActiveRef.current = false;
            }
          }, 6000);
        }
      }, 26);
    };

    if (reducedMotion || isTouch) {
      if (!isTouch) {
        gsap.set(outerRef.current, { x: guideTargetX, y: guideTargetY, opacity: 1 });
      }
      startSpeech();
    } else {
      gsap.to(outerRef.current, {
        x: guideTargetX,
        y: guideTargetY,
        opacity: 1,
        duration: 1.4,
        ease: 'power2.inOut',
        onComplete: startSpeech,
      });

      if (tiltRef.current) {
        gsap.to(tiltRef.current, {
          rotation: guideTargetX > lastXRef.current ? 8 : -8,
          duration: 0.7,
          ease: 'power1.out',
          yoyo: true,
          repeat: 1,
        });
      }
    }

    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [guideTrigger]);

  return (
    <aside
      ref={outerRef}
      className="child-astronaut-wrapper"
      onClick={() => {
        if (!isTouch) return;
        const current = guideTrigger?.missionId || 'home';
        const guideData = getGuideLine(current);
        if (guideData) {
          setBubbleState({
            visible: true,
            title: guideData.title,
            destination: guideData.destination,
            text: guideData.text,
            fullText: guideData.text,
            isTyping: false,
          });
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          hideTimerRef.current = setTimeout(() => {
            setBubbleState((prev) => ({ ...prev, visible: false }));
          }, 6000);
        }
      }}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 99999, // Ensure custom cursor floats over all layers
        pointerEvents: isTouch ? 'auto' : 'none',
        cursor: isTouch ? 'pointer' : 'default',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.22))',
        willChange: 'transform',
        ...style,
      }}
      aria-label="EVA-01 Orbital Guide Companion"
      role={isTouch ? 'button' : undefined}
      tabIndex={isTouch ? 0 : undefined}
    >
      {/* ── Typewriter Speech Bubble ── */}
      {bubbleState.visible && (
        <div
          ref={bubbleRef}
          role="status"
          aria-live="polite"
          style={{
            position: 'absolute',
            right: isTouch ? '0' : 'calc(100% + 14px)',
            top: isTouch ? 'auto' : '-8px',
            bottom: isTouch ? '55px' : 'auto',
            width: 'clamp(240px, 75vw, 340px)',
            maxWidth: 'calc(100vw - 32px)',
            padding: '10px 14px',
            backgroundColor: 'rgba(11, 15, 25, 0.95)',
            border: '1px solid rgba(232, 144, 32, 0.5)',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7), 0 0 12px rgba(232, 144, 32, 0.25)',
            borderRadius: '14px',
            backdropFilter: 'blur(16px)',
            color: '#E8ECF5',
            fontFamily: 'var(--font-sans, sans-serif)',
            pointerEvents: 'none',
            zIndex: 100000,
            animation: 'astronautBubbleFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          {/* Header Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '5px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '4px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.625rem',
                letterSpacing: '0.12em',
                color: 'var(--color-lunar-amber, #E89020)',
                textTransform: 'uppercase',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  boxShadow: '0 0 6px #10B981',
                }}
              />
              EVA-01 GUIDE
            </div>
            <div
              style={{
                fontSize: '0.625rem',
                fontFamily: 'var(--font-mono, monospace)',
                color: 'var(--color-telemetry-silver, #A8B3C2)',
                opacity: 0.8,
              }}
            >
              {bubbleState.destination}
            </div>
          </div>

          {/* 2-Sentence Spoken Story */}
          <p
            style={{
              margin: 0,
              fontSize: '0.78125rem',
              lineHeight: 1.45,
              color: '#F4F6F8',
              letterSpacing: '0.01em',
            }}
          >
            {bubbleState.text}
            {bubbleState.isTyping && (
              <span
                style={{
                  display: 'inline-block',
                  color: 'var(--color-lunar-amber, #E89020)',
                  marginLeft: '2px',
                  fontWeight: 'bold',
                }}
              >
                ▋
              </span>
            )}
          </p>

          {/* Tail Pointer to Visor */}
          <div
            style={{
              position: 'absolute',
              right: '-7px',
              top: '18px',
              width: 0,
              height: 0,
              borderTop: '6px solid transparent',
              borderBottom: '6px solid transparent',
              borderLeft: '7px solid rgba(232, 144, 32, 0.55)',
            }}
          />
        </div>
      )}

      {/* ── Inner Drift, Hover Scale & Centering ── */}
      <div
        ref={innerDriftRef}
        style={{
          transform: 'translate(-50%, -42%)', // Centered right on mouse pointer position
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          willChange: 'transform',
        }}
      >
        <div ref={tiltRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Reduced Astronaut Vector Silhouette (38px × 48px, ~35% reduction) */}
          <svg
            width="38"
            height="48"
            viewBox="0 0 62 78"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: 'visible', display: 'block' }}
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="cursorVisorGold" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#FDE68A" />
                <stop offset="35%" stopColor="#F59E0B" />
                <stop offset="85%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#451A03" />
              </radialGradient>

              <linearGradient id="cursorVisorSpecular" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              <linearGradient id="cursorSuitShade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F4F6F8" />
                <stop offset="70%" stopColor="#D1D5DB" />
                <stop offset="100%" stopColor="#9CA3AF" />
              </linearGradient>

              <linearGradient id="cursorPackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="100%" stopColor="#1F2937" />
              </linearGradient>
            </defs>

            {/* Life-Support Backpack (PLSS) */}
            <rect x="11" y="24" width="12" height="30" rx="3" fill="url(#cursorPackGrad)" stroke="#4B5563" strokeWidth="1" />
            <line x1="14" y1="24" x2="14" y2="14" stroke="#9CA3AF" strokeWidth="1" strokeLinecap="round" />
            <circle cx="14" cy="14" r="1.5" fill="#E89020" />

            {/* Suit Legs & Soft Boots */}
            <path d="M 23 52 L 21 68 Q 20 73 24 73 L 28 73 Q 30 73 30 68 L 30 52" fill="url(#cursorSuitShade)" stroke="#4B5563" strokeWidth="0.8" />
            <path d="M 33 52 L 35 68 Q 36 73 40 73 L 44 73 Q 46 73 45 68 L 41 52" fill="url(#cursorSuitShade)" stroke="#4B5563" strokeWidth="0.8" />
            <path d="M 19 72 L 28 72" stroke="#374151" strokeWidth="2" strokeLinecap="round" />
            <path d="M 36 72 L 45 72" stroke="#374151" strokeWidth="2" strokeLinecap="round" />

            {/* Suit Torso */}
            <rect x="20" y="26" width="23" height="28" rx="6" fill="url(#cursorSuitShade)" stroke="#4B5563" strokeWidth="0.8" />
            
            {/* Chest Telemetry Pack */}
            <rect x="24" y="31" width="15" height="11" rx="2" fill="#1F2937" stroke="#374151" strokeWidth="0.7" />
            <circle cx="27" cy="36" r="1.2" fill="#10B981" />
            <circle cx="31" cy="36" r="1.2" fill="#38BDF8" />
            <circle ref={beaconRef} cx="35" cy="36" r="1.2" fill="#F59E0B" />

            {/* Arms (Gentle microgravity posture) */}
            <path d="M 21 28 Q 13 34 16 43 Q 17 46 20 46" fill="none" stroke="url(#cursorSuitShade)" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M 42 28 Q 50 33 49 42 Q 48 45 45 46" fill="none" stroke="url(#cursorSuitShade)" strokeWidth="5.5" strokeLinecap="round" />

            {/* Suit Helmet Base Ring */}
            <ellipse cx="31.5" cy="22" rx="14" ry="4" fill="#374151" />

            {/* Large Rounded Helmet */}
            <circle cx="31.5" cy="18" r="14" fill="url(#cursorSuitShade)" stroke="#6B7280" strokeWidth="0.8" />

            {/* Golden Visor (Reflective dome) */}
            <ellipse cx="32" cy="18.5" rx="10.5" ry="9" fill="url(#cursorVisorGold)" />
            <ellipse cx="30" cy="16" rx="7" ry="5" fill="url(#cursorVisorSpecular)" opacity="0.8" />
            <circle cx="35" cy="17" r="0.75" fill="#FFFFFF" opacity="0.9" />
            <circle cx="28" cy="21" r="0.5" fill="#FFFFFF" opacity="0.6" />
          </svg>

          {/* Tiny EVA-01 Identifier directly under astronaut */}
          <div
            style={{
              marginTop: '3px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '9.5px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--color-telemetry-silver, #A8B3C2)',
              opacity: 0.55,
              whiteSpace: 'nowrap',
              textAlign: 'center',
              textShadow: '0 1px 3px rgba(0,0,0,0.9)',
            }}
          >
            EVA-01
          </div>
        </div>
      </div>
    </aside>
  );
}
