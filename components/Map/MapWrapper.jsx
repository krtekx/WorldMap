import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import CustomMarker from './CustomMarker.jsx';
import { AlertTriangle } from 'lucide-react';

// Component to handle initial fit and reset interactions
const MapController = ({ resetTrigger, bounds, minZoom }) => {
  const map = useMap();
  
  // Fit map to bounds on load and window resize
  useEffect(() => {
    if (bounds && minZoom !== -1) {
      map.setMinZoom(minZoom);
      map.setMaxBounds(bounds);
      
      // Initial fit: center the map
      map.setView([500, 500], minZoom);
    }
  }, [map, bounds, minZoom]);

  // Handle idle reset
  useEffect(() => {
    if (resetTrigger > 0 && minZoom !== -1) {
      map.flyTo([500, 500], minZoom, { 
        animate: true,
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [resetTrigger, map, minZoom]);

  return null;
};

const MapWrapper = ({ locations, onLocationSelect, selectedLocationId, resetTrigger, isSetupMode, onUpdateLocation }) => {
  // SQUARE FORMAT CONFIGURATION (1:1 Aspect Ratio)
  const imageWidth = 1000; 
  const imageHeight = 1000;
  // Define bounds in Leaflet's simple CRS
  // [0,0] is bottom-left, [height, width] is top-right
  const bounds = [[0, 0], [imageHeight, imageWidth]]; 
  
  // OFFLINE MODE PATH
  const mapUrl = 'assets/images/background_map.jpg';

  const [mapError, setMapError] = useState(false);
  const [attemptedUrl, setAttemptedUrl] = useState('');
  const [minZoom, setMinZoom] = useState(-1); 

  useEffect(() => {
    const img = new Image();
    img.src = mapUrl;
    setAttemptedUrl(img.src);
    img.onerror = () => setMapError(true);

    // Calculate minZoom to COVER the screen
    // This ensures no grey bars are visible (Zoom is locked to fit the larger dimension)
    const calculateZoom = () => {
       const windowWidth = window.innerWidth;
       const windowHeight = window.innerHeight;
       
       const widthRatio = windowWidth / imageWidth;
       const heightRatio = windowHeight / imageHeight;

       // Use Math.max to "Cover" the area. 
       // If window is wide, we fit to width (cropping top/bottom).
       // If window is tall, we fit to height (cropping sides).
       const scale = Math.max(widthRatio, heightRatio);
       
       const zoomLevel = Math.log2(scale);
       
       setMinZoom(zoomLevel);
    };

    calculateZoom();
    window.addEventListener('resize', calculateZoom);
    return () => window.removeEventListener('resize', calculateZoom);

  }, []);

  // Defensive filtering to prevent Invalid LatLng errors
  const validLocations = (locations || []).filter(loc => 
    loc.y !== undefined && loc.y !== null && !isNaN(Number(loc.y)) &&
    loc.x !== undefined && loc.x !== null && !isNaN(Number(loc.x))
  );

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
            <p className="text-white">public/assets/images/background_map.jpg</p>
          </div>
        </div>
      )}

      {/* Render Map only when minZoom is calculated to prevent flash/error */}
      {minZoom !== -1 && (
        <MapContainer
          crs={L.CRS.Simple}
          center={[500, 500]} 
          zoom={minZoom}
          minZoom={minZoom}
          maxZoom={minZoom + 3} 
          zoomSnap={0.01} // Smoother fit
          zoomDelta={0.2}
          wheelPxPerZoomLevel={200} // Slower zoom
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
              opacity={1}
              zIndex={1}
            />
          )}
          
          {validLocations.map((loc) => (
            <CustomMarker
              key={loc.id}
              // Scale coordinates from 0-100 input to 0-1000 map space
              // Leaflet Simple CRS: [y, x]
              position={[Number(loc.y) * 10, Number(loc.x) * 10]} 
              data={loc}
              isActive={selectedLocationId === loc.id}
              onClick={() => onLocationSelect(loc)}
              isSetupMode={isSetupMode}
              onDragEnd={onUpdateLocation}
            />
          ))}

          <MapController resetTrigger={resetTrigger} bounds={bounds} minZoom={minZoom} />
        </MapContainer>
      )}
      
      <div className="absolute inset-0 pointer-events-none z-[400] bg-[radial-gradient(circle,transparent_40%,#000000aa_100%)] shadow-inner mix-blend-multiply"></div>
    </div>
  );
};

export default MapWrapper;