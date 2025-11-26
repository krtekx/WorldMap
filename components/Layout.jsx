import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#1a1814] text-[#e8dcc5]">
      {/* Header / Brand - Absolute positioned over map */}
      <div className="absolute top-0 left-0 p-6 z-[1000] pointer-events-none">
         <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-[#c5a065]/30">
            <h1 className="text-2xl md:text-3xl font-serif text-[#c5a065] tracking-widest uppercase shadow-black drop-shadow-md">
              Itinerarium
            </h1>
            <p className="text-sm md:text-base text-[#e8dcc5]/80 font-light">
              L. V. Holzmaister – Perigrinatio Mundi
            </p>
         </div>
      </div>
      
      <main className="w-full h-full">
        {children}
      </main>
    </div>
  );
};

export default Layout;