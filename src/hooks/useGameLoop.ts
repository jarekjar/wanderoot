import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { advanceTime } from '../state/gameState';

const TICK_RATE = 60; // 60 FPS
const GAME_MINUTE_PER_REAL_SECOND = 1; // 1 game minute per real second

export const useGameLoop = () => {
  const dispatch = useDispatch();
  const isPaused = useSelector((state: RootState) => state.ui.isPaused);
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      if (!isPaused) {
        // Advance game time
        const gameMinutesToAdvance = (deltaTime / 1000) * GAME_MINUTE_PER_REAL_SECOND;
        dispatch(advanceTime(Math.floor(gameMinutesToAdvance)));

        // Update game state
        // TODO: Add NPC movement, crop growth, etc.
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dispatch, isPaused]);

  return null;
}; 