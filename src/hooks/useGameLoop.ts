import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

export const useGameLoop = (callback: () => void) => {
  const isPaused = useSelector((state: RootState) => state.game.isPaused);
  const frameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    let lastTime = 0;
    
    const animate = (currentTime: number) => {
      if (!lastTime) lastTime = currentTime;
      
      if (!isPaused) {
        callback();
      }
      
      lastTime = currentTime;
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [callback, isPaused]);
}; 