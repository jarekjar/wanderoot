let backgroundMusic: HTMLAudioElement | null = null;

export const playClickSound = (soundEnabled: boolean) => {
  if (soundEnabled) {
    const audio = new Audio('/assets/audio/fx/button-click-sound-effect.mp3');
    audio.volume = 0.25;
    audio.play().catch(error => {
      console.error('Error playing click sound:', error);
    });
  }
};

export const playBackgroundMusic = (musicVolume: number, soundEnabled: boolean) => {
  if (!backgroundMusic) {
    backgroundMusic = new Audio('/assets/audio/morning-garden-acoustic-chill.mp3');
    backgroundMusic.loop = true;
  }
  
  if (!soundEnabled) {
    backgroundMusic.pause();
    return;
  }
  
  if (backgroundMusic.paused) {
    backgroundMusic.volume = musicVolume;
    const playPromise = backgroundMusic.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error playing background music:', error);
      });
    }
  } else {
    backgroundMusic.volume = musicVolume;
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
  }
}; 