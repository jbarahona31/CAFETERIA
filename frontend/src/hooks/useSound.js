import { useRef, useCallback } from 'react';

const SOUNDS = {
  newOrder: '/sounds/new-order.mp3',
  orderReady: '/sounds/order-ready.mp3'
};

export function useSound() {
  const audioRefs = useRef({});

  const play = useCallback((soundType, volume = 0.6) => {
    const soundPath = SOUNDS[soundType];
    if (!soundPath) {
      console.warn(`Sound type "${soundType}" not found`);
      return;
    }

    try {
      // Create new audio instance or reuse existing
      if (!audioRefs.current[soundType]) {
        audioRefs.current[soundType] = new Audio(soundPath);
      }

      const audio = audioRefs.current[soundType];
      audio.volume = volume;
      audio.currentTime = 0;
      
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Audio playback failed:', error);
        });
      }
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }, []);

  const playNewOrder = useCallback(() => {
    play('newOrder', 0.6);
  }, [play]);

  const playOrderReady = useCallback(() => {
    play('orderReady', 0.8);
  }, [play]);

  return {
    play,
    playNewOrder,
    playOrderReady
  };
}

export default useSound;
