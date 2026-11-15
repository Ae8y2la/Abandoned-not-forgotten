import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './CinematicIntro.css';

/**
 * Web Audio Ambient Sound Generator
 * Synthesizes a deep, haunting cosmic drone and tension swell inspired by Interstellar.
 * 100% self-contained, no external MP3 dependencies, no network lag or 404 errors.
 */
class InterstellarSoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.drone1 = null;
    this.drone2 = null;
    this.filter = null;
    this.noiseGain = null;
    this.initialized = false;
    this.isMuted = true;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      // Master output
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Warm analog-style lowpass filter
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(160, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(3.0, this.ctx.currentTime);
      this.filter.connect(this.masterGain);

      // Sub-harmonic cosmic drone 1 (48.99 Hz — G1)
      this.drone1 = this.ctx.createOscillator();
      this.drone1.type = 'sine';
      this.drone1.frequency.setValueAtTime(48.99, this.ctx.currentTime);
      this.drone1.connect(this.filter);

      // Fifth overtone drone 2 (73.42 Hz — D2)
      this.drone2 = this.ctx.createOscillator();
      this.drone2.type = 'triangle';
      this.drone2.frequency.setValueAtTime(73.42, this.ctx.currentTime);
      const drone2Gain = this.ctx.createGain();
      drone2Gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.drone2.connect(drone2Gain);
      drone2Gain.connect(this.filter);

      this.drone1.start();
      this.drone2.start();

      // Procedural launch thruster rumble (filtered brown-like noise)
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
      }
      const noiseSource = this.ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(80, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

      noiseSource.connect(rumbleFilter);
      rumbleFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);
      noiseSource.start();

      this.initialized = true;
    } catch (_) {}
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!this.initialized && !muted) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended' && !muted) {
      this.ctx.resume();
    }
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.linearRampToValueAtTime(muted ? 0.0001 : 0.4, now + 0.6);
    }
  }

  swellTension() {
    if (!this.filter || !this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      this.filter.frequency.cancelScheduledValues(now);
      this.filter.frequency.exponentialRampToValueAtTime(380, now + 3.0);
    } catch (_) {}
  }

  launchRumble() {
    if (!this.noiseGain || !this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      this.noiseGain.gain.cancelScheduledValues(now);
      this.noiseGain.gain.linearRampToValueAtTime(0.45, now + 1.2);
      this.noiseGain.gain.linearRampToValueAtTime(0.0001, now + 3.5);
    } catch (_) {}
  }

  stop() {
    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.0);
        setTimeout(() => {
          try {
            if (this.ctx && this.ctx.state !== 'closed') {
              this.ctx.close();
            }
          } catch (_) {}
        }, 1100);
      } catch (_) {}
    }
  }
}

export default function CinematicIntro({ onComplete }) {
  const containerRef = useRef(null);
  const soundEngineRef = useRef(null);

  // Step element references for strict sequential orchestration
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const titleRef = useRef(null);
  const streakRef = useRef(null);
  const count3Ref = useRef(null);
  const count2Ref = useRef(null);
  const count1Ref = useRef(null);
  const liftoffRef = useRef(null);
  const launchRef = useRef(null);
  const rocketRef = useRef(null);
  const plumeRef = useRef(null);
  const warpRef = useRef(null);

  const [showSkip, setShowSkip] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const timelineRef = useRef(null);

  const finish = useCallback(() => {
    if (soundEngineRef.current) {
      soundEngineRef.current.stop();
    }
    // Save to session storage so intro is not repeated automatically
    try {
      sessionStorage.setItem('unfinished_mission_intro_seen', 'true');
    } catch (_) {}
    if (onComplete) onComplete();
  }, [onComplete]);

  // Handle Skip Button Click or Escape key
  const handleSkip = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: finish
      });
    } else {
      finish();
    }
  }, [finish]);

  // Audio Toggle
  const toggleSound = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (soundEngineRef.current) {
        soundEngineRef.current.setMuted(next);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    soundEngineRef.current = new InterstellarSoundEngine();

    // Reveal skip button after 2 seconds
    const skipTimer = setTimeout(() => setShowSkip(true), 2000);

    // Escape key listener for keyboard accessibility
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) {
      // Accessible reduced motion fallback: clean 2.5s quiet fade
      const tl = gsap.timeline({ onComplete: finish });
      tl.to(containerRef.current, { opacity: 0, duration: 2.5, ease: 'sine.inOut' });
      return () => {
        clearTimeout(skipTimer);
        window.removeEventListener('keydown', handleKeyDown);
        tl.kill();
      };
    }

    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const title = titleRef.current;
    const streak = streakRef.current;
    const count3 = count3Ref.current;
    const count2 = count2Ref.current;
    const count1 = count1Ref.current;
    const liftoff = liftoffRef.current;
    const launch = launchRef.current;
    const rocket = rocketRef.current;
    const plume = plumeRef.current;
    const warp = warpRef.current;
    const root = containerRef.current;

    // Strict initial isolation: ensure every step is 100% invisible and unrendered
    gsap.set([line1, line2, title, streak, count3, count2, count1, liftoff, launch], {
      autoAlpha: 0,
      display: 'none'
    });
    gsap.set(root, { opacity: 1 });

    const tl = gsap.timeline({
      onComplete: finish
    });
    timelineRef.current = tl;

    // ── 0.0s - 0.8s: Initial deep space quiet darkness ──
    tl.to({}, { duration: 0.8 });

    // ── Step 1: "Some missions were left behind." ──
    tl.set(line1, { display: 'flex' })
      .fromTo(line1,
        { autoAlpha: 0, y: 16, letterSpacing: '0.24em' },
        { autoAlpha: 1, y: 0, letterSpacing: '0.2em', duration: 1.4, ease: 'sine.inOut' }
      )
      .to({}, { duration: 1.5 }) // Hold
      .to(line1, { autoAlpha: 0, y: -10, duration: 1.0, ease: 'sine.inOut' })
      .set(line1, { display: 'none' }); // Strictly remove from DOM view

    // ── 0.8s near-empty black space beat ──
    tl.to({}, { duration: 0.8 });

    // ── Step 2: "But their stories never ended." ──
    tl.set(line2, { display: 'flex' })
      .fromTo(line2,
        { autoAlpha: 0, y: 16, letterSpacing: '0.24em' },
        { autoAlpha: 1, y: 0, letterSpacing: '0.2em', duration: 1.4, ease: 'sine.inOut' }
      )
      .to({}, { duration: 1.5 }) // Hold
      .to(line2, { autoAlpha: 0, y: -10, duration: 1.0, ease: 'sine.inOut' })
      .set(line2, { display: 'none' }); // Strictly remove from DOM view

    // ── 0.8s near-empty black space beat ──
    tl.to({}, { duration: 0.8 });

    // ── Step 3: Main Title "THE UNFINISHED MISSION" ──
    tl.set([title, streak], { display: 'flex' })
      .to(streak, { autoAlpha: 0.8, duration: 1.6, ease: 'sine.inOut' }, '<')
      .fromTo(title,
        { autoAlpha: 0, scale: 0.95, letterSpacing: '0.36em' },
        { autoAlpha: 1, scale: 1.0, letterSpacing: '0.24em', duration: 2.0, ease: 'power2.inOut' },
        '<'
      )
      .call(() => {
        if (soundEngineRef.current) soundEngineRef.current.swellTension();
      })
      .to({}, { duration: 2.0 }) // Hold 2s
      .to([title, streak], { autoAlpha: 0, scale: 1.03, duration: 1.2, ease: 'sine.inOut' })
      .set([title, streak], { display: 'none' });

    // ── 0.8s near-empty black space beat ──
    tl.to({}, { duration: 0.8 });

    // ── Step 4: Standalone Countdown Numbers: 3, then 2, then 1 ──
    // Each number is centered, alone on screen, fades in 0.5s, holds 0.7s, fades out 0.5s.
    // Previous number is 100% removed before next appears. No stacking.

    // NUMBER 3
    tl.set(count3, { display: 'flex' })
      .fromTo(count3,
        { autoAlpha: 0, scale: 1.2 },
        { autoAlpha: 1, scale: 1.0, duration: 0.5, ease: 'sine.out' }
      )
      .to({}, { duration: 0.7 }) // Hold
      .to(count3, { autoAlpha: 0, scale: 0.92, duration: 0.5, ease: 'sine.in' })
      .set(count3, { display: 'none' }); // Removed before 2 appears!

    // NUMBER 2
    tl.set(count2, { display: 'flex' })
      .fromTo(count2,
        { autoAlpha: 0, scale: 1.2 },
        { autoAlpha: 1, scale: 1.0, duration: 0.5, ease: 'sine.out' }
      )
      .to({}, { duration: 0.7 }) // Hold
      .to(count2, { autoAlpha: 0, scale: 0.92, duration: 0.5, ease: 'sine.in' })
      .set(count2, { display: 'none' }); // Removed before 1 appears!

    // NUMBER 1
    tl.set(count1, { display: 'flex' })
      .fromTo(count1,
        { autoAlpha: 0, scale: 1.2 },
        { autoAlpha: 1, scale: 1.0, duration: 0.5, ease: 'sine.out' }
      )
      .to({}, { duration: 0.7 }) // Hold
      .to(count1, { autoAlpha: 0, scale: 0.92, duration: 0.5, ease: 'sine.in' })
      .set(count1, { display: 'none' }); // Removed before liftoff!

    // ── Step 5: A silent black beat of 0.8s, then "LIFTOFF" alone for 1.2s ──
    tl.to({}, { duration: 0.8 }); // Silent black beat of 0.8s

    tl.set(liftoff, { display: 'flex' })
      .fromTo(liftoff,
        { autoAlpha: 0, scale: 0.94, letterSpacing: '0.38em' },
        { autoAlpha: 1, scale: 1.0, letterSpacing: '0.28em', duration: 0.35, ease: 'power2.out' }
      )
      .call(() => {
        if (soundEngineRef.current) soundEngineRef.current.launchRumble();
      })
      .to({}, { duration: 1.2 }) // Alone for 1.2s
      .to(liftoff, { autoAlpha: 0, scale: 1.04, duration: 0.45, ease: 'sine.in' })
      .set(liftoff, { display: 'none' });

    // ── Step 6: Launch, then smooth cross-dissolve into Scene 1 ──
    tl.set(launch, { display: 'flex' })
      .fromTo(launch, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, ease: 'power2.inOut' })
      .fromTo(rocket,
        { y: 80, scale: 0.9 },
        { y: -450, scale: 1.15, duration: 2.8, ease: 'power2.in' },
        '<'
      )
      .to(warp, { autoAlpha: 0.8, duration: 1.8, ease: 'power2.in' }, '<+=0.5')
      // Smooth cross-dissolve into Scene 1 (1.4s cross-fade)
      .to(root, {
        opacity: 0,
        duration: 1.4,
        ease: 'power2.inOut'
      }, '-=0.8');

    return () => {
      clearTimeout(skipTimer);
      window.removeEventListener('keydown', handleKeyDown);
      if (soundEngineRef.current) soundEngineRef.current.stop();
      tl.kill();
    };
  }, [finish, handleSkip]);

  return (
    <div
      ref={containerRef}
      className="cinematic-intro-root"
      role="dialog"
      aria-modal="true"
      aria-label="Prologue: The Unfinished Mission"
      onClick={handleSkip}
      title="Click or tap anywhere to skip prologue"
    >
      {/* ── Visual Ambience Layers ── */}
      <div className="intro-cosmic-backdrop" aria-hidden="true" />
      <div className="intro-film-grain" aria-hidden="true" />

      {/* Subtle Star Drift in Background */}
      <div className="intro-starfield" aria-hidden="true">
        <div className="intro-drift-star" style={{ top: '22%', left: '18%', width: 2, height: 2, opacity: 0.7 }} />
        <div className="intro-drift-star" style={{ top: '35%', left: '74%', width: 3, height: 3, opacity: 0.85 }} />
        <div className="intro-drift-star" style={{ top: '65%', left: '28%', width: 2, height: 2, opacity: 0.6 }} />
        <div className="intro-drift-star" style={{ top: '78%', left: '82%', width: 3, height: 3, opacity: 0.9 }} />
        <div className="intro-drift-star" style={{ top: '15%', left: '50%', width: 1.5, height: 1.5, opacity: 0.5 }} />
        <div className="intro-drift-star" style={{ top: '88%', left: '44%', width: 2, height: 2, opacity: 0.65 }} />
      </div>

      {/* Anamorphic Horizontal Flare Line */}
      <div ref={streakRef} className="intro-anamorphic-streak" aria-hidden="true" />

      {/* ── Strict Sequential Steps (Only One Active at a Time) ── */}

      {/* Step 1 */}
      <div ref={line1Ref} className="intro-step">
        <p className="intro-line-text">
          Some missions were left behind.
        </p>
        <span className="intro-line-subtext">PROLOGUE // DEEP TRANSMISSION</span>
      </div>

      {/* Step 2 */}
      <div ref={line2Ref} className="intro-step">
        <p className="intro-line-text">
          But their stories never ended.
        </p>
        <span className="intro-line-subtext">CARRIER FREQUENCY · 2295 MHZ</span>
      </div>

      {/* Step 3: Title */}
      <div ref={titleRef} className="intro-step">
        <div className="intro-title-wrapper">
          <span className="intro-pre-title">NASA SPACE APPS CHALLENGE 2026</span>
          <h1 className="intro-main-title">THE UNFINISHED MISSION</h1>
          <div className="intro-title-divider" />
          <span className="intro-title-caption">AN INTERSTELLAR EXPLORATION OF ABANDONED HARDWARE</span>
        </div>
      </div>

      {/* Step 4: Standalone Countdown Numbers (Strictly Isolated, No Overlap) */}
      <div ref={count3Ref} className="intro-step">
        <div className="intro-countdown-num">3</div>
        <div className="intro-countdown-label">IGNITION SEQUENCE START</div>
      </div>

      <div ref={count2Ref} className="intro-step">
        <div className="intro-countdown-num">2</div>
        <div className="intro-countdown-label">MAIN ENGINE ARM</div>
      </div>

      <div ref={count1Ref} className="intro-step">
        <div className="intro-countdown-num">1</div>
        <div className="intro-countdown-label">ALL SYSTEMS NOMINAL</div>
      </div>

      {/* Step 5: Standalone LIFTOFF */}
      <div ref={liftoffRef} className="intro-step">
        <div className="intro-liftoff-badge">T-00:00:00 · TOWER CLEAR</div>
        <h2 className="intro-liftoff-title">LIFTOFF</h2>
      </div>

      {/* Step 6: Launch Ascent Vehicle & Starlight Streaks */}
      <div ref={launchRef} className="intro-launch-container">
        {/* Curved Horizon */}
        <div className="intro-earth-horizon" />

        {/* Warp Streak Lines */}
        <svg ref={warpRef} className="intro-warp-lines" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <line x1="200" y1="0" x2="160" y2="1000" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <line x1="400" y1="0" x2="380" y2="1000" stroke="rgba(56,189,248,0.5)" strokeWidth="2" />
          <line x1="600" y1="0" x2="620" y2="1000" stroke="rgba(245,158,11,0.5)" strokeWidth="2" />
          <line x1="800" y1="0" x2="840" y2="1000" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        </svg>

        {/* Rocket Silhouette & Exhaust Flame */}
        <div ref={rocketRef} className="intro-rocket-vehicle">
          {/* Slender Saturn V silhouette SVG */}
          <svg width="28" height="110" viewBox="0 0 28 110" fill="none">
            {/* Launch Escape Tower */}
            <line x1="14" y1="0" x2="14" y2="16" stroke="#A8B3C2" strokeWidth="1.5" />
            <polygon points="12,16 16,16 14.5,22 13.5,22" fill="#E89020" />
            {/* Command & Service Module */}
            <polygon points="11,22 17,22 18,34 10,34" fill="#F4F6F8" stroke="#374151" strokeWidth="0.8" />
            {/* Saturn V Upper Stages */}
            <rect x="9.5" y="34" width="9" height="30" fill="#FFFFFF" stroke="#374151" strokeWidth="0.8" />
            <rect x="9" y="64" width="10" height="24" fill="#E5E7EB" stroke="#374151" strokeWidth="0.8" />
            {/* S-IC First Stage & Fins */}
            <rect x="8.5" y="88" width="11" height="20" fill="#FFFFFF" stroke="#374151" strokeWidth="0.8" />
            <polygon points="8.5,94 4,106 8.5,106" fill="#374151" />
            <polygon points="19.5,94 24,106 19.5,106" fill="#374151" />
          </svg>
          {/* Engine Exhaust Plume */}
          <div ref={plumeRef} className="intro-exhaust-plume" />
        </div>
      </div>

      {/* ── Persistent Floating Control Bar (Minimal & Restrained) ── */}
      <div className="intro-control-bar" onClick={(e) => e.stopPropagation()}>
        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          className={`intro-btn ${!isMuted ? 'intro-btn--active' : ''}`}
          aria-label={isMuted ? 'Unmute cinematic ambient sound' : 'Mute sound'}
        >
          {isMuted ? '🔇 AUDIO: OFF' : '🔊 AUDIO: ACTIVE'}
        </button>

        {/* Skip Button (Clearly visible, supports click, tap or ESC) */}
        {showSkip && (
          <button
            onClick={handleSkip}
            className="intro-btn intro-btn--skip"
            aria-label="Skip prologue and proceed to missions"
          >
            SKIP PROLOGUE [ESC] ⇢
          </button>
        )}
      </div>
    </div>
  );
}
