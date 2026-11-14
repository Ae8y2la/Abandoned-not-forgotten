import React, { useEffect } from 'react';
import { references } from '../../data/references.js';

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
          maxWidth: '760px',
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
              PROVENANCE & CITATIONS
            </span>
            <h2 id="sources-title" className="text-headline-3">
              Verified NASA Primary Sources
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

        <p className="text-body" style={{ fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>
          Every scientific fact, engineering parameter, traverse distance, and coordinate in <em>The Unfinished Mission</em> has been audited against primary NASA archives:
        </p>

        {/* Apollo 15 Sources Table */}
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

        {/* Mandatory Project Legal Disclaimer */}
        <div 
          style={{
            backgroundColor: 'rgba(232, 144, 32, 0.08)',
            border: '1px solid rgba(232, 144, 32, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--space-sm)',
            fontSize: '0.8125rem',
            color: 'var(--color-telemetry-silver)'
          }}
        >
          <strong style={{ color: 'var(--color-amber-bright)' }}>NASA Educational Project Disclaimer:</strong>
          <p style={{ marginTop: '4px', margin: 0 }}>
            {references.disclaimer.text}
          </p>
        </div>
      </div>
    </div>
  );
}
