import React from 'react';
import { references } from '../../data/references.js';

export default function Footer({ onOpenSources, onReplayIntro }) {
  return (
    <footer 
      id="site-footer"
      role="contentinfo"
      style={{
        backgroundColor: 'var(--color-surface-charcoal)',
        borderTop: '1px solid var(--color-surface-border-subtle)',
        padding: 'var(--space-2xl) 0 calc(var(--space-2xl) + 70px + env(safe-area-inset-bottom, 0px))',
        marginTop: 'var(--space-3xl)',
        scrollMarginTop: '60px'
      }}
    >
      <div className="site-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
          
          {/* Mission Scope & Intent */}
          <div>
            <h4 style={{ fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-regolith-white)', marginBottom: 'var(--space-xs)' }}>
              THE UNFINISHED MISSION
            </h4>
            <p className="text-body" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              An interactive educational project for students aged 8–14 exploring NASA hardware left on celestial bodies. Telling the scientific and engineering story of what machines did, how they worked, and what they left behind.
            </p>
          </div>

          {/* Mandatory NASA Educational Disclaimer */}
          <div>
            <h4 style={{ fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-amber-bright)', marginBottom: 'var(--space-xs)' }}>
              NASA Educational Project Disclaimer
            </h4>
            <p className="text-body" style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-telemetry-silver)' }}>
              {references.disclaimer.text}
            </p>
          </div>

          {/* Provenance & AI Disclosure */}
          <div>
            <h4 style={{ fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-regolith-white)', marginBottom: 'var(--space-xs)' }}>
              DATA SOURCES &amp; PROVENANCE
            </h4>
            <p className="text-body" style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--color-telemetry-silver)', marginBottom: 'var(--space-sm)' }}>
              Mission information is drawn from NASA sources, including the NSSDCA catalog, NASA mission pages, and JPL data, listed in the dossier.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenSources}
                className="badge-tag badge-tag--amber"
                style={{ cursor: 'pointer', minHeight: '44px', minWidth: '44px', padding: '8px 14px' }}
                aria-label="Open NASA primary sources dossier"
              >
                View Primary Sources & Dossier ↗
              </button>
              {onReplayIntro && (
                <button
                  onClick={onReplayIntro}
                  className="badge-tag"
                  style={{ cursor: 'pointer', borderColor: 'var(--color-surface-border)', minHeight: '44px', minWidth: '44px', padding: '8px 14px' }}
                  aria-label="Replay the 20-second cinematic intro sequence"
                >
                  Replay Cinematic Prologue ↺
                </button>
              )}
            </div>
          </div>

        </div>

        {/* AI-Use Disclosure & Challenge Metadata */}
        <div 
          style={{
            borderTop: '1px solid var(--color-surface-border)',
            paddingTop: 'var(--space-md)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            fontSize: '0.8125rem',
            color: 'var(--color-telemetry-silver)'
          }}
        >
          <div>
            <div style={{ marginBottom: 'var(--space-xs)', color: 'var(--color-regolith-white)' }}>
              Created by Team The Forgotten Fleet
            </div>
            NASA Space Apps Challenge 2026 · Challenge: <em>"Abandoned but not Forgotten"</em>
          </div>
          <div>
            {references.disclaimer.aiDisclosure}
          </div>
        </div>

      </div>
    </footer>
  );
}
