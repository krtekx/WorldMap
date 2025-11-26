
import React, { useMemo } from 'react';
import { SVGOverlay } from 'react-leaflet';

// HELPER: Convert 0-100 map coords to 0-8192 SVG coords
const MAP_SIZE = 8192;
const s = (val) => (val / 100) * MAP_SIZE;
const toSvgY = (mapY) => MAP_SIZE - ((mapY / 100) * MAP_SIZE);

// HUBS: Approximate coordinates [x, y] on the 0-100 grid
const SEA_HUBS = {
  ny: [28, 55],
  london: [49, 59],
  lisbon: [45, 48],
  west_africa: [45, 30],
  cape_town: [55, 10],
  suez: [57, 52],
  aden: [62, 48],
  bombay: [68, 48],
  colombo: [70, 38],
  singapore: [84, 41], // Adjusted to match map visual
  jakarta: [80, 41],
  hongkong: [76, 49],
  tokyo: [86, 57],
  sydney: [88, 34],
  fiji: [95, 30] // wrap around edge approx
};

const LAND_HUBS = {
  paris: [50, 56],
  berlin: [53, 58],
  moscow: [60, 62],
  istanbul: [58, 53],
  beijing: [75, 59],
  delhi: [69, 52],
  cairo: [57, 51],
  baghdad: [62, 53],
  tehran: [64, 54],
  samarkand: [68, 55]
};

// PRE-DEFINED CONNECTIONS to ensure boats don't go over land randomly
const SEA_ROUTES = [
  ['ny', 'london'], ['ny', 'lisbon'], ['lisbon', 'west_africa'],
  ['london', 'suez'], // abstract through med
  ['suez', 'aden'], ['aden', 'bombay'], ['aden', 'colombo'],
  ['bombay', 'colombo'], ['colombo', 'singapore'],
  ['singapore', 'hongkong'], ['hongkong', 'tokyo'],
  ['singapore', 'jakarta'], ['jakarta', 'sydney'],
  ['sydney', 'fiji'], ['tokyo', 'fiji']
];

const LAND_ROUTES = [
  ['paris', 'berlin'], ['berlin', 'moscow'], ['moscow', 'samarkand'],
  ['istanbul', 'baghdad'], ['baghdad', 'tehran'], ['tehran', 'samarkand'],
  ['samarkand', 'beijing'], ['delhi', 'samarkand'], ['cairo', 'baghdad']
];

const TrafficLayer = ({ bounds }) => {
  
  // Generate random traffic items once on mount
  const traffic = useMemo(() => {
    const items = [];
    let idCounter = 0;

    // Helper to create a curved path string
    const createPath = (p1, p2, bend = 20) => {
      const startX = s(p1[0]);
      const startY = toSvgY(p1[1]);
      const endX = s(p2[0]);
      const endY = toSvgY(p2[1]);

      // Calculate midpoint
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      // Add random offset to midpoint for the "curve" (Quadratic Bezier control point)
      // Randomize direction of bend
      const offset = s(Math.random() * bend - (bend/2)); 
      const ctrlX = midX - (endY - startY) * 0.2 + offset; // Perpendicular-ish shift
      const ctrlY = midY + (endX - startX) * 0.2 + offset;

      return `M ${startX},${startY} Q ${ctrlX},${ctrlY} ${endX},${endY}`;
    };

    // GENERATE BOATS
    const NUM_BOATS = 15;
    for (let i = 0; i < NUM_BOATS; i++) {
      const route = SEA_ROUTES[Math.floor(Math.random() * SEA_ROUTES.length)];
      // Randomly swap start/end so they go both ways
      const [start, end] = Math.random() > 0.5 ? [route[0], route[1]] : [route[1], route[0]];
      
      items.push({
        id: `boat-${idCounter++}`,
        type: 'boat',
        path: createPath(SEA_HUBS[start], SEA_HUBS[end], 15),
        duration: 20 + Math.random() * 40, // 20-60s
        delay: Math.random() * -20, // Start immediately at random offset
        label: `Ship ${Math.floor(Math.random() * 100) + 1}`
      });
    }

    // GENERATE LAND CARAVANS
    const NUM_CARAVANS = 8;
    for (let i = 0; i < NUM_CARAVANS; i++) {
      const route = LAND_ROUTES[Math.floor(Math.random() * LAND_ROUTES.length)];
      const [start, end] = Math.random() > 0.5 ? [route[0], route[1]] : [route[1], route[0]];

      items.push({
        id: `land-${idCounter++}`,
        type: 'land',
        path: createPath(LAND_HUBS[start], LAND_HUBS[end], 5), // Less curve on land
        duration: 30 + Math.random() * 30,
        delay: Math.random() * -30,
        label: Math.random() > 0.5 ? 'Caravan' : 'Express'
      });
    }

    return items;
  }, []);

  return (
    <SVGOverlay attributes={{ viewBox: `0 0 ${MAP_SIZE} ${MAP_SIZE}` }} bounds={bounds}>
      <defs>
        {/* Define paths for reuse if needed, though we use them inline for simplicity with React lists */}
        <filter id="shadow">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="black" floodOpacity="0.5"/>
        </filter>
      </defs>

      {traffic.map((item) => (
        <React.Fragment key={item.id}>
          {/* 1. THE INVISIBLE PATH DEFINITION */}
          <path id={`path-${item.id}`} d={item.path} fill="none" stroke="none" />

          {/* 2. VISIBLE TRAIL (Optional, maybe for land routes only?) */}
          {item.type === 'land' && (
             <path d={item.path} fill="none" stroke="#5c4d3c" strokeWidth="2" strokeDasharray="5,10" opacity="0.3" />
          )}
          {item.type === 'boat' && (
             <path d={item.path} fill="none" stroke="#c5a065" strokeWidth="4" strokeDasharray="20,40" opacity="0.2" />
          )}

          {/* 3. MOVING ICON (Rotates with path) */}
          <g>
            <animateMotion dur={`${item.duration}s`} begin={`${item.delay}s`} repeatCount="indefinite" rotate="auto">
              <mpath href={`#path-${item.id}`} />
            </animateMotion>
            
            {item.type === 'boat' ? (
               // Boat Shape
               <path 
                 d="M -15,-5 L 15,0 L -15,5 Z" 
                 fill="#8c3a3a" stroke="white" strokeWidth="2" 
                 filter="url(#shadow)"
               />
            ) : (
               // Land Shape (Circle/Square)
               <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#5c4d3c" stroke="#c5a065" strokeWidth="2" />
            )}
          </g>

          {/* 4. TEXT LABEL (Does NOT rotate - uses same motion path but rotate="0") */}
          <g>
             <animateMotion dur={`${item.duration}s`} begin={`${item.delay}s`} repeatCount="indefinite" rotate="0">
              <mpath href={`#path-${item.id}`} />
            </animateMotion>
            
            {/* Offset text slightly above the icon */}
            <text 
              y="-15" 
              x="0" 
              textAnchor="middle"
              fontSize={item.type === 'boat' ? "32" : "24"} 
              fill={item.type === 'boat' ? "#c5a065" : "#e8dcc5"} 
              fontWeight="bold" 
              style={{ textShadow: '2px 2px 0 #000' }}
            >
              {item.label}
            </text>
          </g>
        </React.Fragment>
      ))}

      {/* Static Legend or Decoration (Optional) */}
      <text x={s(5)} y={toSvgY(5)} fontSize="40" fill="#fff" opacity="0.3" fontStyle="italic">
        Traffic Live View
      </text>

    </SVGOverlay>
  );
};

export default TrafficLayer;
