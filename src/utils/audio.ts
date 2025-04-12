let backgroundMusic: HTMLAudioElement | null = null;
let currentTrack: string = '';

export const playClickSound = (soundEnabled: boolean) => {
  if (soundEnabled) {
    const audio = new Audio('/assets/audio/fx/button-click-sound-effect.mp3');
    audio.volume = 0.25;
    audio.play().catch(error => {
      console.error('Error playing click sound:', error);
    });
  }
};

export const playBackgroundMusic = (musicVolume: number, soundEnabled: boolean, track: 'menu' | 'cave' | 'forest' | 'town' = 'menu') => {
  const trackPath = {
    menu: '/assets/audio/morning-garden-acoustic-chill.mp3',
    cave: '/assets/audio/music/cave_ambience.wav',
    forest: '/assets/audio/music/cave_ambience.wav', // Using cave ambience for forest for now
    town: '/assets/audio/morning-garden-acoustic-chill.mp3' // Using menu music for town for now
  };

  // First, ensure any existing music is stopped
  stopBackgroundMusic();

  // If sound is disabled, don't start new track
  if (!soundEnabled) {
    return;
  }

  // Start new track
  currentTrack = track;
  backgroundMusic = new Audio(trackPath[track]);
  backgroundMusic.loop = true;
  backgroundMusic.volume = musicVolume;
  
  const playPromise = backgroundMusic.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.error('Error playing background music:', error);
    });
  }
};

export const updateMusicVolume = (volume: number) => {
  if (backgroundMusic) {
    backgroundMusic.volume = volume;
  }
};

export const stopBackgroundMusic = () => {
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    backgroundMusic = null;
    currentTrack = '';
  }
}; 