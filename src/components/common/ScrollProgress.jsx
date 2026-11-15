import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollProgress.css';

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  { label: 'SIGNAL',  id: 'signal-scene' },
  { label: 'WORLD',   id: 'choose-your-world' },
  { label: 'MISSION', id: 'mission-section' },
  { label: 'LEGACY',  id: 'site-footer' },
];

export default function ScrollProgress({ activeMissionId, onSelectMission }) {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    // Small delay to allow react rendering of newly selected views/routes
    const timer = setTimeout(() => {
      const triggers = [];

      // Global document progress indicator
      const globalST = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          setProgress(self.progress);
        },
      });
      triggers.push(globalST);

      // Section ScrollTrigger Scroll-Spy
      SECTIONS.forEach((sec, idx) => {
        let el = document.getElementById(sec.id);
        if (!el && sec.id === 'mission-section') {
          el = document.querySelector('article#mission-section, #mission-section, #choose-your-world');
        }
        if (!el && sec.id === 'site-footer') {
          el = document.querySelector('#site-footer, #beat-legacy, footer');
        }
        if (!el) return;

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveIndex(idx),
          onEnterBack: () => setActiveIndex(idx),
        });
        triggers.push(st);
      });

      return () => {
        triggers.forEach((st) => st.kill());
      };
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [activeMissionId]);

  const scrollToTarget = (target) => {
    if (!target) return;
    if (window.__lenis) {
      window.__lenis.scrollTo(target, {
        offset: -40,
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSectionClick = (sectionId, index) => {
    // If in mission view and user clicks SIGNAL or WORLD, navigate back to home then scroll
    if (activeMissionId && (sectionId === 'signal-scene' || sectionId === 'choose-your-world')) {
      if (onSelectMission) {
        onSelectMission('home');
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) {
            scrollToTarget(el);
          } else {
            window.scrollTo({ top: sectionId === 'signal-scene' ? 0 : 500, behavior: 'smooth' });
          }
        }, 120);
        return;
      }
    }

    let el = document.getElementById(sectionId);
    if (!el && sectionId === 'mission-section') {
      el = document.querySelector('article#mission-section, #mission-section');
    }
    if (!el && sectionId === 'site-footer') {
      el = document.querySelector('footer, #site-footer, #beat-legacy');
    }

    if (el) {
      scrollToTarget(el);
      setActiveIndex(index);
    } else if (onSelectMission && sectionId === 'mission-section') {
      onSelectMission('home');
      setTimeout(() => {
        const target = document.getElementById('mission-section') || document.getElementById('choose-your-world');
        if (target) scrollToTarget(target);
      }, 120);
    }
  };

  return (
    <nav
      ref={containerRef}
      className="scroll-progress"
      aria-label="Mission flight-path waypoints"
    >
      {/* Background Track Line */}
      <div className="scroll-progress-track" aria-hidden="true">
        <div
          className="scroll-progress-fill"
          style={{ height: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Nav Waypoints List */}
      <ul className="scroll-progress-list" role="list">
        {SECTIONS.map((sec, i) => {
          const isActive = i === activeIndex;
          const posPercent = (i / (SECTIONS.length - 1)) * 100;
          return (
            <li
              key={sec.label}
              className="scroll-progress-item"
              style={{ top: `${posPercent}%` }}
            >
              <button
                type="button"
                onClick={() => handleSectionClick(sec.id, i)}
                className={`scroll-progress-button ${isActive ? 'is-active' : ''}`}
                aria-label={`Jump to ${sec.label} stage`}
                aria-current={isActive ? 'true' : undefined}
              >
                <span className="scroll-progress-label">{sec.label}</span>
                <span className="scroll-progress-dot" aria-hidden="true" />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
