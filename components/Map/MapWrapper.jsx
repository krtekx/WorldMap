
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, ImageOverlay, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import CustomMarker from './CustomMarker.jsx';
import TrafficLayer from './TrafficLayer.jsx';
import MagnifyingGlass from './MagnifyingGlass.jsx';
import { AlertTriangle } from 'lucide-react'; 
import { useSound } from '../../contexts/SoundContext';

// ULTRA HD SQUARE FORMAT CONFIGURATION (1:1 Aspect Ratio)
const imageWidth = 8192; 
const imageHeight = 8192;
// Bounds defined outside component to remain stable references
const mapBounds = [[0, 0], [imageHeight, imageWidth]]; 

// HIDDEN GEMS DATA (Easter Eggs)
const HIDDEN_GEMS = [
    { id: 'gem1', x: 2000, y: 2000, code: 'HLZ-1902' },
    { id: 'gem2', x: 6000, y: 5500, code: 'TRA-1888' },
    { id: 'gem3', x: 7500, y: 1500, code: 'PAC-1910' }
];

const MapController = ({ resetTrigger, bounds, minZoom, setMapInstance }) => {
  const map = useMap();
  const isInitialized = useRef(false);
  
  // Expose map instance once
  useEffect(() => {
    setMapInstance(map);
  }, [map, setMapInstance]);

  // Handle initialization and window resize constraints
  useEffect(() => {
    if (bounds && minZoom !== -1) {
      map.setMinZoom(minZoom);
      map.setMaxBounds(bounds);
      
      // CRITICAL FIX: Only center the map ONCE on startup.
      // Checking isInitialized prevents the map from jumping back to center
      // whenever React re-renders (e.g. when dragging a marker).
      if (!isInitialized.current) {
         map.setView([imageHeight/2, imageWidth/2], minZoom);
         isInitialized.current = true;
      }
    }
  }, [map, bounds, minZoom]);

  // Handle Reset / Idle Timer (Screensaver)
  useEffect(() => {
    if (resetTrigger > 0 && minZoom !== -1) {
      map.flyTo([imageHeight/2, imageWidth/2], minZoom, { 
        animate: true,
        duration: 2.0,
        easeLinearity: 0.25
      });
    }
  }, [resetTrigger, map, minZoom]);

  return null;
};

const MapWrapper = ({ 
    locations, 
    onLocationSelect, 
    selectedLocationId, 
    resetTrigger, 
    isSetupMode, 
    onUpdateLocation, 
    onGemFound,
    glassPosition, 
    onUpdateGlassPosition 
}) => {
  // CACHE BUSTING: Timestamp to force reload
  const [mapUrl, setMapUrl] = useState(`assets/images/background_map.jpg?t=${new Date().getTime()}`);
  const [isFallback, setIsFallback] = useState(false);
  
  const [mapError, setMapError] = useState(false);
  const [attemptedUrl, setAttemptedUrl] = useState('');
  const [minZoom, setMinZoom] = useState(-1); 
  const { playSound } = useSound();
  
  const [mainMapInstance, setMainMapInstance] = useState(null);
  const [foundGems, setFoundGems] = useState([]);

  useEffect(() => {
    if (!mapUrl) return;

    const img = new Image();
    img.src = mapUrl;
    setAttemptedUrl(img.src);
    
    img.onload = () => {
        setMapError(false);
    };

    img.onerror = () => {
        console.warn("Failed to load map:", img.src);
        if (!isFallback) {
            console.log("Switching to fallback map...");
            setIsFallback(true);
            setMapUrl(`assets/images/background_map_small.jpeg?t=${new Date().getTime()}`);
        } else {
            setMapError(true);
        }
    };

    const calculateZoom = () => {
       const windowWidth = window.innerWidth;
       const windowHeight = window.innerHeight;
       const widthRatio = windowWidth / imageWidth;
       const heightRatio = windowHeight / imageHeight;
       const scale = Math.max(widthRatio, heightRatio);
       setMinZoom(Math.log2(scale));
    };

    calculateZoom();
    window.addEventListener('resize', calculateZoom);
    return () => window.removeEventListener('resize', calculateZoom);
  }, [mapUrl, isFallback]);

  const handleGemClick = (gem) => {
    if (!foundGems.includes(gem.id)) {
        playSound('ui_click');
        setFoundGems(prev => [...prev, gem.id]);
        onGemFound(gem);
    }
  };

  const validLocations = (locations || []).filter(loc => 
    loc.y !== undefined && loc.y !== null && !isNaN(Number(loc.y)) &&
    loc.x !== undefined && loc.x !== null && !isNaN(Number(loc.x))
  );

  return (
    <div className="h-full w-full bg-[#1a1814] relative overflow-hidden flex items-center justify-center">
      
      {mapError && (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 text-[#e8dcc5] p-8 text-center">
          <AlertTriangle size={64} className="text-red-500 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Chybí soubor mapy</h2>
          <p className="text-xl mb-6 opacity-80">Soubor s mapou nebyl nalezen.</p>
          <div className="bg-[#2d2a24] p-6 rounded-lg border border-[#c5a065] font-mono text-sm text-left max-w-2xl overflow-hidden break-all">
            <p className="mb-2 text-[#c5a065]">Hledám soubor zde:</p>
            <p className="text-white mb-4 bg-black p-2 rounded">{attemptedUrl}</p>
            <p className="text-white">public/assets/images/background_map.jpg</p>
            <p className="text-white mt-2">nebo / or</p>
            <p className="text-white">public/assets/images/background_map_small.jpeg</p>
          </div>
        </div>
      )}

      {minZoom !== -1 && !mapError && (
        <MapContainer
          crs={L.CRS.Simple}
          center={[imageHeight/2, imageWidth/2]} 
          zoom={minZoom}
          minZoom={minZoom}
          maxZoom={minZoom + 4} 
          zoomSnap={0.01} 
          zoomDelta={0.2}
          wheelPxPerZoomLevel={300}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          attributionControl={false}
          zoomControl={false}
          className="h-full w-full z-0 bg-[#1a1814] outline-none"
          style={{ background: '#1a1814', height: '100%', width: '100%' }}
        >
          <ImageOverlay
            url={mapUrl}
            bounds={mapBounds}
            opacity={1}
            zIndex={1}
          />

          <TrafficLayer bounds={mapBounds} />
          
          {validLocations.map((loc) => (
            <CustomMarker
              key={loc.id}
              position={[Number(loc.y) * 81.92, Number(loc.x) * 81.92]} 
              data={loc}
              isActive={selectedLocationId === loc.id}
              onClick={() => onLocationSelect(loc)}
              isSetupMode={isSetupMode}
              onDragEnd={(id, x, y) => onUpdateLocation(id, x / 8.192, y / 8.192)}
            />
          ))}

          {HIDDEN_GEMS.map(gem => (
             <Marker
                key={gem.id}
                position={[gem.y, gem.x]}
                icon={L.divIcon({
                  className: 'gem-trigger',
                  html: `<div class="w-4 h-4 rounded-full bg-blue-400/30 animate-pulse border border-white/20 cursor-pointer hover:bg-blue-400"></div>`,
                  iconSize: [16, 16]
                })}
                eventHandlers={{
                    click: () => handleGemClick(gem)
                }}
             />
          ))}

          <MapController 
            resetTrigger={resetTrigger} 
            bounds={mapBounds} 
            minZoom={minZoom} 
            setMapInstance={setMainMapInstance}
          />
        </MapContainer>
      )}

      {mainMapInstance && !mapError && (
        <MagnifyingGlass 
           mainMap={mainMapInstance}
           mapUrl={mapUrl}
           bounds={mapBounds}
           gems={HIDDEN_GEMS}
           glassPosition={glassPosition}
           onPositionChange={onUpdateGlassPosition}
        />
      )}
      
      <div className="absolute inset-0 pointer-events-none z-[400] bg-[radial-gradient(circle,transparent_40%,#000000aa_100%)] shadow-inner mix-blend-multiply"></div>
    </div>
  );
};

export default MapWrapper;
