import React, { useState } from 'react';
import Layout from './components/Layout.jsx';
import MapWrapper from './components/Map/MapWrapper.jsx';
import InfoModal from './components/UI/InfoModal.jsx';
import Screensaver from './components/UI/Screensaver.jsx';
import { useIdleTimer } from './hooks/useIdleTimer.js';
// Explicit relative import with extension to prevent resolution errors
import pointsData from './data/points.js';

const App = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isIdle, setIsIdle] = useState(false);
  const [resetMapTrigger, setResetMapTrigger] = useState(0);

  // Function to handle Reset (Screen Saver or Idle)
  const handleIdle = () => {
    setIsIdle(true);
    setSelectedLocation(null);
    setResetMapTrigger(prev => prev + 1); // Triggers map flyTo home
  };

  // Initialize idle timer (60 seconds)
  const resetIdleTimer = useIdleTimer(60000, handleIdle);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    resetIdleTimer(); // Reset timer on interaction
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
    resetIdleTimer();
  };

  const handleWakeUp = () => {
    setIsIdle(false);
    resetIdleTimer();
  };

  return (
    <Layout>
      <Screensaver isActive={isIdle} onTouch={handleWakeUp} />
      
      <MapWrapper 
        locations={pointsData}
        onLocationSelect={handleLocationSelect}
        selectedLocationId={selectedLocation?.id}
        resetTrigger={resetMapTrigger + (isIdle ? 1 : 0)} 
      />

      <InfoModal 
        location={selectedLocation} 
        onClose={handleCloseModal} 
      />
    </Layout>
  );
};

export default App;