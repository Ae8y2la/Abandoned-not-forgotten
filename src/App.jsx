import React, { useState, useEffect } from 'react';
import Navigation from './components/common/Navigation.jsx';
import Footer from './components/common/Footer.jsx';
import SourcesModal from './components/common/SourcesModal.jsx';
import SignalScene from './components/opening/SignalScene.jsx';
import WorldSelector from './components/opening/WorldSelector.jsx';
import MissionLayout from './components/mission/MissionLayout.jsx';
import StarfieldBackground from './components/common/StarfieldBackground.jsx';
import CinematicIntro from './components/opening/CinematicIntro.jsx';
import ScrollProgress from './components/common/ScrollProgress.jsx';
import ChildAstronaut from './components/common/ChildAstronaut.jsx';
import useLenis from './hooks/useLenis.js';
import { missions, getMissionById } from './data/missions.js';

// ── Cursor-none CSS class management ─────────────────────────────────────────
// When the astronaut cursor is active we hide the native cursor via a class on
// <html>. If the astronaut fails to mount within 2 s, or the user presses C,
// we remove the class to restore the native cursor.
function setCursorHidden(hidden) {
  if (hidden) {
    document.documentElement.classList.add('cursor-astronaut-active');
  } else {
    document.documentElement.classList.remove('cursor-astronaut-active');
  }
}

export default function App() {
  const [viewMode, setViewMode] = useState('home'); // 'home' | 'mission'
  const [activeMissionId, setActiveMissionId] = useState('apollo-15-lrv');
  const [guideTrigger, setGuideTrigger] = useState(null);
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(() => {
    try {
      return sessionStorage.getItem('unfinished_mission_intro_seen') === 'true';
    } catch (_) {
      return false;
    }
  });

  // Detect touch / coarse pointer once
  const isTouch =
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window);

  const [astronautReady, setAstronautReady] = useState(false);
  const [cursorOverride, setCursorOverride] = useState(false); // true = force native cursor

  // Apply / remove cursor-none class
  useEffect(() => {
    if (isTouch) {
      setCursorHidden(false);
      return;
    }
    const shouldHide = introComplete && astronautReady && !cursorOverride;
    setCursorHidden(shouldHide);
  }, [isTouch, introComplete, astronautReady, cursorOverride]);

  // 2 s safety timeout: if astronaut hasn't signalled ready, restore native cursor
  useEffect(() => {
    if (isTouch || !introComplete) return;
    const timer = setTimeout(() => {
      if (!astronautReady) setCursorOverride(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isTouch, introComplete, astronautReady]);

  // C key: toggle between astronaut cursor and native cursor
  useEffect(() => {
    if (isTouch) return;
    const handleKey = (e) => {
      if (e.key === 'c' || e.key === 'C') {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) return;
        setCursorOverride((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isTouch]);

  // Initialise Lenis smooth scroll (no-op when prefers-reduced-motion is set)
  useLenis();

  const currentMission = getMissionById(activeMissionId);

  const handleEnterMission = () => {
    const el = document.getElementById('choose-your-world');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectMission = (id) => {
    if (id === 'home' || id === 'selector') {
      setViewMode('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setGuideTrigger({ missionId: 'home', timestamp: Date.now() });
    } else {
      setActiveMissionId(id);
      setViewMode('mission');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setGuideTrigger({ missionId: id, timestamp: Date.now() });
    }
  };

  const handleBackToSelector = () => {
    setViewMode('home');
    setTimeout(() => {
      const el = document.getElementById('choose-your-world');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  const handleReplayIntro = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIntroComplete(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-space-black)' }}>

      {/* Skip to main content — accessibility */}
      <a
        href="#main-content"
        className="skip-link"
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 'auto',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          zIndex: 100000,
        }}
        onFocus={(e) => {
          e.currentTarget.style.left = '16px';
          e.currentTarget.style.top = '16px';
          e.currentTarget.style.width = 'auto';
          e.currentTarget.style.height = 'auto';
          e.currentTarget.style.overflow = 'visible';
        }}
        onBlur={(e) => {
          e.currentTarget.style.left = '-9999px';
          e.currentTarget.style.width = '1px';
          e.currentTarget.style.height = '1px';
          e.currentTarget.style.overflow = 'hidden';
        }}
      >
        Skip to main content
      </a>

      {/* ── Persistent 3D starfield behind everything ── */}
      <StarfieldBackground />

      {/* ── Cinematic intro ── */}
      {!introComplete && (
        <CinematicIntro onComplete={() => setIntroComplete(true)} />
      )}

      {/* ── Child Astronaut cursor / guide companion ── */}
      {introComplete && (
        <ChildAstronaut
          guideTrigger={guideTrigger}
          onMounted={() => setAstronautReady(true)}
        />
      )}

      {/* ── Side scroll-progress timeline ── */}
      {introComplete && (
        <ScrollProgress
          activeMissionId={viewMode === 'mission' ? activeMissionId : null}
          onSelectMission={handleSelectMission}
        />
      )}

      {/* Primary Sticky Navigation Bar */}
      <Navigation
        activeMissionId={viewMode === 'mission' ? activeMissionId : null}
        onSelectMission={handleSelectMission}
        onOpenSources={() => setIsSourcesOpen(true)}
        onReplayIntro={handleReplayIntro}
      />

      {/* Main Dynamic Viewport */}
      <main id="main-content" style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {viewMode === 'home' && (
          <>
            <SignalScene onEnter={handleEnterMission} />
            <WorldSelector
              missions={missions}
              onSelectMission={handleSelectMission}
            />
          </>
        )}

        {viewMode === 'mission' && currentMission && (
          <MissionLayout
            mission={currentMission}
            onBackToSelector={handleBackToSelector}
            onOpenSources={() => setIsSourcesOpen(true)}
          />
        )}
      </main>

      <Footer
        onOpenSources={() => setIsSourcesOpen(true)}
        onReplayIntro={handleReplayIntro}
      />

      <SourcesModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />
    </div>
  );
}
