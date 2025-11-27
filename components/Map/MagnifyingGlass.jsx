
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, ImageOverlay, useMap, Marker } from 'react-leaflet';
import L from 'leaflet';
import TrafficLayer from './TrafficLayer';

// Component to sync inner map view
const GlassController = ({ glassLatLng, mainMap, zoomOffset }) => {
  const map = useMap();

  useEffect(() => {
    if (!mainMap || !glassLatLng) return;

    const syncView = () => {
      const mainZoom = mainMap.getZoom();
      // Sync view to the exact LatLng of the glass center
      map.setView(glassLatLng, mainZoom + zoomOffset, { animate: false });
    };

    syncView();
    mainMap.on('zoom', syncView); // Only listen to zoom, move is handled by parent

    return () => {
      mainMap.off('zoom', syncView);
    };
  }, [glassLatLng, mainMap, map, zoomOffset]);

  return null;
};

const MagnifyingGlass = ({ 
  mainMap, 
  mapUrl, 
  bounds, 
  gems,
  glassPosition, // {x, y} in map coordinates (0-8192)
  onPositionChange
}) => {
  
  // Convert 0-8192 coords to Leaflet LatLng
  const getLatLngFromMapPos = (pos) => L.latLng(pos.y, pos.x);

  const [isDragging, setIsDragging] = useState(false);
  const [screenPos, setScreenPos] = useState({ x: 0, y: 0 });
  const zoomOffset = 1.6; // ~3x Zoom

  // LOGIC: STICK TO MAP
  // We calculate where the glass should be on SCREEN based on where it is on the MAP.
  useEffect(() => {
    if (!mainMap || isDragging) return;

    const updateScreenPosition = () => {
      const latLng = getLatLngFromMapPos(glassPosition);
      // Convert LatLng -> Screen Pixel (x,y)
      const containerPoint = mainMap.latLngToContainerPoint(latLng);
      setScreenPos(containerPoint);
    };

    // Update immediately
    updateScreenPosition();

    // Update whenever the map moves (pan/zoom)
    mainMap.on('move zoom', updateScreenPosition);
    return () => mainMap.off('move zoom', updateScreenPosition);
  }, [mainMap, glassPosition, isDragging]);

  const handleDragStart = () => setIsDragging(true);

  const handleDrag = (event, info) => {
    // While dragging, we follow the mouse pointer
    setScreenPos({ x: info.point.x, y: info.point.y });
  };

  const handleDragEnd = (event, info) => {
    setIsDragging(false);
    if (!mainMap) return;

    // On drop, convert Screen Pixel -> Map LatLng
    const dropPoint = L.point(info.point.x, info.point.y);
    const newLatLng = mainMap.containerPointToLatLng(dropPoint);
    
    // Save new position
    onPositionChange({ 
      x: Number(newLatLng.lng.toFixed(1)), 
      y: Number(newLatLng.lat.toFixed(1)) 
    });
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      // If not dragging, animate to the calculated screen position (stick effect)
      animate={!isDragging ? { 
        x: screenPos.x - 128, // Center offset (width/2)
        y: screenPos.y - 128, // Center offset (height/2)
        scale: 1, opacity: 1 
      } : {}}
      
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98, cursor: "grabbing" }}
      
      className="absolute z-[6000] w-64 h-64 rounded-full cursor-grab"
      style={{
        top: 0,
        left: 0,
        // Realistic shadow for the object lying on the table
        filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.6))'
      }}
    >
      {/* 1. GOLD FRAME (Conic Gradient for Metallic effect) */}
      <div 
        className="absolute inset-0 rounded-full z-20 pointer-events-none" 
        style={{
          background: 'conic-gradient(from 45deg, #8c7b5d, #c5a065, #f5e6c8, #c5a065, #8c7b5d, #5c4d3c, #8c7b5d)',
          boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.4), inset 0 -2px 5px rgba(0,0,0,0.4)',
          // Cut out the middle to make it a frame
          mask: 'radial-gradient(transparent 64%, black 65%)',
          WebkitMask: 'radial-gradient(transparent 64%, black 65%)'
        }} 
      />
      
      {/* 2. INNER RIM (Darker depth) */}
      <div className="absolute inset-[12px] rounded-full border-4 border-[#3e3020] z-20 pointer-events-none opacity-60" />

      {/* 3. LENS CONTENT */}
      <div className="absolute inset-[14px] rounded-full overflow-hidden bg-[#1a1814]">
        <MapContainer
          crs={L.CRS.Simple}
          center={[0, 0]} 
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
            glassLatLng={getLatLngFromMapPos(glassPosition)} 
            mainMap={mainMap} 
            zoomOffset={zoomOffset} 
          />
        </MapContainer>
        
        {/* 4. GLASS EFFECTS (Overlays) */}
        
        {/* Inner Shadow for curvature */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,0.6)] pointer-events-none z-[9999]" />
        
        {/* Specular Highlight (Reflection) */}
        <div 
            className="absolute top-4 left-6 w-24 h-12 bg-gradient-to-b from-white to-transparent rounded-[50%] opacity-20 pointer-events-none z-[9999] transform -rotate-12" 
            style={{ filter: 'blur(2px)' }}
        />
        
        {/* Bottom Highlight (Caustics) */}
        <div className="absolute bottom-4 right-10 w-32 h-16 bg-gradient-to-t from-[#c5a065] to-transparent rounded-[50%] opacity-10 pointer-events-none z-[9999] mix-blend-overlay" />
      </div>
    </motion.div>
  );
};

export default MagnifyingGlass;
