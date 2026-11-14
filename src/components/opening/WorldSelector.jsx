import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MOTION_DURATION, MOTION_EASE, refreshScrollTrigger } from '../../styles/motion.js';
import { imageCredits } from '../../data/credits.js';

export default function WorldSelector({ onSelectMission }) {
  const [hoveredDestination, setHoveredDestination] = useState('apollo-15-lrv');
  const selectorRef = useRef(null);

  const destinations = [
    {
      id: 'apollo-15-lrv',
      number: '01',
      world: 'THE MOON',
      distance: '384,400 KM',
      lightDelay: '1.3 light-seconds',
      vehicle: 'Apollo 15 Lunar Roving Vehicle',
      location: 'Station 9A · Hadley Rille',
      headline: 'The First Wheels on Another World',
      synopsis: 'How astronauts drove across an airless volcanic valley using resilient piano-wire wheels and dead-reckoning navigation.',
      statusLabel: 'VERIFIED PARKED',
      accent: 'var(--color-lunar-amber)',
      imageKey: 'apollo15_rover_irwin',
      isAvailable: true,
      stageNote: 'AVAILABLE NOW'
    },
    {
      id: 'opportunity-mer',
      number: '02',
      world: 'MARS',
      distance: '~225,000,000 KM',
      lightDelay: '~12.5 light-minutes',
      vehicle: 'Opportunity Rover (MER-B)',
      location: 'Perseverance Valley · Endeavour Crater',
      headline: '15 Years of Following the Water',
      synopsis: 'Designed for 90 days, it survived 5,000 sols to uncover hematite spherules, gypsum veins, and ancient neutral water.',
      statusLabel: 'RESTING IN VALLEY',
      accent: 'var(--color-mars-rust)',
      imageKey: 'opportunity_self_portrait',
      isAvailable: true,
      stageNote: 'AVAILABLE NOW'
    },
    {
      id: 'voyager-1',
      number: '03',
      world: 'DEEP SPACE',
      distance: '25.9 BILLION KM (1 LIGHT-DAY)',
      lightDelay: '24.0 light-hours (one-way)',
      vehicle: 'Voyager 1 Spacecraft',
      location: 'Interstellar Space · Beyond Heliopause',
      headline: 'The First Messenger to the Stars',
      synopsis: 'Never abandoned, never dead. Operating on nuclear decay with two surviving instruments beyond the Sun\'s magnetic bubble.',
      statusLabel: 'ACTIVE INTERSTELLAR EXPLORER',
      accent: 'var(--color-deep-gold)',
      imageKey: 'voyager1_spacecraft',
      isAvailable: true,
      stageNote: 'AVAILABLE NOW'
    }
  ];

  useEffect(() => {
    const el = selectorRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Staggered ScrollTrigger reveal for destinations
      gsap.fromTo('.world-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION_DURATION.slow,
          stagger: 0.18,
          ease: MOTION_EASE.editorial,
          scrollTrigger: {
            trigger: el,
            start: 'top 82%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.world-card', { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section 
      ref={selectorRef}
      aria-labelledby="world-selector-heading" 
      style={{ padding: 'var(--space-2xl) 0 var(--space-3xl)' }}
    >
      <div className="site-container">
        
        {/* Editorial Section Header */}
        <div style={{ maxWidth: '820px', marginBottom: 'var(--space-2xl)' }}>
          <div className="font-telemetry" style={{ color: 'var(--color-lunar-amber)', marginBottom: 'var(--space-xs)' }}>
            SECTOR DISPATCH · ASTRONOMICAL TRAVERSE
          </div>
          <h2 id="world-selector-heading" className="text-display-1" style={{ marginBottom: 'var(--space-sm)' }}>
            Choose Your World.
          </h2>
          <p className="text-lead" style={{ color: 'var(--color-telemetry-silver)' }}>
            Explore three distinct frontiers of human exploration, ordered by distance from Earth. Authentic NASA photography and verified engineering archives.
          </p>
        </div>

        {/* Asymmetric Editorial Destination Ladder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          
          {destinations.map((dest) => {
            const isHovered = hoveredDestination === dest.id;
            const imgRecord = imageCredits.find((c) => c.key === dest.imageKey);

            return (
              <div
                key={dest.id}
                className="world-card"
                onMouseEnter={() => setHoveredDestination(dest.id)}
                onFocus={() => setHoveredDestination(dest.id)}
                style={{
                  backgroundColor: isHovered ? 'var(--color-surface-elevated)' : 'var(--color-surface-charcoal)',
                  border: `1px solid ${isHovered ? dest.accent : 'var(--color-surface-border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Visual Accent Bar */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '4px',
                    backgroundColor: dest.accent
                  }} 
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)', alignItems: 'center' }}>
                  
                  {/* Left Column: Sector Index & Typographic Statement */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)', flexWrap: 'wrap' }}>
                      <span className="font-telemetry" style={{ color: dest.accent, fontWeight: 700 }}>
                        DESTINATION {dest.number}
                      </span>
                      <span style={{ color: 'var(--color-muted-slate)' }}>•</span>
                      <span className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)' }}>
                        {dest.distance}
                      </span>
                      <span className="badge-tag" style={{ marginLeft: 'auto', fontSize: '0.6875rem' }}>
                        {dest.stageNote}
                      </span>
                    </div>

                    <h3 className="text-display-2" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', marginBottom: 'var(--space-xs)' }}>
                      {dest.world}
                    </h3>
                    
                    <div style={{ fontSize: '1.1rem', color: 'var(--color-regolith-white)', fontWeight: 500, marginBottom: 'var(--space-xs)' }}>
                      {dest.vehicle}
                    </div>

                    <div className="font-telemetry" style={{ color: 'var(--color-muted-slate)', marginBottom: 'var(--space-md)' }}>
                      {dest.location} · LIGHT DELAY: {dest.lightDelay}
                    </div>

                    <p className="text-body" style={{ fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '520px', marginBottom: 'var(--space-lg)' }}>
                      {dest.synopsis}
                    </p>

                    {/* Action Button */}
                    {dest.isAvailable ? (
                      <button
                        onClick={() => onSelectMission(dest.id)}
                        aria-label={`Enter ${dest.world} mission: ${dest.vehicle}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--space-xs)',
                          padding: '12px 22px',
                          backgroundColor: dest.accent,
                          borderRadius: 'var(--radius-sm)',
                          color: '#0B0D11',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          letterSpacing: '0.04em',
                          cursor: 'pointer'
                        }}
                      >
                        EXPLORE THE MISSION →
                      </button>
                    ) : (
                      <div 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 'var(--space-xs)',
                          padding: '10px 18px',
                          backgroundColor: 'var(--color-surface-charcoal)',
                          border: '1px dashed var(--color-surface-border)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-muted-slate)',
                          fontSize: '0.8125rem'
                        }}
                      >
                        🔒 Staged for Verification Sprint ({dest.stageNote})
                      </div>
                    )}
                  </div>

                  {/* Right Column: Authentic NASA Image Frame & Visible Credit */}
                  <div>
                    {imgRecord && (
                      <div 
                        style={{
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          border: '1px solid var(--color-surface-border)',
                          backgroundColor: '#0E1117'
                        }}
                      >
                        <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                          <img
                            src={imgRecord.smallFile}
                            alt={imgRecord.altText}
                            loading="lazy"
                            width="800"
                            height="500"
                            onLoad={refreshScrollTrigger}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform var(--transition-medium), opacity var(--transition-fast)',
                              transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                              opacity: isHovered ? 1 : 0.9
                            }}
                          />
                          {imgRecord.type === 'illustration' && (
                            <span 
                              className="badge-tag"
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(11, 13, 17, 0.85)',
                                color: 'var(--color-amber-bright)',
                                borderColor: 'rgba(245, 158, 11, 0.4)'
                              }}
                            >
                              ILLUSTRATION
                            </span>
                          )}
                        </div>

                        {/* Visible Credit Strip */}
                        <div 
                          style={{
                            padding: '8px 12px',
                            backgroundColor: 'rgba(11, 13, 17, 0.95)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.6875rem',
                            color: 'var(--color-muted-slate)',
                            borderTop: '1px solid var(--color-surface-border-subtle)'
                          }}
                        >
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                            {imgRecord.creditLine}
                          </span>
                          <span className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)' }}>
                            {imgRecord.nasaId}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
