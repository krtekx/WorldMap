
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.jsx';
import MapWrapper from './components/Map/MapWrapper.jsx';
import InfoModal from './components/UI/InfoModal.jsx';
import Screensaver from './components/UI/Screensaver.jsx';
import SoundControl from './components/UI/SoundControl.jsx';
import { useIdleTimer } from './hooks/useIdleTimer.js';
import { Save, Copy, X, Gem } from 'lucide-react';
import { SoundProvider, useSound } from './contexts/SoundContext.jsx';
import pointsData from './data/points.js';

// Internal component to handle logic that requires useSound context
const AppContent = () => {
  // FIX: Access the .locations array specifically
  const [locations, setLocations] = useState(pointsData.locations || []);
  // FIX: Access the .glassPosition object specifically
  const [glassPosition, setGlassPosition] = useState(pointsData.glassPosition || { x: 4096, y: 4096 });
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isIdle, setIsIdle] = useState(false);
  const [resetMapTrigger, setResetMapTrigger] = useState(0);

  // SETUP MODE STATE
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [showJsonExport, setShowJsonExport] = useState(false);
  
  // GEMS STATE
  const [foundGem, setFoundGem] = useState(null);

  const { playSound } = useSound();

  // Function to handle Reset (Screen Saver or Idle)
  const handleIdle = () => {
    if (!isSetupMode) {
      if (!isIdle) playSound('ui_reset');
      setIsIdle(true);
      setSelectedLocation(null);
      setFoundGem(null);
      setResetMapTrigger(prev => prev + 1);
    }
  };

  const resetIdleTimer = useIdleTimer(60000, handleIdle);

  const handleLocationSelect = (location) => {
    if (!isSetupMode) {
      playSound('ui_open'); 
      setSelectedLocation(location);
      resetIdleTimer();
    }
  };

  const handleGemFound = (gem) => {
     setFoundGem(gem);
     resetIdleTimer();
  };

  const handleCloseModal = () => {
    if (selectedLocation) playSound('ui_close');
    setSelectedLocation(null);
    setFoundGem(null);
    resetIdleTimer();
  };

  const handleWakeUp = () => {
    if (isIdle) playSound('ui_click');
    setIsIdle(false);
    resetIdleTimer();
  };

  const handleUpdateLocation = (id, newX, newY) => {
    // Input is scaled to 0-1000 from setup mode drag
    setLocations(prev => prev.map(loc => 
      loc.id === id 
        ? { ...loc, x: Number(newX.toFixed(1)), y: Number(newY.toFixed(1)) } 
        : loc
    ));
  };

  const handleUpdateGlassPosition = (newPos) => {
    setGlassPosition(newPos);
  };

  const generateJson = () => {
    // Reconstruct the full object structure for export
    const exportData = {
        glassPosition: glassPosition,
        locations: locations
    };
    return JSON.stringify(exportData, null, 2);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateJson());
    alert('JSON zkopírováno do schránky!');
  };

  return (
    <Layout>
      <Screensaver isActive={isIdle} onTouch={handleWakeUp} />
      
      <SoundControl />

      <div 
        className="absolute top-0 right-0 w-12 h-12 z-[9000] cursor-default"
        onClick={() => setIsSetupMode(prev => !prev)}
        title="Toggle Setup Mode"
      ></div>

      {isSetupMode && (
        <div className="absolute top-0 left-0 right-0 z-[8000] bg-blue-900/90 text-white p-4 flex justify-between items-center shadow-xl backdrop-blur">
          <div className="font-mono font-bold animate-pulse">🔧 SETUP MODE (8K)</div>
          <div className="text-xs opacity-70">Drag points or Glass. Coordinates auto-save to JSON generator.</div>
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
        onGemFound={handleGemFound}
        glassPosition={glassPosition}
        onUpdateGlassPosition={handleUpdateGlassPosition}
      />

      <InfoModal 
        location={selectedLocation} 
        onClose={handleCloseModal} 
      />

      {/* REWARD MODAL FOR GEMS */}
      {foundGem && (
        <div className="fixed inset-0 z-[7000] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={handleCloseModal}>
            <div className="bg-[#1a1814] border-4 border-[#c5a065] p-10 rounded-xl text-center shadow-2xl transform scale-100 animate-[bounce_0.5s_ease-out]" onClick={e => e.stopPropagation()}>
                <Gem size={64} className="mx-auto text-blue-400 mb-4 animate-pulse" />
                <h2 className="text-3xl font-serif text-[#c5a065] mb-2">Hidden Artifact Found!</h2>
                <p className="text-[#e8dcc5] mb-6">You have discovered a secret location.</p>
                <div className="bg-black/50 p-4 rounded border border-white/10">
                    <p className="text-sm text-gray-400 uppercase tracking-widest mb-1">Secret Code</p>
                    <p className="text-4xl font-mono font-bold text-white tracking-widest">{foundGem.code}</p>
                </div>
                <button onClick={handleCloseModal} className="mt-8 px-6 py-2 bg-[#c5a065] text-[#1a1814] font-bold rounded hover:bg-[#d4b98c]">
                    Close
                </button>
            </div>
        </div>
      )}
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
