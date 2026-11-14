import React, { useState } from 'react';

export default function WorldSelector({ onSelectMission }) {
  const [hoveredDestination, setHoveredDestination] = useState('apollo-15-lrv');

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
      isAvailable: false,
      stageNote: 'UNLOCKS IN STAGE 3'
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
      isAvailable: false,
      stageNote: 'UNLOCKS IN STAGE 4'
    }
  ];

  return (
    <section 
      aria-labelledby="world-selector-heading" 
      style={{ padding: 'var(--space-2xl) 0 var(--space-3xl)' }}
    >
      <div className="site-container">
        
        {/* Editorial Section Header */}
        <div style={{ maxWidth: '780px', marginBottom: 'var(--space-2xl)' }}>
          <div className="font-telemetry" style={{ color: 'var(--color-lunar-amber)', marginBottom: 'var(--space-xs)' }}>
            SECTOR DISPATCH · ASTRONOMICAL TRAVERSE
          </div>
          <h2 id="world-selector-heading" className="text-display-1" style={{ marginBottom: 'var(--space-sm)' }}>
            Choose Your World.
          </h2>
          <p className="text-lead" style={{ color: 'var(--color-telemetry-silver)' }}>
            Explore three distinct frontiers of human exploration, ordered by distance from Earth. Each mission reveals how engineering solved the impossible.
          </p>
        </div>

        {/* Asymmetric Editorial Destination Ladder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          
          {destinations.map((dest) => {
            const isHovered = hoveredDestination === dest.id;
            return (
              <div
                key={dest.id}
                onMouseEnter={() => setHoveredDestination(dest.id)}
                onFocus={() => setHoveredDestination(dest.id)}
                style={{
                  backgroundColor: isHovered ? 'var(--color-surface-elevated)' : 'var(--color-surface-charcoal)',
                  border: `1px solid ${isHovered ? dest.accent : 'var(--color-surface-border)'}`,
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-xl)',
                  transition: 'all var(--transition-medium)',
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

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-lg)', alignItems: 'center' }}>
                  
                  {/* Left Column: Sector Index & Typographic Statement */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginBottom: 'var(--space-xs)' }}>
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

                  {/* Right Column: Editorial Dossier Preview */}
                  <div 
                    style={{
                      backgroundColor: 'rgba(11, 13, 17, 0.6)',
                      border: '1px solid var(--color-surface-border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: 'var(--space-lg)'
                    }}
                  >
                    <div className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)', marginBottom: 'var(--space-sm)' }}>
                      EDITORIAL PREVIEW · BEAT SUMMARY
                    </div>

                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)' }}>THE CORE MYSTERY</div>
                      <div style={{ color: 'var(--color-regolith-white)', fontWeight: 500, fontSize: '0.9375rem' }}>
                        "{dest.headline}"
                      </div>
                    </div>

                    <div style={{ marginBottom: 'var(--space-md)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)' }}>VERIFIED CURRENT STATUS</div>
                      <div className="badge-tag" style={{ marginTop: '4px', color: dest.accent, borderColor: 'rgba(255,255,255,0.1)' }}>
                        ● {dest.statusLabel}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)', borderTop: '1px solid var(--color-surface-border-subtle)', paddingTop: 'var(--space-xs)' }}>
                      Audited against NASA Primary Documentation
                    </div>
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
