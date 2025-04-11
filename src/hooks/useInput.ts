import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setPlayerPosition } from '../state/gameState';

const MOVEMENT_SPEED = 2;

export const useInput = () => {
  const dispatch = useDispatch();
  const isPaused = useSelector((state: RootState) => state.ui.isPaused);
  const playerPosition = useSelector((state: RootState) => state.game.player.position);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isPaused) return;

    const { x, y } = playerPosition;
    let newX = x;
    let newY = y;

    switch (e.key.toLowerCase()) {
      case 'w':
      case 'arrowup':
        newY -= MOVEMENT_SPEED;
        break;
      case 's':
      case 'arrowdown':
        newY += MOVEMENT_SPEED;
        break;
      case 'a':
      case 'arrowleft':
        newX -= MOVEMENT_SPEED;
        break;
      case 'd':
      case 'arrowright':
        newX += MOVEMENT_SPEED;
        break;
    }

    if (newX !== x || newY !== y) {
      dispatch(setPlayerPosition({ x: newX, y: newY }));
    }
  }, [dispatch, isPaused, playerPosition]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}; 