import React from 'react';
import { SVGOverlay } from 'react-leaflet';

const TrafficLayer = ({ bounds }) => {
  // Map Dimensions are 1000x1000 based on MapWrapper config
  // Map Space: (0,0) is Bottom-Left.
  // SVG Space: (0,0) is Top-Left.
  // We must flip the Y coordinate: svgY = 1000 - mapY.
  
  const toSvgY = (mapY) => 1000 - mapY;

  // ROUTE DEFINITIONS (Start -> End)
  // Coordinates derived from points.js (multiplied by 10)
  // NY (281, 554) -> Europe/Moravska (approx 450, 550) -> extended to Atlantic
  // Suez (573, 524) -> India/Bombay (684, 482)
  // Tokyo (856, 571) -> Sydney (879, 343)

  return (
    <SVGOverlay bounds={bounds}>
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
      {/* Path: Curve from NY (281, 554) towards Europe */}
      <path
        id="route-atlantic"
        d={`M 281,${toSvgY(554)} Q 380,${toSvgY(450)} 500,${toSvgY(580)}`}
        fill="none"
        stroke="#c5a065"
        strokeWidth="1.5"
        strokeDasharray="4,6"
        opacity="0.4"
      />
      {/* Moving Ship */}
      <circle r="3" fill="#8c3a3a" opacity="0.8">
        <animateMotion dur="14s" repeatCount="indefinite" rotate="auto" keyPoints="0;1" keyTimes="0;1">
          <mpath href="#route-atlantic" />
        </animateMotion>
      </circle>

      {/* Route 2: Spice Route (Suez -> India) */}
      <path
        id="route-indian"
        d={`M 573,${toSvgY(524)} Q 600,${toSvgY(440)} 684,${toSvgY(482)}`}
        fill="none"
        stroke="#c5a065"
        strokeWidth="1.5"
        strokeDasharray="4,6"
        opacity="0.4"
      />
      <circle r="3" fill="#8c3a3a" opacity="0.8">
        <animateMotion dur="10s" begin="2s" repeatCount="indefinite" rotate="auto">
          <mpath href="#route-indian" />
        </animateMotion>
      </circle>

      {/* Route 3: Pacific (Japan -> Australia) */}
      <path
        id="route-pacific"
        d={`M 856,${toSvgY(571)} Q 920,${toSvgY(450)} 879,${toSvgY(343)}`}
        fill="none"
        stroke="#c5a065"
        strokeWidth="1.5"
        strokeDasharray="4,6"
        opacity="0.4"
      />
      <circle r="3" fill="#8c3a3a" opacity="0.8">
        <animateMotion dur="18s" begin="5s" repeatCount="indefinite" rotate="auto">
          <mpath href="#route-pacific" />
        </animateMotion>
      </circle>


      {/* --- SEA CREATURES --- */}

      {/* Octopus in Deep Pacific (Right side) */}
      <g transform={`translate(920, ${toSvgY(200)})`} opacity="0.6">
        <text fontSize="40" style={{ filter: 'url(#glow)' }}>
          🐙
          <animate attributeName="opacity" values="0;0.5;0" dur="12s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 0; 0 -10; 0 0" dur="6s" repeatCount="indefinite" />
        </text>
      </g>

      {/* Whale in South Atlantic (Left-Center bottom) */}
      <g transform={`translate(400, ${toSvgY(250)})`} opacity="0.6">
        <text fontSize="50" style={{ filter: 'url(#glow)' }}>
          🐋
          <animate attributeName="opacity" values="0;0.4;0" dur="15s" begin="3s" repeatCount="indefinite" />
          <animateTransform attributeName="transform" type="translate" values="0 0; 20 5; 0 0" dur="15s" repeatCount="indefinite" />
        </text>
      </g>

    </SVGOverlay>
  );
};

export default TrafficLayer;
