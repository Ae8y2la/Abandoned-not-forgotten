import React, { useState } from 'react';
import Navigation from './components/common/Navigation.jsx';
import Footer from './components/common/Footer.jsx';
import SourcesModal from './components/common/SourcesModal.jsx';
import SignalScene from './components/opening/SignalScene.jsx';
import WorldSelector from './components/opening/WorldSelector.jsx';
import MissionLayout from './components/mission/MissionLayout.jsx';
import { missions, getMissionById } from './data/missions.js';

export default function App() {
  const [viewMode, setViewMode] = useState('signal'); // 'signal' | 'selector' | 'mission'
  const [activeMissionId, setActiveMissionId] = useState('apollo-15-lrv');
  const [isSourcesOpen, setIsSourcesOpen] = useState(false);

  // Active mission data object
  const currentMission = getMissionById(activeMissionId);

  // Navigation handlers
  const handleEnterMission = () => {
    setViewMode('selector');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectMission = (id) => {
    if (id === 'home' || id === 'selector') {
      setViewMode('selector');
    } else {
      setActiveMissionId(id);
      setViewMode('mission');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSelector = () => {
    setViewMode('selector');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {viewMode === 'signal' && (
          <SignalScene onEnter={handleEnterMission} />
        )}

        {viewMode === 'selector' && (
          <WorldSelector 
            missions={missions} 
            onSelectMission={handleSelectMission} 
          />
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
