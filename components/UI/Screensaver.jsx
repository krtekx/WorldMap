import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand } from 'lucide-react';

const Screensaver = ({ isActive, onTouch }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onTouch}
          className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center cursor-pointer text-[#e8dcc5]"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-8 p-8 border-4 border-[#c5a065] rounded-full"
          >
            <Hand size={80} />
          </motion.div>
          
          <h1 className="text-5xl font-serif font-bold tracking-widest uppercase mb-4 text-[#c5a065]">
            L. V. Holzmaister
          </h1>
          <p className="text-2xl font-light tracking-wide opacity-90">
            Dotkněte se obrazovky pro zahájení cesty
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Screensaver;