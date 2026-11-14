import { useEffect, useRef, useState } from 'react';
import './ScrollProgress.css';

const SECTIONS = [
  { label: 'SIGNAL',  position: 0,    id: 'signal-scene' },
  { label: 'WORLD',   position: 0.33, id: 'choose-your-world' },
  { label: 'MISSION', position: 0.66, id: 'mission-section' },
  { label: 'LEGACY',  position: 1,    id: 'site-footer' },
];

export default function ScrollProgress({ activeMissionId, onSelectMission }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef(null);
  const latestScrollRef = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedMotion = mediaQuery.matches;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      latestScrollRef.current = docHeight > 0 ? scrollTop / docHeight : 0;

      if (reducedMotion) {
        setProgress(latestScrollRef.current);
        return;
      }

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          setProgress(latestScrollRef.current);
          rafRef.current = null;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Set initial value
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const getActiveIndex = () => {
    let closest = 0;
    let minDist = Infinity;
    SECTIONS.forEach((section, i) => {
      const dist = Math.abs(section.position - progress);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    return closest;
  };

  const activeIndex = getActiveIndex();

  const handleSectionClick = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (activeMissionId && onSelectMission) {
      onSelectMission('home');
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 120);
      return;
    }

    if (sectionId === 'mission-section' && onSelectMission) {
      onSelectMission('apollo-15-lrv');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '200px',
      }}
      className="scroll-progress"
    >
      {/* Track line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          transform: 'translateX(-50%)',
          width: '2px',
          height: '100%',
          background: 'rgba(255,255,255,0.15)',
          borderRadius: '1px',
        }}
      />

      {/* Progress fill line */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          transform: 'translateX(-50%)',
          width: '2px',
          height: `${progress * 100}%`,
          background: 'var(--color-lunar-amber)',
          borderRadius: '1px',
          transition: 'none',
        }}
      />

      {/* Dots */}
      {SECTIONS.map((section, i) => {
        const isActive = i === activeIndex;
        return (
          <div
            key={section.label}
            style={{
              position: 'absolute',
              top: `${section.position * 100}%`,
              left: '50%',
              transform: `translate(-50%, -50%) scale(${isActive ? 1.4 : 1})`,
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease',
            }}
          >
            {/* Label to the left */}
            <button
              type="button"
              onClick={() => handleSectionClick(section.id)}
              aria-label={`Go to ${section.label}`}
              style={{
                position: 'absolute',
                right: 'calc(100% + 10px)',
                fontSize: '0.6rem',
                fontFamily: 'var(--font-sans)',
                letterSpacing: '0.1em',
                color: 'var(--color-telemetry-silver)',
                whiteSpace: 'nowrap',
                userSelect: 'none',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
                background: 'transparent',
              }}
            >
              {section.label}
            </button>

            {/* Dot */}
            <button
              type="button"
              onClick={() => handleSectionClick(section.id)}
              aria-label={`Go to ${section.label}`}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: '1.5px solid var(--color-lunar-amber)',
                background: isActive ? 'var(--color-lunar-amber)' : 'transparent',
                cursor: 'pointer',
                padding: 0,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
