import React from 'react';

export default function Navigation({ activeMissionId, onSelectMission, onOpenSources }) {
  return (
    <nav 
      aria-label="Main Navigation"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(11, 13, 17, 0.94)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--color-surface-border-subtle)',
        padding: '12px 0'
      }}
    >
      <div className="site-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Project Brand & Callout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            onClick={() => onSelectMission && onSelectMission('home')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left', cursor: 'pointer' }}
            aria-label="The Unfinished Mission Home"
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-lunar-amber)', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: '0.9375rem', letterSpacing: '0.06em', color: 'var(--color-regolith-white)' }}>
              THE UNFINISHED MISSION
            </span>
          </button>
        </div>

        {/* Mission Destination Switcher */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSelectMission && onSelectMission('apollo-15-lrv')}
            className={`badge-tag ${activeMissionId === 'apollo-15-lrv' ? 'badge-tag--amber' : ''}`}
            style={{ cursor: 'pointer', padding: '6px 12px' }}
            aria-current={activeMissionId === 'apollo-15-lrv' ? 'page' : undefined}
          >
            01 MOON · LRV
          </button>

          <button
            onClick={() => onSelectMission && onSelectMission('opportunity-mer')}
            className={`badge-tag ${activeMissionId === 'opportunity-mer' ? 'badge-tag--amber' : ''}`}
            style={{ cursor: 'pointer', padding: '6px 12px' }}
            aria-current={activeMissionId === 'opportunity-mer' ? 'page' : undefined}
          >
            02 MARS · OPPORTUNITY
          </button>

          <button
            onClick={() => onSelectMission && onSelectMission('voyager-1')}
            className={`badge-tag ${activeMissionId === 'voyager-1' ? 'badge-tag--amber' : ''}`}
            style={{ cursor: 'pointer', padding: '6px 12px' }}
            aria-current={activeMissionId === 'voyager-1' ? 'page' : undefined}
          >
            03 DEEP SPACE · VOYAGER 1
          </button>
        </div>

        {/* Citations & NASA Disclaimer Button */}
        <div>
          <button
            onClick={onOpenSources}
            className="badge-tag"
            style={{ cursor: 'pointer', borderColor: 'var(--color-surface-border)' }}
            aria-label="View verified NASA primary sources and legal disclaimers"
          >
            NASA Sources & Disclaimers
          </button>
        </div>

      </div>
    </nav>
  );
}
