export const playClickSound = (soundEnabled: boolean) => {
  if (soundEnabled) {
    const audio = new Audio('/assets/audio/fx/button-click-sound-effect.mp3');
    audio.volume = 0.25;
    audio.play();
  }
}; 