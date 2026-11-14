import React, { useEffect, useMemo, useState } from 'react';
import PlanetIcon from './PlanetIcon.jsx';
import './Navigation.css';

const NAV_ITEMS = [
  { id: 'moon', label: 'Moon', planet: 'moon', missionId: 'apollo-15-lrv' },
  { id: 'mars', label: 'Mars', planet: 'mars', missionId: 'opportunity-mer' },
  { id: 'voyager', label: 'Voyager', planet: 'voyager', missionId: 'voyager-1' },
];

export default function Navigation({ activeMissionId, onSelectMission, onOpenSources, onReplayIntro }) {
  const [pressedId, setPressedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    const updateVisibility = () => setHidden(document.hidden);
    updateMotion();
    updateVisibility();
    motionQuery.addEventListener?.('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      motionQuery.removeEventListener?.('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  const activeId = useMemo(() => {
    const activeItem = NAV_ITEMS.find((item) => item.missionId === activeMissionId);
    return activeItem?.id || null;
  }, [activeMissionId]);

  const navigate = (item) => {
    if (item.missionId) {
      onSelectMission?.(item.missionId);
      return;
    }
    onSelectMission?.('home');
    window.setTimeout(() => {
      document.getElementById('choose-your-world')?.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 120);
  };

  const handleItemClick = (item) => {
    setPressedId(item.id);
    window.setTimeout(() => {
      setPressedId(null);
      navigate(item);
    }, reducedMotion ? 0 : 280);
  };

  return (
    <nav className="planet-hop-nav" aria-label="Planet Hop navigation">
      <button
        type="button"
        className="planet-hop-brand"
        onClick={() => onSelectMission?.('home')}
        aria-label="The Unfinished Mission home"
      >
        <span className="planet-hop-brand-dot" />
        <span>THE UNFINISHED MISSION</span>
      </button>

      <div className="planet-hop-items">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === activeId;
          return (
            <button
              type="button"
              key={item.id}
              className={[
                'planet-hop-item',
                isActive ? 'planet-hop-item--active' : '',
                pressedId === item.id ? 'planet-hop-item--pressed' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              aria-label={`Go to ${item.label}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <PlanetIcon
                type={item.planet}
                hovered={hoveredId === item.id || pressedId === item.id}
                reducedMotion={reducedMotion}
                hidden={hidden}
              />
              <span className="planet-hop-label">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="planet-hop-utilities">
        <button type="button" className="planet-hop-utility" onClick={onOpenSources}>
          Sources
        </button>
        {onReplayIntro && (
          <button type="button" className="planet-hop-utility" onClick={onReplayIntro}>
            Prologue
          </button>
        )}
      </div>
    </nav>
  );
}
