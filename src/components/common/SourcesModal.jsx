import React, { useEffect } from 'react';
import { references } from '../../data/references.js';
import { imageCredits, nasaDisclaimer } from '../../data/credits.js';

export default function SourcesModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sources-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(11, 13, 17, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-md)'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-surface-charcoal)',
          border: '1px solid var(--color-surface-border)',
          borderRadius: 'var(--radius-lg)',
          maxWidth: '820px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 'var(--space-xl)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-md)' }}>
          <div>
            <span className="badge-tag badge-tag--amber" style={{ marginBottom: '6px' }}>
              PROVENANCE, CITATIONS & CREDITS
            </span>
            <h2 id="sources-title" className="text-headline-3">
              NASA Primary Sources & Asset Provenance
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              padding: '8px 14px',
              backgroundColor: 'var(--color-surface-elevated)',
              border: '1px solid var(--color-surface-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-regolith-white)',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Mandatory Project Legal Disclaimer */}
        <div 
          style={{
            backgroundColor: 'rgba(232, 144, 32, 0.08)',
            border: '1px solid rgba(232, 144, 32, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-sm)',
            fontSize: '0.8125rem',
            color: 'var(--color-telemetry-silver)',
            marginBottom: 'var(--space-lg)'
          }}
        >
          <strong style={{ color: 'var(--color-amber-bright)' }}>NASA Educational Project Disclaimer:</strong>
          <p style={{ marginTop: '4px', margin: 0 }}>
            {nasaDisclaimer}
          </p>
        </div>

        {/* Authentic NASA Imagery Credits Table */}
        <div style={{ marginBottom: 'var(--space-xl)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-lunar-amber)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Authentic NASA Imagery Registry (Zero AI / Third-Party Images)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {imageCredits.map((img) => (
              <div
                key={img.nasaId}
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-regolith-white)', fontSize: '0.875rem' }}>
                    {img.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-telemetry-silver)' }}>
                    Credit: {img.creditLine} • <span className="font-telemetry">{img.nasaId}</span> ({img.type.toUpperCase()})
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-muted-slate)' }}>
                    {img.usageNote}
                  </div>
                </div>

                <a
                  href={img.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.75rem' }}
                >
                  Verify at images.nasa.gov ↗
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Apollo 15 Technical Documentation */}
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--color-lunar-amber)', marginBottom: 'var(--space-xs)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Apollo 15 Lunar Roving Vehicle Records
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {references.apollo15.sources.map((src) => (
              <div 
                key={src.id}
                style={{
                  backgroundColor: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-surface-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px'
                }}
              >
                <div style={{ fontWeight: 600, color: 'var(--color-regolith-white)', fontSize: '0.9375rem', marginBottom: '4px' }}>
                  {src.title}
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-telemetry-silver)', marginBottom: '6px' }}>
                  {src.authors ? `${src.authors} · ` : ''}{src.organization} ({src.year})
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted-slate)', marginBottom: '8px' }}>
                  <strong>Verified Parameters:</strong> {src.verifiedNote}
                </div>
                <a 
                  href={src.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ fontSize: '0.8125rem' }}
                >
                  Inspect NASA Technical Archive Document ↗
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
