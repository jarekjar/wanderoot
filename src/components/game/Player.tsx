import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/store';
import { setPlayerPosition, setPlayerDirection, setIsMoving } from '../../state/gameSlice';
import KnightSprite from '../../assets/sprites/character1.svg';
import RangerSprite from '../../assets/sprites/character2.svg';
import MageSprite from '../../assets/sprites/character3.svg';

const CHARACTER_SPRITES = {
  1: KnightSprite,
  2: RangerSprite,
  3: MageSprite
} as const;

const MOVEMENT_SPEED = 3;

export function Player() {
  const dispatch = useDispatch();
  const { playerPosition, playerDirection, isMoving, isPaused, playerSprite } = useSelector((state: RootState) => state.game);
  const currentSprite = CHARACTER_SPRITES[playerSprite as keyof typeof CHARACTER_SPRITES] || CHARACTER_SPRITES[1];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isPaused) return;

    let newDirection: 'up' | 'down' | 'left' | 'right' | null = null;
    let newPosition = { ...playerPosition };

    switch (e.key.toLowerCase()) {
      case 'w':
        newDirection = 'up';
        newPosition.y -= MOVEMENT_SPEED;
        break;
      case 's':
        newDirection = 'down';
        newPosition.y += MOVEMENT_SPEED;
        break;
      case 'a':
        newDirection = 'left';
        newPosition.x -= MOVEMENT_SPEED;
        break;
      case 'd':
        newDirection = 'right';
        newPosition.x += MOVEMENT_SPEED;
        break;
    }

    if (newDirection) {
      dispatch(setPlayerDirection(newDirection));
      dispatch(setIsMoving(true));
      dispatch(setPlayerPosition(newPosition));
    }
  }, [dispatch, playerPosition, isPaused]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (['w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
      dispatch(setIsMoving(false));
    }
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div 
      className="absolute transition-transform duration-100"
      style={{ 
        left: playerPosition.x,
        top: playerPosition.y,
        transform: `translate(-50%, -50%) scaleX(${playerDirection === 'left' ? -1 : 1})`,
      }}
    >
      <div className={`relative ${isMoving ? 'animate-bounce' : ''}`}>
        {/* Character Sprite */}
        <img 
          src={currentSprite} 
          alt="Player character"
          className="w-16 h-16 object-contain"
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
          }}
        />
        
        {/* Shadow */}
        <div 
          className="absolute -bottom-2 left-1/2 w-12 h-3 bg-black/20 rounded-full blur-sm -translate-x-1/2"
        />
      </div>
    </div>
  );
} 