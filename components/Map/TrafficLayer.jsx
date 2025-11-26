
import React from 'react';
import { SVGOverlay } from 'react-leaflet';

const TrafficLayer = ({ bounds }) => {
  // Map Dimensions: 8192 x 8192
  // Map Space: (0,0) is Bottom-Left.
  // SVG Space: (0,0) is Top-Left.
  // We must flip the Y coordinate: svgY = 8192 - mapY.
  
  const MAP_SIZE = 8192;
  const toSvgY = (mapY) => MAP_SIZE - mapY;

  // SCALING HELPERS
  // Our points.js data is 0-100.
  // We need to convert that to 0-8192 for the SVG pathing
  const s = (val) => (val / 100) * MAP_SIZE;

  // ROUTE DEFINITIONS (Start -> End)
  // Coordinates derived from points.js (approximate locations)
  
  return (
    <SVGOverlay attributes={{ viewBox: `0 0 ${MAP_SIZE} ${MAP_SIZE}` }} bounds={bounds}>
      {/* Defs for gradients or filters */}
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* --- SHIP ROUTES --- */}
      
      {/* Route 1: Atlantic Crossing (Europe <-> America) */}
      <path
        id="route-atlantic"
        d={`M ${s(28.1)},${toSvgY(s(55.4))} Q ${s(38)},${toSvgY(s(45))} ${s(50)},${toSvgY(s(58))}`}
        fill="none"
        stroke="#c5a065"
        strokeWidth="6"
        strokeDasharray="20,30"
        opacity="0.3"
      />
      {/* Moving Ship */}
      <g>
        <animateMotion dur="25s" repeatCount="indefinite" rotate="auto">
          <mpath href="#route-atlantic" />
        </animateMotion>
        <circle r="12" fill="#8c3a3a" stroke="white" strokeWidth="2" />
        <text y="-25" x="-20" fontSize="40" fill="#c5a065" fontWeight="bold" style={{ textShadow: '2px 2px 0 #000' }}>
           S.S. Holzmaister
        </text>
      </g>

      {/* Route 2: Spice Route (Suez -> India) */}
      <path
        id="route-indian"
        d={`M ${s(57.3)},${toSvgY(s(52.4))} Q ${s(60)},${toSvgY(s(44))} ${s(68.4)},${toSvgY(s(48.2))}`}
        fill="none"
        stroke="#c5a065"
        strokeWidth="6"
        strokeDasharray="20,30"
        opacity="0.3"
      />
      <g>
        <animateMotion dur="20s" begin="2s" repeatCount="indefinite" rotate="auto">
          <mpath href="#route-indian" />
        </animateMotion>
        <circle r="12" fill="#8c3a3a" stroke="white" strokeWidth="2" />
        <text y="-25" x="-20" fontSize="40" fill="#c5a065" fontWeight="bold" style={{ textShadow: '2px 2px 0 #000' }}>
           Trade Route
        </text>
      </g>

      {/* Route 3: Pacific (Japan -> Australia) */}
      <path
        id="route-pacific"
        d={`M ${s(85.6)},${toSvgY(s(57.1))} Q ${s(92)},${toSvgY(s(45))} ${s(87.9)},${toSvgY(s(34.3))}`}
        fill="none"
        stroke="#c5a065"
        strokeWidth="6"
        strokeDasharray="20,30"
        opacity="0.3"
      />
      <g>
        <animateMotion dur="30s" begin="5s" repeatCount="indefinite" rotate="auto">
          <mpath href="#route-pacific" />
        </animateMotion>
        <circle r="12" fill="#8c3a3a" stroke="white" strokeWidth="2" />
        <text y="-25" x="-20" fontSize="40" fill="#c5a065" fontWeight="bold" style={{ textShadow: '2px 2px 0 #000' }}>
           Expedition
        </text>
      </g>

      {/* --- STATIC AMBIENT DOTS (Placeholders) --- */}
      <circle cx={s(40)} cy={toSvgY(s(25))} r="10" fill="#5c4d3c" opacity="0.5" />
      <text x={s(40)} y={toSvgY(s(25)) - 20} fontSize="30" fill="#fff" opacity="0.5">Deep Sea</text>

    </SVGOverlay>
  );
};

export default TrafficLayer;
