import { useEffect, useRef } from 'react';

export const useIdleTimer = (timeout = 60000, onIdle) => {
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(onIdle, timeout);
  };

  useEffect(() => {
    // Initial start
    resetTimer();

    // Events to listen for activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

    const handleUserActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
    };
  }, [timeout, onIdle]);

  return resetTimer;
};