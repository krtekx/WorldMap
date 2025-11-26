
import React, { createContext, useContext, useState, useRef } from 'react';

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export const SoundProvider = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  
  // Cache audio objects to avoid reloading
  const audioCache = useRef({});

  const playSound = (soundName) => {
    if (isMuted) return;

    try {
      // Create audio object if it doesn't exist
      if (!audioCache.current[soundName]) {
        audioCache.current[soundName] = new Audio(`assets/sounds/${soundName}.mp3`);
      }

      const audio = audioCache.current[soundName];
      
      // Reset time to allow rapid re-playing
      audio.currentTime = 0;
      audio.volume = 0.5; // Reasonable default volume
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play policy or missing file errors are caught here
          console.warn(`Audio playback failed for ${soundName}:`, error);
        });
      }
    } catch (e) {
      console.warn("Audio error:", e);
    }
  };

  const toggleMute = () => setIsMuted(prev => !prev);

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, playSound }}>
      {children}
    </SoundContext.Provider>
  );
};
