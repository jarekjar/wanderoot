import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../state/store';
import { gameConfig } from '../config/gameConfig';
import { GameTime, GameDate, incrementTime, incrementDate } from '../utils/calendar';
import { updateTime, updateDate } from '../state/gameSlice';

export function useGameLoop() {
  const dispatch = useDispatch<AppDispatch>();
  const lastUpdateRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Get game state from Redux
  const { time, date } = useSelector((state: RootState) => state.game);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      if (isPaused) {
        animationFrameId = requestAnimationFrame(gameLoop);
        return;
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      // Check if enough real time has passed for a game minute
      if (currentTime - lastUpdateRef.current >= gameConfig.time.realMillisecondsPerGameMinute) {
        lastUpdateRef.current = currentTime;

        // Increment time by 10 minutes
        const { time: newTime, dayIncremented } = incrementTime(time);
        dispatch(updateTime(newTime));

        // If day has incremented, update the date
        if (dayIncremented) {
          const newDate = incrementDate(date);
          dispatch(updateDate(newDate));
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dispatch, isPaused, time, date]);

  return {
    isPaused,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
    togglePause: () => setIsPaused(prev => !prev)
  };
} 