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
      alt: 'Microscopic Imager view of spherical hematite blueberries in martian soil',
      correctEnvId: 'standing_water',
      hint: 'Millimeter-sized iron-rich spheres that precipitated out of standing groundwater soaked in porous rock.'
    },
    {
      id: 'jarosite',
      name: 'Jarosite Mineral Matrix',
      location: 'Eagle Crater Outcrop · Meridiani',
      discoveredDate: 'Sol 40',
      instrument: 'APXS & Mössbauer Spectrometer',
      correctEnvId: 'acidic_water',
      hint: 'A hydrated iron-potassium sulfate mineral that forms only when liquid water is intensely acidic.'
    },
    {
      id: 'gypsum',
      name: 'Homestake Gypsum Vein',
      location: 'Endeavour Crater Rim · Cape York',
      discoveredDate: 'December 2011 (Sol 2777)',
      instrument: 'Microscopic Imager & APXS',
      correctEnvId: 'fracture_water',
      hint: 'A thumb-wide line of pure calcium sulfate deposited by water flowing through rock fractures.'
    },
    {
      id: 'clay',
      name: 'Smectite Clay Minerals (Phyllosilicates)',
      location: 'Matijevic Hill · Endeavour Crater',
      discoveredDate: 'June 2013 (Sol 3300+)',
      instrument: 'APXS & CRISM Orbital Guidance',
      correctEnvId: 'neutral_water',
      hint: 'Layered sheet-silicate clays formed under mild, neutral-pH water conditions before Mars turned acidic.'
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
      title: 'Mild, Neutral-pH Water (Potable)',
      description: 'Ancient, non-acidic water chemistry favorable for chemistry (indicator of water, NOT proof of life).',
      matchedClueId: 'clay'
    }
  ];

  const [selectedClueId, setSelectedClueId] = useState('blueberries');
  const [matchedPairs, setMatchedPairs] = useState({}); // { [clueId]: envId }
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const matchedCount = Object.keys(matchedPairs).length;
  const isComplete = matchedCount === clues.length;

  // Handle matching interaction
  const handleMatch = (envId) => {
    if (!selectedClueId) return;
    const clue = clues.find((c) => c.id === selectedClueId);

    if (clue.correctEnvId === envId) {
      setMatchedPairs((prev) => {
        const next = { ...prev, [selectedClueId]: envId };
        return next;
      });
      setFeedbackMsg(`✓ Correct Match: ${clue.name} confirms ${environments.find((e) => e.id === envId).title}!`);
      
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
          SIMPLIFIED TEACHING MODEL: PALEO-HYDROLOGICAL MINERAL ANALYSIS
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

        <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            ref={meterRef}
            style={{
              width: '0%',
              height: '100%',
              backgroundColor: 'var(--color-mars-rust)',
              borderRadius: '4px'
            }}
          />
        </div>
      </div>

      {/* Main Interactive Stage: Clues vs Environment Receptors */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-md)', alignItems: 'start' }}>
        
        {/* Left Column: Mineral Clue Cards */}
        <div>
          <div className="font-telemetry" style={{ color: 'var(--color-telemetry-silver)', marginBottom: '8px' }}>
            STEP 1: SELECT A MINERAL SPECIMEN
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {clues.map((clue) => {
              const isSelected = selectedClueId === clue.id;
              const isMatched = !!matchedPairs[clue.id];

              return (
                <button
                  key={clue.id}
                  onClick={() => setSelectedClueId(clue.id)}
                  aria-pressed={isSelected}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    backgroundColor: isSelected ? 'var(--color-surface-elevated)' : 'transparent',
                    border: `1px solid ${isSelected ? 'var(--color-mars-rust)' : isMatched ? 'var(--color-status-active)' : 'var(--color-surface-border)'}`,
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
                      <span style={{ color: 'var(--color-status-active)', fontSize: '0.8125rem' }}>✓ Matched</span>
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

          {/* Active Clue Inspector Box */}
          {selectedClueId && (
            <div 
              style={{
                marginTop: 'var(--space-md)',
                backgroundColor: 'rgba(11, 13, 17, 0.65)',
                border: '1px solid var(--color-surface-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px'
              }}
            >
              <div className="font-telemetry" style={{ color: 'var(--color-amber-bright)', marginBottom: '4px' }}>
                MICROSCOPIC EVIDENCE NOTE
              </div>
              <p className="text-body" style={{ fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                {clues.find((c) => c.id === selectedClueId)?.hint}
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
                      ✦ Proven by: {matchedClue.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Mandatory Scientific Guardrail Alert (Clay is NOT evidence of life!) */}
      <div 
        style={{
          marginTop: 'var(--space-md)',
          backgroundColor: 'rgba(232, 144, 32, 0.08)',
          border: '1px solid rgba(232, 144, 32, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          fontSize: '0.8125rem',
          lineHeight: 1.5,
          color: 'var(--color-telemetry-silver)'
        }}
      >
        <strong style={{ color: 'var(--color-amber-bright)' }}>Scientific Caveat for Students:</strong> Clay minerals (phyllosilicates) found by Opportunity prove that ancient water was neutral-pH, mild, and non-acidic. However, clay is a geochemical indicator of water chemistry—it is <strong>NOT</strong> direct evidence of past biological life.
      </div>

      {/* Final Verdict Banner (reveals when all 4 matched) */}
      {isComplete && (
        <div 
          className="verdict-banner"
          style={{
            marginTop: 'var(--space-md)',
            backgroundColor: 'rgba(200, 86, 50, 0.12)',
            border: '2px solid var(--color-mars-rust)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            textAlign: 'center'
          }}
        >
          <div className="font-telemetry" style={{ color: 'var(--color-amber-bright)', marginBottom: '4px' }}>
            MARTIAN HYDROLOGY RECONSTRUCTED
          </div>
          <h4 style={{ fontSize: '1.25rem', color: 'var(--color-regolith-white)', marginBottom: '6px' }}>
            The Two Epochs of Martian Water
          </h4>
          <p className="text-body" style={{ fontSize: '0.9375rem', maxWidth: '720px', margin: '0 auto var(--space-sm)' }}>
            Opportunity proved that Mars was not wet in just one way. The oldest rocks at Endeavour Crater harbored neutral, drinkable water that formed smectite clays. Later, in Meridiani Planum, the water turned brutally acidic, precipitating jarosite and hematite spherules before the planet desiccated.
          </p>
          <div className="badge-tag badge-tag--amber">
            TAKEAWAY: A robotic explorer can help scientists reconstruct the history of another world.
          </div>
        </div>
      )}

      {/* Bottom Controls & Reset */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-md)', borderTop: '1px solid var(--color-surface-border)', paddingTop: 'var(--space-sm)' }}>
        <div aria-live="polite" style={{ fontSize: '0.8125rem', color: 'var(--color-amber-bright)' }}>
          {feedbackMsg}
        </div>
        <button
          onClick={handleReset}
          className="badge-tag"
          style={{ cursor: 'pointer' }}
        >
          ⟲ Reset Analysis
        </button>
      </div>

    </section>
  );
}
