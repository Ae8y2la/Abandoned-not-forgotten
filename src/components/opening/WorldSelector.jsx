import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { ArrowRight, Compass } from 'lucide-react';
import { MOTION_DURATION, MOTION_EASE, refreshScrollTrigger } from '../../styles/motion.js';
import { imageCredits } from '../../data/credits.js';

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  {
    id: 'apollo-15-lrv',
    number: '01',
    world: 'MOON',
    distance: '384,400 KM',
    lightDelay: '1.3 light-seconds',
    vehicle: 'Apollo 15 Lunar Roving Vehicle',
    location: 'Station 9A · Hadley Rille',
    headline: 'The First Wheels on Another World',
    synopsis: 'How astronauts drove across an airless volcanic valley using resilient piano-wire wheels and dead-reckoning navigation.',
    statusLabel: 'VERIFIED PARKED',
    accent: 'var(--color-lunar-amber)',
    imageKey: 'apollo15_rover_irwin',
    scaleStart: 0.94
  },
  {
    id: 'opportunity-mer',
    number: '02',
    world: 'MARS',
    distance: '~225,000,000 KM',
    lightDelay: '~12.5 light-minutes',
    vehicle: 'Opportunity Rover (MER-B)',
    location: 'Perseverance Valley · Endeavour Crater',
    headline: '14+ Years of Following the Water',
    synopsis: 'Designed for 90 days, it survived 5,000 sols to uncover hematite spherules, gypsum veins, and ancient neutral water.',
    statusLabel: 'RESTING IN VALLEY',
    accent: 'var(--color-mars-rust)',
    imageKey: 'opportunity_self_portrait',
    scaleStart: 0.96
  },
  {
    id: 'voyager-1',
    number: '03',
    world: 'DEEP SPACE',
    distance: '25.9 BILLION KM (1 LIGHT-DAY)',
    lightDelay: '24.0 light-hours (one-way)',
    vehicle: 'Voyager 1 Interstellar Spacecraft',
    location: 'Interstellar Space · Beyond Heliopause',
    headline: 'The First Messenger to the Stars',
    synopsis: 'Never abandoned, never dead. Operating on nuclear decay with two surviving instruments beyond the Sun\'s realm.',
    statusLabel: 'ACTIVE INTERSTELLAR EXPLORER',
    accent: 'var(--color-deep-gold)',
    imageKey: 'voyager1_spacecraft',
    scaleStart: 0.98
  }
];

export default function WorldSelector({ onSelectMission }) {
  const [hoveredDestination, setHoveredDestination] = useState('apollo-15-lrv');
  const [transitioningId, setTransitioningId] = useState(null);
  const selectorRef = useRef(null);

  useEffect(() => {
    const el = selectorRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Staggered ScrollTrigger reveal for destinations with distinct scales
      destinations.forEach((dest) => {
        gsap.fromTo(`.world-card-${dest.id}`,
          { opacity: 0, y: 32, scale: dest.scaleStart },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: MOTION_DURATION.slow,
            ease: MOTION_EASE.editorial,
            scrollTrigger: {
              trigger: `.world-card-${dest.id}`,
              start: 'top 85%',
              toggleActions: 'play none none none'
            }
          }
        );
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.world-card', { opacity: 1, y: 0, scale: 1 });
    });

    return () => mm.revert();
  }, []);

  const handleCardClick = (id) => {
    if (transitioningId) return;
    setTransitioningId(id);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      onSelectMission(id);
      setTransitioningId(null);
      return;
    }

    // Quick cinematic zoom-transition (<0.4s)
    const card = document.querySelector(`.world-card-${id}`);
    if (card) {
      gsap.to(card, {
        scale: 1.02,
        opacity: 0.9,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          onSelectMission(id);
          setTransitioningId(null);
        }
      });
    } else {
      onSelectMission(id);
      setTransitioningId(null);
    }
  };

  return (
    <section 
      ref={selectorRef}
      id="choose-your-world"
      aria-labelledby="world-selector-heading" 
      style={{ padding: 'var(--space-2xl) 0 var(--space-3xl)' }}
    >
      <div className="site-container">
        
        {/* Editorial Section Header */}
        <div style={{ maxWidth: '820px', marginBottom: 'var(--space-2xl)' }}>
          <div className="font-telemetry" style={{ color: 'var(--color-lunar-amber)', marginBottom: 'var(--space-xs)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={14} aria-hidden="true" />
            <span>SECTOR DISPATCH · ASTRONOMICAL TRAVERSE</span>
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
                className={`world-card world-card-${dest.id}`}
                onMouseEnter={() => setHoveredDestination(dest.id)}
                onFocus={() => setHoveredDestination(dest.id)}
                onClick={() => handleCardClick(dest.id)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(dest.id);
                  }
                }}
                aria-label={`Enter ${dest.world} mission: ${dest.vehicle}`}
                style={{
                  backgroundColor: isHovered ? 'var(--color-surface-elevated)' : 'var(--color-surface-charcoal)',
                  border: `1px solid ${isHovered ? dest.accent : 'var(--color-surface-border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  transition: 'background-color var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer'
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
                      <span className="badge-tag badge-tag--amber" style={{ marginLeft: 'auto', fontSize: '0.6875rem' }}>
                        {dest.statusLabel}
                      </span>
                    </div>

                    {/* Oversized World Typography */}
                    <h3 
                      className="text-display-1" 
                      style={{ 
                        fontSize: 'clamp(2.4rem, 6vw, 4.4rem)', 
                        lineHeight: 1.05, 
                        letterSpacing: '-0.02em', 
                        marginBottom: 'var(--space-xs)',
                        color: isHovered ? 'var(--color-regolith-white)' : 'var(--color-off-white)'
                      }}
                    >
                      {dest.world}
                    </h3>
                    
                    <div style={{ fontSize: '1.15rem', color: dest.accent, fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
                      {dest.vehicle}
                    </div>

                    <div className="font-telemetry" style={{ color: 'var(--color-muted-slate)', marginBottom: 'var(--space-md)' }}>
                      {dest.location} · LIGHT DELAY: {dest.lightDelay}
                    </div>

                    <p className="text-body" style={{ fontSize: '0.9375rem', lineHeight: 1.6, maxWidth: '520px', marginBottom: 'var(--space-lg)' }}>
                      {dest.synopsis}
                    </p>

                    {/* Action Button */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-xs)',
                        padding: '12px 24px',
                        backgroundColor: dest.accent,
                        borderRadius: 'var(--radius-sm)',
                        color: '#0B0D11',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        letterSpacing: '0.04em'
                      }}
                    >
                      <span>EXPLORE THE MISSION</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </div>
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
                        <div style={{ position: 'relative', overflow: 'hidden', height: '260px' }}>
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
                              transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                              opacity: isHovered ? 1 : 0.88
                            }}
                          />
                          {imgRecord.type === 'illustration' && (
                            <span 
                              className="badge-tag"
                              style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'rgba(11, 13, 17, 0.9)',
                                color: 'var(--color-amber-bright)',
                                borderColor: 'rgba(245, 158, 11, 0.5)',
                                fontWeight: 700
                              }}
                            >
                              ARTIST'S CONCEPT
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
