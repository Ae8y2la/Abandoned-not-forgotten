import React from 'react';
import { references } from '../../data/references.js';

export default function Footer({ onOpenSources }) {
  return (
    <footer 
      role="contentinfo"
      style={{
        backgroundColor: 'var(--color-surface-charcoal)',
        borderTop: '1px solid var(--color-surface-border-subtle)',
        padding: 'var(--space-2xl) 0 var(--space-xl)',
        marginTop: 'var(--space-3xl)'
      }}
    >
      <div className="site-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}>
          
          {/* Mission Scope & Intent */}
          <div>
            <h4 style={{ fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-regolith-white)', marginBottom: 'var(--space-xs)' }}>
              THE UNFINISHED MISSION
            </h4>
            <p className="text-body" style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
              An interactive educational project for students aged 9–15 exploring NASA hardware left on celestial bodies. Telling the scientific and engineering story of what machines did, how they worked, and what they left behind.
            </p>
          </div>

          {/* Mandatory NASA Educational Disclaimer */}
          <div>
            <h4 style={{ fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-amber-bright)', marginBottom: 'var(--space-xs)' }}>
              NASA Educational Project Disclaimer
            </h4>
            <p className="text-body" style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--color-telemetry-silver)' }}>
              {references.disclaimer.text}
            </p>
          </div>

          {/* Provenance & AI Disclosure */}
          <div>
            <h4 style={{ fontSize: '0.875rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-regolith-white)', marginBottom: 'var(--space-xs)' }}>
              Verified Provenance
            </h4>
            <p className="text-body" style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'var(--color-telemetry-silver)', marginBottom: 'var(--space-sm)' }}>
              All scientific data, mission timelines, and coordinates are audited against primary NASA Technical Reports, Apollo flight logs, and LROC orbital imagery.
            </p>
            <button
              onClick={onOpenSources}
              className="badge-tag badge-tag--amber"
              style={{ cursor: 'pointer' }}
            >
              View Primary Sources & Dossier ↗
            </button>
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
            fontSize: '0.75rem',
            color: 'var(--color-muted-slate)'
          }}
        >
          <div>
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
