import React, { useState } from 'react';
import Navigation from './components/common/Navigation.jsx';
import Footer from './components/common/Footer.jsx';
import SourcesModal from './components/common/SourcesModal.jsx';
import SignalScene from './components/opening/SignalScene.jsx';
import WorldSelector from './components/opening/WorldSelector.jsx';
import MissionLayout from './components/mission/MissionLayout.jsx';
import { missions, getMissionById } from './data/missions.js';

export default function App() {
  const [viewMode, setViewMode] = useState('home'); // 'home' | 'mission'
  const [activeMissionId, setActiveMissionId] = useState('apollo-15-lrv');
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);

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
      
      {/* Primary Sticky Telemetry Navigation Bar */}
      <Navigation
        activeMissionId={viewMode === 'mission' ? activeMissionId : null}
        onSelectMission={handleSelectMission}
        onOpenSources={() => setIsSourcesOpen(true)}
      />

      {/* Main Dynamic Viewport */}
      <main style={{ flex: 1 }}>
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
