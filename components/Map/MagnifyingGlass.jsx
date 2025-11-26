
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, ImageOverlay, useMap } from 'react-leaflet';
import L from 'leaflet';
import TrafficLayer from './TrafficLayer';

// Internal component to sync the glass map view with the glass position
const GlassController = ({ glassCenter, mainMap, zoomOffset }) => {
  const map = useMap();

  useEffect(() => {
    if (!mainMap || !glassCenter) return;

    const syncView = () => {
      // 1. Get the LatLng on the MAIN map corresponding to the pixel position of the glass center
      const point = L.point(glassCenter.x, glassCenter.y);
      const latLng = mainMap.containerPointToLatLng(point);

      // 2. Get the current zoom of the main map
      const mainZoom = mainMap.getZoom();

      // 3. Set the glass map to the same LatLng but higher zoom
      // 3.3 zoom levels higher is roughly 10x magnification (2^3.32 ≈ 10)
      map.setView(latLng, mainZoom + zoomOffset, { animate: false });
    };

    // Sync immediately
    syncView();

    // Sync whenever the main map moves (panning underneath the glass)
    mainMap.on('move', syncView);
    mainMap.on('zoom', syncView);

    return () => {
      mainMap.off('move', syncView);
      mainMap.off('zoom', syncView);
    };
  }, [glassCenter, mainMap, map, zoomOffset]);

  return null;
};

const MagnifyingGlass = ({ 
  mainMap, 
  mapUrl, 
  bounds, 
  gems,
  onGemFound,
  foundGems,
  initialPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 } 
}) => {
  // Position of the Glass in Screen Coordinates
  const [glassPos, setGlassPos] = useState(initialPosition);
  const zoomOffset = 3.3; // ~10x magnification

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDrag={(event, info) => {
        setGlassPos({ x: info.point.x, y: info.point.y });
      }}
      initial={{ x: initialPosition.x - 128, y: initialPosition.y - 128, scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98, cursor: "grabbing" }}
      className="absolute z-[6000] w-64 h-64 rounded-full cursor-grab shadow-[0_30px_60px_rgba(0,0,0,0.9)]"
      style={{
        background: 'linear-gradient(135deg, #e8dcc5 0%, #c5a065 50%, #8c7b5d 100%)',
        padding: '8px',
        left: 0,
        top: 0
      }}
    >
      {/* Handle */}
      <div className="absolute -bottom-20 -right-20 w-40 h-8 bg-[#5c3a2a] rotate-45 transform origin-top-left rounded-full border-4 border-[#3c2d1c] shadow-2xl z-[-1]" />

      <div className="w-full h-full rounded-full overflow-hidden relative border-4 border-[#1a1814] bg-[#1a1814]">
        <MapContainer
          crs={L.CRS.Simple}
          center={[4096, 4096]} 
          zoom={1}
          zoomControl={false}
          attributionControl={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          className="w-full h-full"
          style={{ background: '#1a1814' }}
        >
          <ImageOverlay url={mapUrl} bounds={bounds} />
          <TrafficLayer bounds={bounds} />
          
          {/* Render Gems inside the glass too, so they can be seen magnified */}
          {gems && gems.map(gem => (
             <L.Marker
                key={`glass-gem-${gem.id}`}
                position={[gem.y, gem.x]}
                icon={L.divIcon({
                  className: 'gem-icon',
                  html: `<div class="text-4xl filter drop-shadow-lg animate-pulse">💎</div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
                })}
             />
          ))}
          
          <GlassController 
            glassCenter={glassPos} 
            mainMap={mainMap} 
            zoomOffset={zoomOffset} 
          />
        </MapContainer>
        
        {/* Reflection/Shine */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/30 to-transparent pointer-events-none z-[9999]" />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] pointer-events-none z-[9999]" />
        
        {/* Crosshair for targeting */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
            <div className="w-8 h-8 border border-red-500/50 rounded-full"></div>
            <div className="absolute w-1 h-2 bg-red-500/50"></div>
            <div className="absolute w-2 h-1 bg-red-500/50"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default MagnifyingGlass;
