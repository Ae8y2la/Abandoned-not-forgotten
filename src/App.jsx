import React, { useState } from 'react';
import Navigation from './components/common/Navigation.jsx';
import Footer from './components/common/Footer.jsx';
import SourcesModal from './components/common/SourcesModal.jsx';
import SignalScene from './components/opening/SignalScene.jsx';
import WorldSelector from './components/opening/WorldSelector.jsx';
import MissionLayout from './components/mission/MissionLayout.jsx';
import StarfieldBackground from './components/common/StarfieldBackground.jsx';
import CinematicIntro from './components/opening/CinematicIntro.jsx';
import ScrollProgress from './components/common/ScrollProgress.jsx';
import useLenis from './hooks/useLenis.js';
import { missions, getMissionById } from './data/missions.js';

export default function App() {
  const [viewMode, setViewMode] = useState('home'); // 'home' | 'mission'
  const [activeMissionId, setActiveMissionId] = useState('apollo-15-lrv');
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  // Initialise Lenis smooth scroll (no-op when prefers-reduced-motion is set)
  useLenis();

  // Active mission data object
  const currentMission = getMissionById(activeMissionId);

  // Navigation handlers
  const handleEnterMission = () => {
    const el = document.getElementById('choose-your-world');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectMission = (id) => {
    if (id === 'home' || id === 'selector') {
      setViewMode('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveMissionId(id);
      setViewMode('mission');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToSelector = () => {
    setViewMode('home');
    setTimeout(() => {
      const el = document.getElementById('choose-your-world');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--color-space-black)' }}>

      {/* ── Persistent 3D starfield behind everything ── */}
      <StarfieldBackground />

      {/* ── Cinematic intro: plays once on first load ── */}
      {!introComplete && (
        <CinematicIntro onComplete={() => setIntroComplete(true)} />
      )}

      {/* ── Persistent side scroll-progress timeline ── */}
      {introComplete && <ScrollProgress />}
      
      {/* Primary Sticky Telemetry Navigation Bar */}
      <Navigation
        activeMissionId={viewMode === 'mission' ? activeMissionId : null}
        onSelectMission={handleSelectMission}
        onOpenSources={() => setIsSourcesOpen(true)}
      />

      {/* Main Dynamic Viewport */}
      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {viewMode === 'home' && (
          <>
            <SignalScene onEnter={handleEnterMission} />
            <div id="choose-your-world">
              <WorldSelector 
                missions={missions} 
                onSelectMission={handleSelectMission} 
              />
            </div>
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

      {/* Primary Footer with NASA Disclaimer & AI Disclosure */}
      <Footer onOpenSources={() => setIsSourcesOpen(true)} />

      {/* Accessible Primary Sources & Provenance Modal */}
      <SourcesModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
      />

    </div>
  );
}
