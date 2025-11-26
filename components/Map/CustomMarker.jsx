import React, { useMemo, useRef } from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

// Create a custom DivIcon using pure HTML/CSS logic within Leaflet
const createCustomIcon = (isActive, isSetupMode, data) => {
  const label = isSetupMode ? `${data.id}. ${data.title}` : '';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative w-8 h-8 group ${isSetupMode ? 'cursor-move' : 'cursor-pointer'}">
        ${isActive && !isSetupMode
          ? `<div class="absolute inset-0 bg-[#8c3a3a] rounded-full animate-ping opacity-75"></div>` 
          : !isSetupMode 
            ? `<div class="absolute inset-0 bg-[#c5a065] rounded-full animate-ping opacity-0 group-hover:opacity-40"></div>`
            : ''
        }
        <div class="relative w-8 h-8 rounded-full border-2 ${isSetupMode ? 'border-blue-400' : 'border-white'} shadow-lg flex items-center justify-center transition-all duration-300 transform ${!isSetupMode ? 'group-hover:scale-125' : ''} ${isActive ? 'bg-[#8c3a3a] scale-125' : 'bg-[#5c4d3c]'}">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
        ${isSetupMode 
          ? `<div class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded shadow-md whitespace-nowrap z-[9999] border border-white/50">${label}</div>` 
          : ''}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const CustomMarker = ({ position, onClick, isActive, data, isSetupMode, onDragEnd }) => {
  const markerRef = useRef(null);

  const eventHandlers = useMemo(
    () => ({
      click: () => {
        // Prevent click when dragging
        if (!isSetupMode) {
          onClick();
        }
      },
      dragend: () => {
        const marker = markerRef.current;
        if (marker && onDragEnd) {
          const latLng = marker.getLatLng();
          // Convert Leaflet LatLng back to our 0-100 coordinate system
          // In MapWrapper: position={[y * 10, x * 10]}
          // So: y = lat / 10, x = lng / 10
          onDragEnd(data.id, latLng.lng / 10, latLng.lat / 10);
        }
      },
    }),
    [onClick, onDragEnd, isSetupMode, data.id]
  );

  return (
    <Marker 
      ref={markerRef}
      draggable={isSetupMode}
      position={position} 
      icon={createCustomIcon(isActive, isSetupMode, data)}
      eventHandlers={eventHandlers}
    />
  );
};

export default CustomMarker;