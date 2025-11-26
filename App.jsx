
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.jsx';
import MapWrapper from './components/Map/MapWrapper.jsx';
import InfoModal from './components/UI/InfoModal.jsx';
import Screensaver from './components/UI/Screensaver.jsx';
import SoundControl from './components/UI/SoundControl.jsx';
import { useIdleTimer } from './hooks/useIdleTimer.js';
import { Save, Copy, X } from 'lucide-react';
import { SoundProvider, useSound } from './contexts/SoundContext.jsx';
import pointsData from './data/points.js';

// Internal component to handle logic that requires useSound context
const AppContent = () => {
  const [locations, setLocations] = useState(pointsData);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isIdle, setIsIdle] = useState(false);
  const [resetMapTrigger, setResetMapTrigger] = useState(0);

  // SETUP MODE STATE
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [showJsonExport, setShowJsonExport] = useState(false);

  const { playSound } = useSound();

  // Function to handle Reset (Screen Saver or Idle)
  const handleIdle = () => {
    if (!isSetupMode) {
      if (!isIdle) playSound('ui_reset'); // Play sound when going idle
      setIsIdle(true);
      setSelectedLocation(null);
      setResetMapTrigger(prev => prev + 1);
    }
  };

  const resetIdleTimer = useIdleTimer(60000, handleIdle);

  const handleLocationSelect = (location) => {
    if (!isSetupMode) {
      // Note: Click sound is handled in CustomMarker, 
      // Open sound is handled here for the modal appearance
      playSound('ui_open'); 
      setSelectedLocation(location);
      resetIdleTimer();
    }
  };

  const handleCloseModal = () => {
    if (selectedLocation) playSound('ui_close');
    setSelectedLocation(null);
    resetIdleTimer();
  };

  const handleWakeUp = () => {
    if (isIdle) playSound('ui_click');
    setIsIdle(false);
    resetIdleTimer();
  };

  const handleUpdateLocation = (id, newX, newY) => {
    setLocations(prev => prev.map(loc => 
      loc.id === id 
        ? { ...loc, x: Number(newX.toFixed(1)), y: Number(newY.toFixed(1)) } 
        : loc
    ));
  };

  const generateJson = () => {
    return JSON.stringify(locations, null, 2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateJson());
    alert('JSON zkopírováno do schránky!');
  };

  return (
    <Layout>
      <Screensaver isActive={isIdle} onTouch={handleWakeUp} />
      
      {/* SOUND CONTROL */}
      <SoundControl />

      {/* HIDDEN TRIGGER BUTTON FOR SETUP MODE */}
      <div 
        className="absolute top-0 right-0 w-12 h-12 z-[9000] cursor-default"
        onClick={() => setIsSetupMode(prev => !prev)}
        title="Toggle Setup Mode"
      ></div>

      {/* SETUP MODE UI BAR */}
      {isSetupMode && (
        <div className="absolute top-0 left-0 right-0 z-[8000] bg-blue-900/90 text-white p-4 flex justify-between items-center shadow-xl backdrop-blur">
          <div className="font-mono font-bold animate-pulse">🔧 SETUP MODE ACTIVE</div>
          <div className="text-xs opacity-70">Drag points to reposition. Click Generate when done.</div>
          <div className="flex gap-2">
            <button 
              onClick={() => setShowJsonExport(true)}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold flex items-center gap-2"
            >
              <Save size={16} /> GENERATE JSON
            </button>
            <button 
              onClick={() => setIsSetupMode(false)}
              className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* JSON EXPORT MODAL */}
      {showJsonExport && (
        <div className="absolute inset-0 z-[9500] bg-black/90 flex items-center justify-center p-8">
          <div className="bg-gray-900 w-full max-w-4xl h-[80vh] rounded-xl flex flex-col p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4 text-white">
              <h2 className="text-xl font-bold font-mono">Updated coordinates (points.js)</h2>
              <button onClick={() => setShowJsonExport(false)} className="text-gray-400 hover:text-white"><X /></button>
            </div>
            <textarea 
              readOnly 
              className="flex-grow bg-black/50 text-green-400 font-mono text-xs p-4 rounded border border-gray-800 resize-none focus:outline-none"
              value={generateJson()}
            />
            <div className="mt-4 flex justify-end">
              <button 
                onClick={copyToClipboard}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded font-bold flex items-center gap-2"
              >
                <Copy size={18} /> COPY TO CLIPBOARD
              </button>
            </div>
          </div>
        </div>
      )}
      
      <MapWrapper 
        locations={locations}
        onLocationSelect={handleLocationSelect}
        selectedLocationId={selectedLocation?.id}
        resetTrigger={resetMapTrigger + (isIdle ? 1 : 0)}
        isSetupMode={isSetupMode}
        onUpdateLocation={handleUpdateLocation}
      />

      <InfoModal 
        location={selectedLocation} 
        onClose={handleCloseModal} 
      />
    </Layout>
  );
};

const App = () => {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  );
};

export default App;
