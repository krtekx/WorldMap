
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
    mainMap.on('zoom', syncView); 

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
  
  const getLatLngFromMapPos = (pos) => {
    if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
      return L.latLng(0, 0); // Safe fallback
    }
    return L.latLng(pos.y, pos.x);
  };

  const [isDragging, setIsDragging] = useState(false);
  // screenPos is the top-left coordinate of the glass div
  const [screenPos, setScreenPos] = useState({ x: 0, y: 0 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const glassRef = useRef(null);
  
  const zoomOffset = 1.6; // ~3x Zoom
  const GLASS_SIZE = 256; // 64 * 4 (w-64 is 16rem = 256px)
  const HALF_SIZE = GLASS_SIZE / 2;

  // 1. STICK TO MAP LOGIC (When NOT dragging)
  useEffect(() => {
    if (!mainMap || isDragging || !glassPosition) return;

    const updateScreenPosition = () => {
      const latLng = getLatLngFromMapPos(glassPosition);
      // Get the pixel coordinate of the center point relative to the map container
      const containerPoint = mainMap.latLngToContainerPoint(latLng);
      
      // We position the DIV by its top-left corner, so subtract half size
      setScreenPos({ 
        x: containerPoint.x - HALF_SIZE, 
        y: containerPoint.y - HALF_SIZE 
      });
    };

    updateScreenPosition();
    mainMap.on('move zoom', updateScreenPosition);
    return () => mainMap.off('move zoom', updateScreenPosition);
  }, [mainMap, glassPosition, isDragging]);


  // 2. DRAG LOGIC (Manual Pointer Events)
  
  const handlePointerDown = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent map dragging
    
    setIsDragging(true);
    
    // Calculate where we clicked relative to the glass's top-left corner
    // This prevents the glass from "snapping" to the center of the mouse
    const rect = glassRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    // Add global listeners to track movement outside the element
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    e.preventDefault();
    
    // Get the map container's offset (in case the map isn't at 0,0 of the page)
    const mapContainer = mainMap.getContainer();
    const mapRect = mapContainer.getBoundingClientRect();

    // Calculate new position relative to the map container
    const newX = e.clientX - mapRect.left - dragOffset.current.x;
    const newY = e.clientY - mapRect.top - dragOffset.current.y;

    setScreenPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    
    // Clean up listeners
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);

    if (!mainMap) return;

    // Calculate final drop position (Center of the glass)
    // We get the current screenPos (top-left) and add half size back to get center
    const dropCenterX = screenPos.x + HALF_SIZE; // Note: accessing state in event listener might be stale if closure issue, but here we rely on the visual update loop. 
    // BETTER: Use the event client coordinates directly to be safe
    const mapContainer = mainMap.getContainer();
    const mapRect = mapContainer.getBoundingClientRect();
    
    // Re-calculate based on mouse up event for precision, adjusting for the offset we grabbed it at
    const finalX = e.clientX - mapRect.left - dragOffset.current.x + HALF_SIZE;
    const finalY = e.clientY - mapRect.top - dragOffset.current.y + HALF_SIZE;

    const dropPoint = L.point(finalX, finalY);
    const newLatLng = mainMap.containerPointToLatLng(dropPoint);
    
    // Save new position
    onPositionChange({ 
      x: Number(newLatLng.lng.toFixed(1)), 
      y: Number(newLatLng.lat.toFixed(1)) 
    });
  };

  if (!glassPosition) return null;

  return (
    <motion.div
      ref={glassRef}
      onPointerDown={handlePointerDown}
      
      // Use simple animate for smooth transitions when sticking, 
      // but immediate update when dragging for responsiveness
      animate={{ 
        x: screenPos.x,
        y: screenPos.y,
        scale: 1, 
        opacity: 1 
      }}
      transition={{
        // Instant movement when dragging, spring/smooth when map moving
        type: isDragging ? false : "spring",
        stiffness: 500,
        damping: 40
      }}
      
      initial={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98, cursor: "grabbing" }}
      
      className="absolute z-[6000] w-64 h-64 rounded-full cursor-grab touch-none" // touch-none prevents browser scrolling
      style={{
        top: 0,
        left: 0,
        filter: isDragging 
          ? 'drop-shadow(0px 30px 40px rgba(0,0,0,0.7))' // Lifted up shadow
          : 'drop-shadow(0px 10px 15px rgba(0,0,0,0.5))' // Lying down shadow
      }}
    >
      {/* 1. GOLD FRAME (Conic Gradient for Metallic effect) */}
      <div 
        className="absolute inset-0 rounded-full z-20 pointer-events-none" 
        style={{
          background: 'conic-gradient(from 45deg, #8c7b5d, #c5a065, #f5e6c8, #c5a065, #8c7b5d, #5c4d3c, #8c7b5d)',
          boxShadow: 'inset 0 2px 5px rgba(255,255,255,0.4), inset 0 -2px 5px rgba(0,0,0,0.4)',
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
