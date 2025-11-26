import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

// Create a custom DivIcon using pure HTML/CSS logic within Leaflet
const createCustomIcon = (isActive) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative w-8 h-8 group cursor-pointer">
        ${isActive 
          ? `<div class="absolute inset-0 bg-[#8c3a3a] rounded-full animate-ping opacity-75"></div>` 
          : `<div class="absolute inset-0 bg-[#c5a065] rounded-full animate-ping opacity-0 group-hover:opacity-40"></div>`
        }
        <div class="relative w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all duration-300 transform group-hover:scale-125 ${isActive ? 'bg-[#8c3a3a] scale-125' : 'bg-[#5c4d3c]'}">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const CustomMarker = ({ position, onClick, isActive, data }) => {
  return (
    <Marker 
      position={position} 
      icon={createCustomIcon(isActive)}
      eventHandlers={{
        click: onClick
      }}
    />
  );
};

export default CustomMarker;