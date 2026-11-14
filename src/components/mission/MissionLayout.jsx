import React, { useState } from 'react';
import LunarRoverSim from '../interactions/LunarRoverSim.jsx';

export default function MissionLayout({ mission, onBackToSelector, onOpenSources }) {
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);

  if (!mission) return null;

  // Render the appropriate interaction based on mission ID
  const renderInteraction = () => {
    switch (mission.id) {
      case 'apollo-15-lrv':
        return <LunarRoverSim />;
      case 'opportunity-mer':
        return (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center', backgroundColor: 'var(--color-surface-charcoal)', borderRadius: 'var(--radius-md)' }}>
            <span className="badge-tag badge-tag--amber">STAGE 3 IN PROGRESS</span>
            <p style={{ marginTop: 'var(--space-sm)', color: 'var(--color-telemetry-silver)' }}>
              Opportunity "Investigate the Martian Evidence" interaction is queued for Stage 3.
            </p>
          </div>
        );
      case 'voyager-1':
        return (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center', backgroundColor: 'var(--color-surface-charcoal)', borderRadius: 'var(--radius-md)' }}>
            <span className="badge-tag badge-tag--amber">STAGE 4 IN PROGRESS</span>
            <p style={{ marginTop: 'var(--space-sm)', color: 'var(--color-telemetry-silver)' }}>
              Voyager 1 "Follow the Signal" telemetry interaction is queued for Stage 4.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <article aria-labelledby="mission-title" style={{ paddingBottom: 'var(--space-3xl)' }}>
      
      {/* Breadcrumb Back Button & Telemetry Docket */}
      <div 
        style={{
          borderBottom: '1px solid var(--color-surface-border-subtle)',
          backgroundColor: 'rgba(20, 24, 32, 0.6)',
          padding: '12px 0'
        }}
      >
        <div className="site-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
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
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-regolith-white)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-telemetry-silver)'}
          >
            ← RETURN TO DESTINATIONS
          </button>

          <div className="font-telemetry" style={{ color: 'var(--color-muted-slate)', fontSize: '0.75rem' }}>
            SECTOR: {mission.destination} · {mission.destinationSector}
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <header 
        style={{
          borderBottom: '1px solid var(--color-surface-border-subtle)',
          padding: 'var(--space-2xl) 0 var(--space-xl)',
          backgroundColor: 'rgba(20, 24, 32, 0.3)'
        }}
      >
        <div className="site-container">
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', marginBottom: 'var(--space-sm)' }}>
            <span className="badge-tag badge-tag--amber">
              {mission.destinationSector}
            </span>
            <span className="badge-tag">
              LIGHT DELAY: {mission.lightTime}
            </span>
            <span className="badge-tag" style={{ color: 'var(--color-status-parked)' }}>
              ● {mission.statusBadge}
            </span>
          </div>

          <h1 id="mission-title" className="text-display-1" style={{ marginBottom: 'var(--space-xs)' }}>
            {mission.machineName}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)', alignItems: 'center', color: 'var(--color-telemetry-silver)', fontSize: '0.9375rem' }}>
            <span><strong>Designation:</strong> {mission.designation}</span>
            <span>•</span>
            <span><strong>Landed:</strong> {mission.landingDate}</span>
            <span>•</span>
            <span><strong>Final Resting Place:</strong> {mission.locationName}</span>
          </div>

        </div>
      </header>

      <div className="site-container" style={{ marginTop: 'var(--space-2xl)' }}>

        {/* ==================================================================
            BEAT 1: MYSTERY (The Hook / The Enigma)
            ================================================================== */}
        <section aria-labelledby="beat-mystery-heading" style={{ marginBottom: 'var(--space-3xl)', maxWidth: '820px' }}>
          <div className="font-telemetry" style={{ color: 'var(--color-lunar-amber)', marginBottom: 'var(--space-xs)' }}>
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
          aria-labelledby="beat-machine-heading"
          style={{
            marginBottom: 'var(--space-3xl)',
            backgroundColor: 'var(--color-surface-charcoal)',
            border: '1px solid var(--color-surface-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)'
          }}
        >
          <div className="font-telemetry" style={{ color: 'var(--color-lunar-amber)', marginBottom: 'var(--space-xs)' }}>
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
                      border: `1px solid ${isSelected ? 'var(--color-lunar-amber)' : 'var(--color-surface-border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      transition: 'all var(--transition-fast)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
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
                <span className="badge-tag badge-tag--amber" style={{ marginBottom: 'var(--space-sm)' }}>
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
        <section aria-labelledby="beat-mission-heading" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.4fr) minmax(260px, 1fr)', gap: 'var(--space-2xl)', alignItems: 'center' }}>
            
            <div>
              <div className="font-telemetry" style={{ color: 'var(--color-lunar-amber)', marginBottom: 'var(--space-xs)' }}>
                STAGE 03 · THE TRAVERSE
              </div>
              <h2 id="beat-mission-heading" className="text-display-2" style={{ marginBottom: 'var(--space-md)' }}>
                {mission.missionStory.headline}
              </h2>
              <p className="text-lead" style={{ lineHeight: 1.7, marginBottom: 'var(--space-md)' }}>
                {mission.missionStory.narrative}
              </p>
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
                TRAVERSE LOG · VERIFIED DATA
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>TOTAL ODOMETER</div>
                  <div className="font-telemetry" style={{ fontSize: '1.5rem', color: 'var(--color-amber-bright)', fontWeight: 700 }}>
                    27.9 km
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)' }}>17.3 miles driven</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>SAMPLES RETURNED</div>
                  <div className="font-telemetry" style={{ fontSize: '1.5rem', color: 'var(--color-regolith-white)', fontWeight: 700 }}>
                    77 kg
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)' }}>Documented rock samples</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>SURFACE STAY</div>
                  <div className="font-telemetry" style={{ fontSize: '1.25rem', color: 'var(--color-regolith-white)', fontWeight: 600 }}>
                    66h 54m
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)' }}>3 EVAs on surface</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>WALK-BACK SAFETY</div>
                  <div className="font-telemetry" style={{ fontSize: '1.25rem', color: '#60A5FA', fontWeight: 600 }}>
                    5.0 km
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)' }}>Max separation radius</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ==================================================================
            BEAT 4: EXPERIENCE THE MISSION (Interactive Simulator)
            ================================================================== */}
        <section aria-labelledby="beat-interaction-heading" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div className="font-telemetry" style={{ color: 'var(--color-lunar-amber)', marginBottom: 'var(--space-xs)' }}>
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
        <section aria-labelledby="beat-science-heading" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div className="font-telemetry" style={{ color: 'var(--color-lunar-amber)', marginBottom: 'var(--space-xs)' }}>
            STAGE 05 · SCIENTIFIC REVELATION
          </div>
          <h2 id="beat-science-heading" className="text-display-2" style={{ marginBottom: 'var(--space-md)' }}>
            {mission.science.headline}
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
            {mission.science.discoveries.map((item, index) => (
              <div 
                key={item.title}
                style={{
                  backgroundColor: 'var(--color-surface-charcoal)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-lg)'
                }}
              >
                <div className="font-telemetry" style={{ color: 'var(--color-lunar-amber)', marginBottom: '6px' }}>
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
              backgroundColor: 'rgba(232, 144, 32, 0.08)',
              border: '2px solid var(--color-lunar-amber)',
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
              <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>OFFICIAL SURFACE COORDINATES</div>
              <div className="font-telemetry" style={{ fontSize: '1.1rem', color: 'var(--color-amber-bright)' }}>
                {mission.legacy.verifiedCoordinates}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>ORBITAL PHOTOGRAPHIC VERIFICATION</div>
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
