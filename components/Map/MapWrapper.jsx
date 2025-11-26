import React, { useEffect, useState } from 'react';
import { MapContainer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import CustomMarker from './CustomMarker.jsx';
import { AlertTriangle } from 'lucide-react';

// Helper to reset map on idle
const MapController = ({ resetTrigger, bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (resetTrigger) {
      map.flyToBounds(bounds, { 
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [resetTrigger, map, bounds]);
  return null;
};

const MapWrapper = ({ locations, onLocationSelect, selectedLocationId, resetTrigger }) => {
  // SQUARE FORMAT CONFIGURATION (1:1 Aspect Ratio)
  // Ensure your background_map.jpg is square, or Leaflet will stretch it to fit this square.
  const imageHeight = 100;
  const imageWidth = 100; 
  const bounds = [[0, 0], [imageHeight, imageWidth]]; 
  
  // OFFLINE MODE PATH (Relative for GitHub Pages / Hostinger compatibility)
  const mapUrl = 'assets/images/background_map.jpg';

  // State to track if the local map file is actually present
  const [mapError, setMapError] = useState(false);
  const [attemptedUrl, setAttemptedUrl] = useState('');

  useEffect(() => {
    // Pre-check if image exists to show a helpful error if missing
    const img = new Image();
    img.src = mapUrl;
    setAttemptedUrl(img.src); // Capture the resolved URL for debugging
    img.onerror = () => setMapError(true);
  }, []);

  return (
    <div className="h-full w-full bg-[#1a1814] relative overflow-hidden flex items-center justify-center">
      
      {/* Missing Map Warning Overlay */}
      {mapError && (
        <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 text-[#e8dcc5] p-8 text-center">
          <AlertTriangle size={64} className="text-red-500 mb-4" />
          <h2 className="text-3xl font-bold mb-2">Chybí soubor mapy</h2>
          <p className="text-xl mb-6 opacity-80">Background map file is missing.</p>
          <div className="bg-[#2d2a24] p-6 rounded-lg border border-[#c5a065] font-mono text-sm text-left max-w-2xl overflow-hidden break-all">
            <p className="mb-2 text-[#c5a065]">Looking for file at:</p>
            <p className="text-white mb-4 bg-black p-2 rounded">{attemptedUrl}</p>
            
            <p className="mb-2 text-[#c5a065]">Please ensure your Git repo has:</p>
            <p className="text-white">public/assets/images/background_map.jpg</p>
            <p className="mt-4 text-[#c5a065] text-xs">Ensure it is a SQUARE image for best results.</p>
          </div>
        </div>
      )}

      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={[[0, 0], [imageHeight, imageWidth]]}
        maxBoundsViscosity={1.0} 
        minZoom={1} 
        maxZoom={4}
        zoomSnap={0.1}
        zoomDelta={0.1}
        wheelPxPerZoomLevel={120} 
        scrollWheelZoom={true}
        doubleClickZoom={false}
        attributionControl={false}
        zoomControl={false}
        className="h-full w-full z-0 bg-[#1a1814] outline-none"
        style={{ background: '#1a1814', height: '100%', width: '100%' }}
      >
        {!mapError && (
          <ImageOverlay
            url={mapUrl}
            bounds={bounds}
            className="sepia-[.3] contrast-100" 
          />
        )}
        
        {locations.map((loc) => (
          <CustomMarker
            key={loc.id}
            position={[loc.y, loc.x]} 
            data={loc}
            isActive={selectedLocationId === loc.id}
            onClick={() => onLocationSelect(loc)}
          />
        ))}

        <MapController resetTrigger={resetTrigger} bounds={bounds} />
      </MapContainer>
      
      <div className="absolute inset-0 pointer-events-none z-[400] bg-[radial-gradient(circle,transparent_40%,#000000aa_100%)] shadow-inner mix-blend-multiply"></div>
      <div className="absolute inset-0 pointer-events-none z-[390] opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    </div>
  );
};

export default MapWrapper;