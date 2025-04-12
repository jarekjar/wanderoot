import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPlayerName, setPlayerSprite, setPlayerClass, setPlayerPet } from '../state/gameState';
import { RootState } from '../state/store';
import { useTheme } from '../theme/ThemeContext';
import { playClickSound } from '../utils/audio';
import '../styles/background.css';
import '../styles/menu.css';

const CHARACTER_SPRITES = [
  { id: 1, sprite: '/assets/sprites/knight.png' },
  { id: 2, sprite: '/assets/sprites/ranger.png' },
  { id: 3, sprite: '/assets/sprites/mage.png' },
  { id: 4, sprite: '/assets/sprites/cleric.png' }
] as const;

const CHARACTER_CLASSES = [
  { name: 'Fighter', description: 'Strong warrior skilled in combat. Bonus monster damage!' },
  { name: 'Farmer', description: 'Expert in crops and animals. Better harvests!' },
  { name: 'Socialite', description: 'Charismatic trader. Better prices and unique dialogues!' }
] as const;
const PET_TYPES = ['cat', 'dog'] as const;

interface CharacterCreatorProps {
  onBack: () => void;
  onCreateCharacter: () => void;
}

export function CharacterCreator({ onBack, onCreateCharacter }: CharacterCreatorProps) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const soundEnabled = useSelector((state: RootState) => state.settings.soundEnabled);
  const { playerName, playerSprite, playerClass, playerPet } = useSelector((state: RootState) => state.game);

  const handleSubmit = () => {
    if (playerName.trim()) {
      playClickSound(soundEnabled);
      onCreateCharacter();
    }
  };

  const handleBack = () => {
    playClickSound(soundEnabled);
    dispatch(setPlayerName(''));
    dispatch(setPlayerSprite(1));
    dispatch(setPlayerClass('Fighter'));
    dispatch(setPlayerPet('cat'));
    onBack();
  };

  const settingRowClass = `
    settings-row-bg
    box-border
    w-full h-[52px]
    rounded-lg
    px-4
    flex items-center justify-between
  `.replace(/\s+/g, ' ').trim();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
      {/* Title */}
      <div className="mb-8 sm:mb-12">
        <h1 
          className="text-4xl sm:text-5xl font-['Press_Start_2P'] text-white entrance-animation"
          style={{
            textShadow: `4px 4px 0px ${theme.primary}, 4px 4px 4px rgba(0, 0, 0, 0.8)`
          }}
        >
          Create Character
        </h1>
      </div>

      {/* Settings Container */}
      <div 
        className="p-4 sm:p-6 rounded-lg border-4 shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] w-full max-w-[800px] menu-slide-up"
        style={{
          borderColor: theme.border,
          background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
        }}
      >
        <div className="flex flex-col gap-4">
          {/* Character Name */}
          <div className={settingRowClass}>
            <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white">
              Name
            </span>
            <input
              type="text"
              value={playerName}
              onChange={(e) => dispatch(setPlayerName(e.target.value))}
              className="bg-white/10 border-2 border-white/20 rounded-lg px-6 py-2 min-w-[300px] text-white focus:outline-none focus:border-white/40 font-['Press_Start_2P'] text-sm text-right"
              style={{
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.2)'
              }}
            />
          </div>

          {/* Character Selection */}
          <div className={settingRowClass}>
            <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white">
              Choose Avatar
            </span>
            <div className="flex gap-4">
              {CHARACTER_SPRITES.map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    playClickSound(soundEnabled);
                    dispatch(setPlayerSprite(char.id));
                  }}
                  className="menu-button-bg p-2 rounded-lg border-2 hover:brightness-110 transition-all"
                  style={{
                    borderColor: playerSprite === char.id ? 'white' : theme.border,
                    background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
                  }}
                >
                  <img src={char.sprite} alt={`Character ${char.id}`} className="w-12 h-12" />
                </button>
              ))}
            </div>
          </div>

          {/* Character Class */}
          <div className={settingRowClass}>
            <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white">
              Class
            </span>
            <div className="flex gap-4">
              {CHARACTER_CLASSES.map((charClass) => (
                <button
                  key={charClass.name}
                  onClick={() => {
                    playClickSound(soundEnabled);
                    dispatch(setPlayerClass(charClass.name));
                  }}
                  title={charClass.description}
                  className="menu-button-bg px-6 py-2 rounded-lg border-2 hover:brightness-110 transition-all relative group"
                  style={{
                    borderColor: playerClass === charClass.name ? 'white' : theme.border,
                    background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
                  }}
                >
                  <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white">
                    {charClass.name}
                  </span>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 max-w-[180px] text-center pointer-events-none z-50">
                    {charClass.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Pet Preference */}
          <div className={settingRowClass}>
            <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white">
              Pet Preference
            </span>
            <div className="flex gap-4">
              {PET_TYPES.map((pet) => (
                <button
                  key={pet}
                  onClick={() => {
                    playClickSound(soundEnabled);
                    dispatch(setPlayerPet(pet));
                  }}
                  className="menu-button-bg px-6 py-2 rounded-lg border-2 hover:brightness-110 transition-all"
                  style={{
                    borderColor: playerPet === pet ? 'white' : theme.border,
                    background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
                  }}
                >
                  <span className="text-xs sm:text-sm font-['Press_Start_2P'] text-white">
                    {pet.charAt(0).toUpperCase() + pet.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handleBack}
              className="menu-button-bg px-6 py-2 rounded-lg border-2 hover:brightness-110 transition-all"
              style={{
                borderColor: theme.border,
                background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
              }}
            >
              <span className="text-sm font-['Press_Start_2P'] text-white">Back</span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={!playerName.trim()}
              className="menu-button-bg px-6 py-2 rounded-lg border-2 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: theme.border,
                background: `linear-gradient(180deg, ${theme.secondary} 0%, ${theme.secondary} 100%)`
              }}
            >
              <span className="text-sm font-['Press_Start_2P'] text-white">Start</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 