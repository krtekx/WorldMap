
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, ImageOverlay, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import TrafficLayer from './TrafficLayer';

// Interní komponenta pro synchronizaci pohledu v lupě
const GlassController = ({ glassCenter, mainMap, zoomOffset }) => {
  const map = useMap();

  useEffect(() => {
    if (!mainMap || !glassCenter) return;

    const syncView = () => {
      // 1. Zjistíme LatLng na HLAVNÍ mapě odpovídající středu lupy
      const point = L.point(glassCenter.x, glassCenter.y);
      const latLng = mainMap.containerPointToLatLng(point);

      // 2. Zjistíme aktuální zoom hlavní mapy
      const mainZoom = mainMap.getZoom();

      // 3. Nastavíme mapu v lupě na stejné místo, ale s větším zoomem
      // Zoom offset 3.3 odpovídá zhruba 10násobnému zvětšení
      map.setView(latLng, mainZoom + zoomOffset, { animate: false });
    };

    // Synchronizovat ihned
    syncView();

    // Synchronizovat při pohybu hlavní mapy
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
  initialPosition
}) => {
  // Pokud není zadána pozice, umístíme ji do pravého dolního rohu (s odstupem)
  const defaultPos = { 
    x: window.innerWidth - 300, 
    y: window.innerHeight - 300 
  };

  const [glassPos, setGlassPos] = useState(initialPosition || defaultPos);
  const zoomOffset = 3.3; // ~10x zvětšení

  return (
    <motion.div
      drag
      dragMomentum={false} // Žádná setrvačnost, chceme přesné ovládání
      dragElastic={0}      // Žádné "natahování" při tažení mimo
      onDrag={(event, info) => {
        // info.point je pozice myši/prstu vůči stránce
        setGlassPos({ x: info.point.x, y: info.point.y });
      }}
      // Počáteční animace příletu
      initial={{ scale: 0, opacity: 0, x: (initialPosition || defaultPos).x - 128, y: (initialPosition || defaultPos).y - 128 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98, cursor: "grabbing" }}
      // Stylování samotné čočky
      className="absolute z-[6000] w-64 h-64 rounded-full cursor-grab"
      style={{
        // Stín a okraj pro efekt "položeného předmětu"
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 0 0 2px rgba(255,255,255,0.1)',
        left: 0,
        top: 0
      }}
    >
      {/* Kovový rám čočky (mosaz) */}
      <div className="absolute inset-0 rounded-full border-[12px] border-[#c5a065] z-20 pointer-events-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" 
           style={{ background: 'transparent' }} />

      {/* Obsah lupy (maskovaná mapa) */}
      <div className="w-full h-full rounded-full overflow-hidden relative bg-[#1a1814]">
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
          
          {/* Vykreslení drahokamů i v lupě - Použití <Marker> místo <L.Marker> */}
          {gems && gems.map(gem => (
             <Marker
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
        
        {/* Odlesky skla (vrchní vrstvy) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none z-[9999]" />
        <div className="absolute top-4 left-8 w-16 h-8 bg-white/10 blur-xl rounded-full transform -rotate-45 pointer-events-none z-[9999]" />
      </div>
    </motion.div>
  );
};

export default MagnifyingGlass;