import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

export const useInput = (onInput: (key: string) => void) => {
  const isPaused = useSelector((state: RootState) => state.game.isPaused);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isPaused) {
        onInput(event.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onInput, isPaused]);
}; 