import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { MOTION_DURATION, MOTION_EASE } from '../../styles/motion.js';

export default function MarsEvidenceLab() {
  const containerRef = useRef(null);
  const meterRef = useRef(null);

  const clues = [
    {
      id: 'blueberries',
      name: 'Hematite Spherules ("Blueberries")',
      location: 'Eagle Crater · Meridiani Planum',
      discoveredDate: 'March 2004 (Sol 34)',
      instrument: 'Microscopic Imager & Mössbauer Spectrometer',
      image: '/assets/nasa/opportunity_blueberries_800.webp',
      alt: 'Microscopic Imager close-up of spherical hematite blueberries in martian soil',
      nasaId: 'PIA05273',
      correctEnvId: 'standing_water',
      hint: 'Millimeter-sized iron-rich spherules that precipitated out of standing groundwater soaked in porous sedimentary rock.'
    },
    {
      id: 'jarosite',
      name: 'Jarosite Mineral Matrix',
      location: 'Eagle Crater Outcrop · Meridiani',
      discoveredDate: 'Sol 40',
      instrument: 'APXS & Mössbauer Spectrometer',
      nasaId: 'JPL MER-B APXS',
      correctEnvId: 'acidic_water',
      hint: 'A hydrated iron-potassium sulfate mineral that forms only when liquid water is intensely acidic (low pH), resembling acid mine drainage.'
    },
    {
      id: 'gypsum',
      name: 'Homestake Gypsum Vein',
      location: 'Endeavour Crater Rim · Cape York',
      discoveredDate: 'December 2011 (Sol 2777)',
      instrument: 'Microscopic Imager & APXS',
      image: '/assets/nasa/opportunity_homestake_vein_800.webp',
      alt: 'Pancam false-color view of Homestake calcium sulfate vein protruding from bedrock',
      nasaId: 'PIA15033',
      correctEnvId: 'fracture_water',
      hint: 'A thumb-wide vein of pure calcium sulfate (gypsum) deposited by subterranean water circulating through bedrock fractures.'
    },
    {
      id: 'clay',
      name: 'Smectite Clay Minerals (Phyllosilicates)',
      location: 'Matijevic Hill · Endeavour Crater',
      discoveredDate: 'June 2013 (Sol 3300+)',
      instrument: 'APXS & CRISM Orbital Guidance',
      nasaId: 'PIA16703',
      correctEnvId: 'neutral_water',
      hint: 'Layered sheet-silicate clays formed under mild, neutral-pH water conditions. CRITICAL NOTE: Indicates benign water conditions, strictly NOT proof of biological life!'
    }
  ];

  const environments = [
    {
      id: 'standing_water',
      title: 'Standing Liquid Groundwater',
      description: 'Persistent surface and sub-surface water pooling in sand and porous sediment.',
      matchedClueId: 'blueberries'
    },
    {
      id: 'acidic_water',
      title: 'Highly Acidic Water (Low pH)',
      description: 'Harsh sulfurous waters resembling acid mine drainage; hostile to organic structures.',
      matchedClueId: 'jarosite'
    },
    {
      id: 'fracture_water',
      title: 'Fracture-Circulating Water',
      description: 'Warm hydrothermal fluids moving through bedrock cracks, dissolving and depositing calcium.',
      matchedClueId: 'gypsum'
    },
    {
      id: 'neutral_water',
      title: 'Mild, Neutral-pH Water (Benign)',
      description: 'Ancient, non-acidic water chemistry. (Confirmed water environment, strictly NOT proof of life).',
      matchedClueId: 'clay'
    }
  ];

  const [selectedClueId, setSelectedClueId] = useState('blueberries');
  const [matchedPairs, setMatchedPairs] = useState({}); // { [clueId]: envId }
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const matchedCount = Object.keys(matchedPairs).length;
  const isComplete = matchedCount === clues.length;
  const activeClue = clues.find((c) => c.id === selectedClueId);

  // Handle matching interaction
  const handleMatch = (envId) => {
    if (!selectedClueId) return;
    const clue = clues.find((c) => c.id === selectedClueId);

    if (clue.correctEnvId === envId) {
      setMatchedPairs((prev) => ({ ...prev, [selectedClueId]: envId }));
      const envTitle = environments.find((e) => e.id === envId)?.title;
      setFeedbackMsg(`✓ Correct Match: ${clue.name} confirms ${envTitle}!`);
      
      // Auto-select next unmatched clue
      const nextUnmatched = clues.find((c) => c.id !== selectedClueId && !matchedPairs[c.id]);
      if (nextUnmatched) {
        setSelectedClueId(nextUnmatched.id);
      }
    } else {
      setFeedbackMsg(`✕ Mineral mismatch. Inspect the geological hint and try another water environment.`);
    }
  };

  const handleReset = () => {
    setMatchedPairs({});
    setSelectedClueId('blueberries');
    setFeedbackMsg("Analysis reset. Select a mineral specimen to begin.");
  };

  // GSAP animation on evidence-meter fill
  useEffect(() => {
    if (!meterRef.current) return;
    const percentage = (matchedCount / clues.length) * 100;

    gsap.to(meterRef.current, {
      width: `${percentage}%`,
      duration: MOTION_DURATION.medium,
      ease: MOTION_EASE.editorial
    });

    if (isComplete) {
      gsap.fromTo('.verdict-banner',
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: MOTION_DURATION.slow, ease: MOTION_EASE.editorial }
      );
    }
  }, [matchedCount, isComplete, clues.length]);

  return (
    <section 
      ref={containerRef}
      aria-label="Mars Evidence Lab: Paleo-Hydrological Mineral Analysis"
      style={{
        backgroundColor: 'var(--color-surface-charcoal)',
        border: '1px solid var(--color-surface-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        marginTop: 'var(--space-md)'
      }}
    >
      {/* Header & Mandatory Simplified Model Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: 'var(--space-md)' }}>
        <span className="badge-tag badge-tag--model">
          Simplified model · Paleo-Hydrological Mineral Analysis
        </span>
        <span className="badge-tag" style={{ color: 'var(--color-mars-rust)', borderColor: 'rgba(200, 86, 50, 0.4)' }}>
          MER-B ATHENA PAYLOAD
        </span>
      </div>

      <div style={{ marginBottom: 'var(--space-md)' }}>
        <h3 className="text-headline-3" style={{ marginBottom: '4px' }}>
          Investigate the Martian Evidence: Decode the Water History
        </h3>
        <p className="text-body" style={{ fontSize: '0.9375rem', maxWidth: '820px' }}>
          Select each mineral sample discovered by Opportunity, review its geological composition, and match it to the ancient water environment that produced it.
        </p>
      </div>

      {/* GSAP-Driven Evidence Reconstruction Meter */}
      <div 
        style={{
          backgroundColor: 'var(--color-surface-elevated)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-sm)',
          marginBottom: 'var(--space-md)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.8125rem' }}>
          <span className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)' }}>
            PALEOHYDROLOGY RECONSTRUCTION PROGRESS
          </span>
          <span className="font-telemetry" style={{ color: 'var(--color-amber-bright)', fontWeight: 600 }}>
            {matchedCount} OF {clues.length} MINERALS MATCHED ({Math.round((matchedCount / clues.length) * 100)}%)
          </span>
        </div>

        {/* Outer Bar */}
        <div 
          style={{
            width: '100%',
            height: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '5px',
            overflow: 'hidden'
          }}
        >
          {/* Inner Meter Fill (GSAP Animated) */}
          <div
            ref={meterRef}
            style={{
              width: '0%',
              height: '100%',
              backgroundColor: isComplete ? 'var(--color-status-active)' : 'var(--color-mars-rust)',
              transition: 'background-color 300ms ease'
            }}
          />
        </div>
      </div>

      {/* Dynamic Screen Reader Feedback Live Region */}
      <div 
        aria-live="polite" 
        className="font-telemetry" 
        style={{
          minHeight: '24px',
          fontSize: '0.8125rem',
          color: feedbackMsg && feedbackMsg.startsWith('✓') ? 'var(--color-status-active)' : 'var(--color-amber-bright)',
          marginBottom: 'var(--space-sm)'
        }}
      >
        {feedbackMsg}
      </div>

      {/* Interactive Two-Column Lab Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 'var(--space-md)', alignItems: 'start' }}>
        
        {/* Left Column: Mineral Clues Discovered by Opportunity */}
        <div>
          <div className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)', marginBottom: '8px' }}>
            STEP 1: SELECT A DISCOVERED MINERAL CLUE
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} role="tablist" aria-label="Mineral evidence clues">
            {clues.map((clue) => {
              const isSelected = selectedClueId === clue.id;
              const isMatched = !!matchedPairs[clue.id];

              return (
                <button
                  key={clue.id}
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedClueId(clue.id)}
                  style={{
                    textAlign: 'left',
                    padding: '12px 14px',
                    backgroundColor: isSelected ? 'var(--color-surface-elevated)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--color-mars-rust)' : isMatched ? 'rgba(16, 185, 129, 0.4)' : 'var(--color-surface-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, color: isSelected ? 'var(--color-regolith-white)' : 'var(--color-telemetry-silver)', fontSize: '0.9375rem' }}>
                      {clue.name}
                    </div>
                    {isMatched ? (
                      <span style={{ color: 'var(--color-status-active)', fontSize: '0.8125rem', fontWeight: 600 }}>✓ Matched</span>
                    ) : (
                      <span style={{ color: 'var(--color-muted-slate)', fontSize: '0.75rem' }}>Unanalyzed</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-slate)', marginTop: '2px' }}>
                    {clue.location} · {clue.instrument}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Clue Inspector Box with Authentic NASA Close-Up Image */}
          {activeClue && (
            <div 
              style={{
                marginTop: 'var(--space-md)',
                backgroundColor: 'rgba(11, 13, 17, 0.75)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px'
              }}
            >
              {activeClue.image && (
                <div style={{ height: '140px', width: '100%', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '8px', border: '1px solid var(--color-surface-border)' }}>
                  <img 
                    src={activeClue.image} 
                    alt={activeClue.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                  />
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className="font-telemetry" style={{ color: 'var(--color-amber-bright)' }}>
                  GEOLOGICAL SPECIMEN INSPECTOR
                </span>
                {activeClue.nasaId && (
                  <span className="font-telemetry" style={{ fontSize: '0.6875rem', color: 'var(--color-telemetry-silver)' }}>
                    NASA ID: {activeClue.nasaId}
                  </span>
                )}
              </div>
              <p className="text-body" style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                {activeClue.hint}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Paleohydrological Environment Receptors */}
        <div>
          <div className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)', marginBottom: '8px' }}>
            STEP 2: MATCH TO ANCIENT WATER ENVIRONMENT
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {environments.map((env) => {
              const matchedClue = clues.find((c) => matchedPairs[c.id] === env.id);

              return (
                <div
                  key={env.id}
                  onClick={() => handleMatch(env.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleMatch(env.id);
                  }}
                  style={{
                    padding: '14px 16px',
                    backgroundColor: matchedClue ? 'rgba(16, 185, 129, 0.08)' : 'var(--color-surface-elevated)',
                    border: `1px solid ${matchedClue ? 'var(--color-status-active)' : 'var(--color-surface-border)'}`,
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-regolith-white)', fontSize: '0.9375rem' }}>
                      {env.title}
                    </div>
                    <span className="badge-tag" style={{ fontSize: '0.6875rem' }}>
                      {matchedClue ? 'CONFIRMED' : 'CLICK TO MATCH'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-telemetry-silver)', margin: 0, lineHeight: 1.5 }}>
                    {env.description}
                  </p>

                  {matchedClue && (
                    <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--color-status-active)', fontWeight: 500 }}>
                      Evidence: {matchedClue.name} ({matchedClue.location})
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Completion Banner (Verdict) */}
      {isComplete && (
        <div 
          className="verdict-banner"
          style={{
            marginTop: 'var(--space-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--color-status-active)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 'var(--space-sm)'
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-status-active)', fontSize: '1rem', marginBottom: '2px' }}>
              ✓ SCIENTIFIC VERDICT COMPLETE: Mars Underwent Multi-Epoch Water Evolution
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-regolith-white)', margin: 0, maxWidth: '720px', lineHeight: 1.5 }}>
              By analyzing these four minerals, Opportunity demonstrated that Mars was not merely wet once, but experienced distinct hydrological epochs—transitioning from ancient neutral, drinkable water (clays) to an acidic sulfurous era (jarosite) before drying into the desert we see today. (Note: Proves water history, strictly not proof of life).
            </p>
          </div>
          <button
            onClick={handleReset}
            className="badge-tag"
            style={{ cursor: 'pointer', padding: '8px 12px', background: 'transparent' }}
          >
            Re-run Analysis
          </button>
        </div>
      )}
    </section>
  );
}
