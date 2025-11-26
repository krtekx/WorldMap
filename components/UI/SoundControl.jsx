
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../../contexts/SoundContext';

const SoundControl = () => {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      className="absolute top-24 right-8 z-[500] p-4 rounded-full bg-[#1a1814]/80 text-[#c5a065] border-2 border-[#c5a065] hover:bg-[#2d2a24] transition-all shadow-xl"
      title={isMuted ? "Zapnout zvuk" : "Vypnout zvuk"}
    >
      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
    </button>
  );
};

export default SoundControl;
