import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPlayerName, setPlayerSprite } from '../state/gameState';
import { setActiveMenu } from '../state/uiState';

// Temporary sprite options - these would be replaced with actual sprite assets
const SPRITE_OPTIONS = [
  { id: 1, name: 'Farmer 1', color: '#8B4513' },
  { id: 2, name: 'Farmer 2', color: '#4682B4' },
  { id: 3, name: 'Farmer 3', color: '#556B2F' },
];

export const CharacterCreator = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [selectedSprite, setSelectedSprite] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(setPlayerName(name.trim()));
      dispatch(setPlayerSprite(selectedSprite));
      dispatch(setActiveMenu('none'));
    }
  };

  const handleCancel = () => {
    dispatch(setActiveMenu('saveSlot'));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div className="pixel-menu p-8 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6 font-pixel">Create Your Character</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-white mb-2 font-pixel">
              Character Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pixel-input w-full"
              placeholder="Enter your name"
              maxLength={20}
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2 font-pixel">
              Choose Your Appearance
            </label>
            <div className="grid grid-cols-3 gap-4">
              {SPRITE_OPTIONS.map((sprite) => (
                <button
                  key={sprite.id}
                  type="button"
                  onClick={() => setSelectedSprite(sprite.id)}
                  className={`pixel-button p-4 ${
                    selectedSprite === sprite.id
                      ? 'bg-blue-500'
                      : ''
                  }`}
                >
                  <div
                    className="w-16 h-16 mx-auto rounded-full pixel-bounce"
                    style={{ backgroundColor: sprite.color }}
                  />
                  <span className="text-white text-sm mt-2 block font-pixel">{sprite.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="pixel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pixel-button"
              disabled={!name.trim()}
            >
              Create Character
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 