
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ImageOff, FolderOpen } from 'lucide-react';

const InfoModal = ({ location, onClose }) => {
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  // Reset error state and update image source with cache buster when location changes
  useEffect(() => {
    if (location) {
      setImgError(false);
      // Přidání časového razítka pro vynucení nového načtení obrázku
      // Zkontrolujeme, zda URL už obsahuje '?', abychom použili správný oddělovač
      const separator = location.image.includes('?') ? '&' : '?';
      setImgSrc(`${location.image}${separator}t=${new Date().getTime()}`);
    }
  }, [location]);

  if (!location) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-10"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="bg-[#f4ebe1] rounded-xl overflow-hidden shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row relative border-4 border-[#d4b98c]"
          onClick={(e) => e.stopPropagation()} 
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-[#8c3a3a] hover:text-white text-[#5c4d3c] p-2 rounded-full transition-colors duration-200 shadow-md"
          >
            <X size={28} />
          </button>

          {/* Image Section */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-[#1a1814] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#d4b98c]">
            {!imgError ? (
              <img
                src={imgSrc}
                alt={location.title}
                onError={() => setImgError(true)}
                className="w-full h-full object-contain opacity-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-[#8c7b5d]/50 p-6 text-center w-full">
                <ImageOff size={48} className="mb-4" />
                <h3 className="text-lg font-bold mb-2">Chybí fotografie</h3>
                <div className="bg-black/20 p-4 rounded text-xs font-mono text-[#c5a065] break-all max-w-[80%]">
                  <div className="flex items-center justify-center gap-2 mb-1 border-b border-white/10 pb-1">
                    <FolderOpen size={12} />
                    <span>Upload this file:</span>
                  </div>
                  {location.image}
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1a1814] to-transparent p-4 pointer-events-none">
              <span className="inline-flex items-center text-white/90 text-sm font-medium tracking-wider bg-[#8c3a3a] px-3 py-1 rounded-sm shadow-lg">
                 {location.region}
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
            <div className="flex items-center gap-2 text-[#8c7b5d] mb-2 uppercase tracking-widest text-sm font-bold">
              <MapPin size={16} />
              <span>Lokace č. {location.id}</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-serif text-[#3e3428] font-bold mb-6 border-b-2 border-[#d4b98c] pb-4 leading-tight">
              {location.title}
            </h2>
            
            <div className="prose prose-lg text-[#5c4d3c] leading-relaxed flex-grow">
              <p>{location.description}</p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#d4b98c]/30 text-[#8c7b5d] text-sm italic">
               Sbírka L. V. Holzmaistera
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InfoModal;
