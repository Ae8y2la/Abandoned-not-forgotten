import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MOTION_DURATION, MOTION_EASE, refreshScrollTrigger } from '../../styles/motion.js';
import LunarRoverSim from '../interactions/LunarRoverSim.jsx';
import MarsEvidenceLab from '../interactions/MarsEvidenceLab.jsx';
import InterstellarPing from '../interactions/InterstellarPing.jsx';
import { imageCredits } from '../../data/credits.js';

export default function MissionLayout({ mission, onBackToSelector, onOpenSources }) {
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);
  const [activeBeat, setActiveBeat] = useState('mystery');
  const articleRef = useRef(null);

  // Map authentic NASA image keys by mission
  const imageMap = {
    'apollo-15-lrv': {
      heroKey: 'apollo15_rover_irwin',
      secondaryKey: 'apollo15_rover_work'
    },
    'opportunity-mer': {
      heroKey: 'opportunity_self_portrait',
      secondaryKey: 'opportunity_perseverance_valley'
    },
    'voyager-1': {
      heroKey: 'voyager1_spacecraft',
      secondaryKey: null
    }
  };

  const currentMap = imageMap[mission.id] || imageMap['apollo-15-lrv'];
  const heroImage = imageCredits.find((c) => c.key === currentMap.heroKey);
  const secondaryImage = currentMap.secondaryKey ? imageCredits.find((c) => c.key === currentMap.secondaryKey) : null;

  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Hero Photo slow subtle zoom scrub
      const heroImg = el.querySelector('.hero-photo-img');
      const heroWrapper = el.querySelector('.hero-photo-wrapper');
      if (heroImg && heroWrapper) {
        gsap.to(heroImg, {
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: heroWrapper,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6
          }
        });
      }

      // 2. Fact stamps and discovery cards fade-in on enter
      const factCards = el.querySelectorAll('.scroll-reveal-card');
      if (factCards.length > 0) {
        gsap.fromTo(factCards,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: MOTION_DURATION.slow,
            stagger: 0.12,
            ease: MOTION_EASE.editorial,
            scrollTrigger: {
              trigger: '.science-cards-grid',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          }
        );
      }

      // 3. Progress Rail tracking across the 6 beats
      const beatSections = [
        { id: 'beat-mystery', key: 'mystery' },
        { id: 'beat-machine', key: 'machine' },
        { id: 'beat-traverse', key: 'traverse' },
        { id: 'beat-interaction', key: 'interaction' },
        { id: 'beat-science', key: 'science' },
        { id: 'beat-legacy', key: 'legacy' }
      ];

      beatSections.forEach((beat) => {
        const target = el.querySelector(`#${beat.id}`);
        if (target) {
          ScrollTrigger.create({
            trigger: target,
            start: 'top 45%',
            end: 'bottom 45%',
            onEnter: () => setActiveBeat(beat.key),
            onEnterBack: () => setActiveBeat(beat.key)
          });
        }
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const heroImg = el.querySelector('.hero-photo-img');
      if (heroImg) gsap.set(heroImg, { scale: 1 });
      const factCards = el.querySelectorAll('.scroll-reveal-card');
      if (factCards.length > 0) gsap.set(factCards, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, [mission.id]);

  if (!mission) return null;

  // Render the appropriate interaction based on mission ID
  const renderInteraction = () => {
    switch (mission.id) {
      case 'apollo-15-lrv':
        return <LunarRoverSim />;
      case 'opportunity-mer':
        return <MarsEvidenceLab />;
      case 'voyager-1':
        return <InterstellarPing />;
      default:
        return null;
    }
  };

  return (
    <article ref={articleRef} aria-labelledby="mission-title" style={{ paddingBottom: 'var(--space-3xl)', position: 'relative' }}>
      
      {/* Sticky Progress Rail Tracker */}
      <nav 
        aria-label="Mission Beat Progress Rail"
        style={{
          position: 'sticky',
          top: '56px',
          zIndex: 90,
          backgroundColor: 'rgba(11, 13, 17, 0.94)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--color-surface-border-subtle)',
          padding: '8px 0'
        }}
      >
        <div className="site-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <button
            onClick={onBackToSelector}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--color-telemetry-silver)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ← RETURN TO DESTINATIONS
          </button>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', overflowX: 'auto', maxWidth: '100%', padding: '2px 0' }}>
            {[
              { key: 'mystery', label: '01 ENIGMA' },
              { key: 'machine', label: '02 MACHINE' },
              { key: 'traverse', label: '03 TRAVERSE' },
              { key: 'interaction', label: '04 SIMULATION' },
              { key: 'science', label: '05 SCIENCE' },
              { key: 'legacy', label: '06 LEGACY' }
            ].map((beat) => (
              <span
                key={beat.key}
                className="badge-tag"
                style={{
                  padding: '3px 8px',
                  fontSize: '0.6875rem',
                  borderColor: activeBeat === beat.key ? mission.accentColor : 'var(--color-surface-border-subtle)',
                  color: activeBeat === beat.key ? 'var(--color-regolith-white)' : 'var(--color-muted-slate)',
                  backgroundColor: activeBeat === beat.key ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {beat.label}
              </span>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Header with Authentic NASA Master Photograph */}
      <header 
        className="hero-photo-wrapper"
        style={{
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0E1117',
          borderBottom: '1px solid var(--color-surface-border)'
        }}
      >
        {heroImage && (
          <div style={{ height: 'clamp(360px, 55vh, 600px)', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <img
              src={heroImage.heroFile}
              alt={heroImage.altText}
              className="hero-photo-img"
              width="1920"
              height="1080"
              onLoad={refreshScrollTrigger}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 35%',
                display: 'block'
              }}
            />
            {/* Dark gradient overlay for text readability */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(11,13,17,1) 0%, rgba(11,13,17,0.6) 45%, rgba(11,13,17,0.2) 100%)'
              }} 
            />

            {/* Authentic NASA Credit Pill */}
            <div 
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                backgroundColor: 'rgba(11, 13, 17, 0.85)',
                backdropFilter: 'blur(6px)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '4px 10px',
                fontSize: '0.6875rem',
                color: 'var(--color-telemetry-silver)'
              }}
            >
              {heroImage.type === 'illustration' ? 'Illustration' : 'Photo'}: {heroImage.creditLine} ({heroImage.nasaId})
            </div>
          </div>
        )}

        <div className="site-container" style={{ position: 'relative', marginTop: '-120px', paddingBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
            <span className="badge-tag" style={{ borderColor: mission.accentColor, color: 'var(--color-regolith-white)' }}>
              {mission.destinationSector}
            </span>
            <span className="badge-tag">
              LIGHT DELAY: {mission.lightTime}
            </span>
            <span className="badge-tag" style={{ color: 'var(--color-amber-bright)' }}>
              ● {mission.statusBadge}
            </span>
          </div>

          <h1 id="mission-title" className="text-display-1" style={{ marginBottom: 'var(--space-xs)', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            {mission.machineName}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center', color: 'var(--color-telemetry-silver)', fontSize: '0.9375rem' }}>
            <span><strong>Designation:</strong> {mission.designation}</span>
            <span>•</span>
            <span><strong>Departure/Landed:</strong> {mission.landingDate}</span>
            <span>•</span>
            <span><strong>Location:</strong> {mission.locationName}</span>
          </div>
        </div>
      </header>

      <div className="site-container" style={{ marginTop: 'var(--space-2xl)' }}>

        {/* ==================================================================
            BEAT 1: MYSTERY (The Hook / The Enigma)
            ================================================================== */}
        <section id="beat-mystery" aria-labelledby="beat-mystery-heading" style={{ marginBottom: 'var(--space-3xl)', maxWidth: '820px' }}>
          <div className="font-telemetry" style={{ color: mission.accentColor, marginBottom: 'var(--space-xs)' }}>
            STAGE 01 · THE ENIGMA
          </div>
          <h2 id="beat-mystery-heading" className="text-display-2" style={{ marginBottom: 'var(--space-md)' }}>
            {mission.mystery.headline}
          </h2>
          <p className="text-lead" style={{ lineHeight: 1.7 }}>
            {mission.mystery.narrative}
          </p>
        </section>

        {/* ==================================================================
            BEAT 2: MACHINE (Engineering Breakdown — How it Worked)
            ================================================================== */}
        <section 
          id="beat-machine"
          aria-labelledby="beat-machine-heading"
          style={{
            marginBottom: 'var(--space-3xl)',
            backgroundColor: 'var(--color-surface-charcoal)',
            border: '1px solid var(--color-surface-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)'
          }}
        >
          <div className="font-telemetry" style={{ color: mission.accentColor, marginBottom: 'var(--space-xs)' }}>
            STAGE 02 · HARDWARE ARCHITECTURE
          </div>
          <h2 id="beat-machine-heading" className="text-headline-3" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', marginBottom: 'var(--space-xs)' }}>
            {mission.machine.headline}
          </h2>
          <p className="text-body" style={{ marginBottom: 'var(--space-xl)', maxWidth: '780px' }}>
            {mission.machine.subheadline}
          </p>

          {/* Interactive Hardware Anatomy Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-md)' }}>
            
            {/* Component Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} role="tablist" aria-label="Machine components">
              {mission.machine.specs.map((spec, index) => {
                const isSelected = activeSpecIndex === index;
                return (
                  <button
                    key={spec.label}
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setActiveSpecIndex(index)}
                    style={{
                      textAlign: 'left',
                      padding: '14px 18px',
                      backgroundColor: isSelected ? 'var(--color-surface-elevated)' : 'transparent',
                      border: `1px solid ${isSelected ? mission.accentColor : 'var(--color-surface-border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: isSelected ? 'var(--color-regolith-white)' : 'var(--color-telemetry-silver)', fontSize: '0.9375rem' }}>
                        {spec.label}
                      </div>
                      <div className="font-telemetry" style={{ fontSize: '0.75rem', color: isSelected ? 'var(--color-amber-bright)' : 'var(--color-muted-slate)' }}>
                        {spec.metric}
                      </div>
                    </div>
                    <span style={{ color: isSelected ? 'var(--color-amber-bright)' : 'transparent', fontSize: '1.1rem' }}>
                      →
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detailed Engineering Explanation Display */}
            <div 
              style={{
                backgroundColor: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-lg)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <span className="badge-tag" style={{ marginBottom: 'var(--space-sm)', borderColor: mission.accentColor }}>
                  COMPONENT ANALYSIS · {mission.machine.specs[activeSpecIndex]?.metric}
                </span>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-regolith-white)', marginBottom: 'var(--space-sm)' }}>
                  {mission.machine.specs[activeSpecIndex]?.label}
                </h3>
                <p className="text-body" style={{ lineHeight: 1.7, fontSize: '0.9375rem' }}>
                  {mission.machine.specs[activeSpecIndex]?.detail}
                </p>
              </div>

              <div 
                style={{
                  borderTop: '1px solid var(--color-surface-border)',
                  paddingTop: 'var(--space-sm)',
                  marginTop: 'var(--space-md)',
                  fontSize: '0.75rem',
                  color: 'var(--color-muted-slate)'
                }}
              >
                Audited against primary NASA technical reports and mission manuals.
              </div>
            </div>

          </div>
        </section>

        {/* ==================================================================
            BEAT 3: MISSION (The Traverse Story)
            ================================================================== */}
        <section id="beat-traverse" aria-labelledby="beat-mission-heading" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(260px, 1fr)', gap: 'var(--space-2xl)', alignItems: 'center' }}>
            
            <div>
              <div className="font-telemetry" style={{ color: mission.accentColor, marginBottom: 'var(--space-xs)' }}>
                STAGE 03 · THE TRAVERSE
              </div>
              <h2 id="beat-mission-heading" className="text-display-2" style={{ marginBottom: 'var(--space-md)' }}>
                {mission.missionStory.headline}
              </h2>
              <p className="text-lead" style={{ lineHeight: 1.7, marginBottom: 'var(--space-md)' }}>
                {mission.missionStory.narrative}
              </p>

              {secondaryImage && (
                <div style={{ marginTop: 'var(--space-md)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-surface-border)' }}>
                  <img
                    src={secondaryImage.smallFile}
                    alt={secondaryImage.altText}
                    loading="lazy"
                    width="800"
                    height="500"
                    onLoad={refreshScrollTrigger}
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                  <div style={{ padding: '6px 10px', fontSize: '0.6875rem', color: 'var(--color-muted-slate)', backgroundColor: 'rgba(11, 13, 17, 0.9)' }}>
                    Photo: {secondaryImage.creditLine} ({secondaryImage.nasaId})
                  </div>
                </div>
              )}
            </div>

            {/* Quick Traverse Statistics Docket */}
            <div 
              style={{
                backgroundColor: 'var(--color-surface-charcoal)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-lg)'
              }}
            >
              <div className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)', marginBottom: 'var(--space-md)' }}>
                MISSION LOG · VERIFIED DATA
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>DURATION</div>
                  <div className="font-telemetry" style={{ fontSize: '1.25rem', color: 'var(--color-regolith-white)', fontWeight: 600 }}>
                    {mission.surfaceDuration}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>COMMUNICATION DELAY</div>
                  <div className="font-telemetry" style={{ fontSize: '1.25rem', color: 'var(--color-amber-bright)', fontWeight: 600 }}>
                    {mission.lightTime}
                  </div>
                </div>

                <div style={{ gridColumn: 'span 2', borderTop: '1px solid var(--color-surface-border)', paddingTop: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>PRIMARY SCIENTIFIC MANDATE</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-regolith-white)', marginTop: '2px' }}>
                    {mission.thematicSnippet}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==================================================================
            BEAT 4: EXPERIENCE THE MISSION (Interactive Simulator)
            ================================================================== */}
        <section id="beat-interaction" aria-labelledby="beat-interaction-heading" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div className="font-telemetry" style={{ color: mission.accentColor, marginBottom: 'var(--space-xs)' }}>
            STAGE 04 · INTERACTIVE FLIGHT MODEL
          </div>
          <h2 id="beat-interaction-heading" className="text-display-2" style={{ marginBottom: 'var(--space-xs)' }}>
            {mission.interaction.title}
          </h2>
          <p className="text-body" style={{ maxWidth: '780px', marginBottom: 'var(--space-sm)' }}>
            Real scientific concept: <strong>{mission.interaction.conceptTaught}</strong>. Learn how engineering constraints dictated what astronauts and robotic rovers could achieve.
          </p>

          {/* Mount dynamic interaction */}
          {renderInteraction()}
        </section>

        {/* ==================================================================
            BEAT 5: DISCOVER THE SCIENCE (Verified Discoveries & Takeaway)
            ================================================================== */}
        <section id="beat-science" aria-labelledby="beat-science-heading" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div className="font-telemetry" style={{ color: mission.accentColor, marginBottom: 'var(--space-xs)' }}>
            STAGE 05 · SCIENTIFIC REVELATION
          </div>
          <h2 id="beat-science-heading" className="text-display-2" style={{ marginBottom: 'var(--space-md)' }}>
            {mission.science.headline}
          </h2>

          <div className="science-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
            {mission.science.discoveries.map((item, index) => (
              <div 
                key={item.title}
                className="scroll-reveal-card"
                style={{
                  backgroundColor: 'var(--color-surface-charcoal)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-lg)'
                }}
              >
                <div className="font-telemetry" style={{ color: mission.accentColor, marginBottom: '6px' }}>
                  DISCOVERY 0{index + 1}
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--color-regolith-white)', marginBottom: 'var(--space-xs)' }}>
                  {item.title}
                </h3>
                <p className="text-body" style={{ fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: 'var(--space-sm)' }}>
                  {item.description}
                </p>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-amber-bright)', fontWeight: 500 }}>
                  ✦ {item.significance}
                </div>
              </div>
            ))}
          </div>

          {/* Concise Educational Takeaway Callout */}
          <div 
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: `2px solid ${mission.accentColor}`,
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-xl)',
              textAlign: 'center',
              maxWidth: '820px',
              margin: '0 auto'
            }}
          >
            <div className="font-telemetry" style={{ color: 'var(--color-amber-bright)', marginBottom: '8px' }}>
              CORE EDUCATIONAL TAKEAWAY
            </div>
            <p className="font-editorial" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--color-regolith-white)', margin: 0, fontStyle: 'italic' }}>
              "{mission.science.takeaway}"
            </p>
          </div>
        </section>

        {/* ==================================================================
            BEAT 6: THE LEGACY (Verified Provenance & Current Status)
            ================================================================== */}
        <section 
          id="beat-legacy"
          aria-labelledby="beat-legacy-heading"
          style={{
            backgroundColor: 'var(--color-surface-charcoal)',
            border: '1px solid var(--color-surface-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)'
          }}
        >
          <div className="font-telemetry" style={{ color: 'var(--color-status-parked)', marginBottom: 'var(--space-xs)' }}>
            STAGE 06 · STATUS & VERIFIED PROVENANCE
          </div>
          <h2 id="beat-legacy-heading" className="text-headline-3" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 2rem)', marginBottom: 'var(--space-sm)' }}>
            {mission.legacy.headline}
          </h2>

          <p className="text-lead" style={{ lineHeight: 1.7, marginBottom: 'var(--space-lg)', maxWidth: '840px' }}>
            {mission.legacy.statusStatement}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-surface-border)', paddingTop: 'var(--space-md)' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>OFFICIAL COORDINATES</div>
              <div className="font-telemetry" style={{ fontSize: '1.1rem', color: 'var(--color-amber-bright)' }}>
                {mission.legacy.verifiedCoordinates}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>VERIFICATION REFERENCE</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-regolith-white)' }}>
                {mission.legacy.lrocReference}
              </div>
            </div>

            <button
              onClick={onOpenSources}
              className="badge-tag badge-tag--amber"
              style={{ cursor: 'pointer', padding: '8px 14px' }}
            >
              Examine Primary NASA Documents ({mission.legacy.primarySourceCount}) ↗
            </button>
          </div>
        </section>

      </div>
    </article>
  );
}
