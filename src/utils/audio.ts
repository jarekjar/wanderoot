let backgroundMusic: HTMLAudioElement | null = null;
let currentTrack: string = '';
let clickAudio: HTMLAudioElement | null = null;

import clickSound from '../assets/audio/fx/button-click-sound-effect.mp3';
import menuMusic from '../assets/audio/morning-garden-acoustic-chill.mp3';
import caveMusic from '../assets/audio/music/cave_ambience.wav';

export const getCurrentTrack = () => currentTrack;

export const playClickSound = (soundEnabled: boolean) => {
  if (!soundEnabled) return;

  // If a click sound is already playing, stop it
  if (clickAudio) {
    clickAudio.pause();
    clickAudio.currentTime = 0;
  }

  // Create or reuse the audio instance
  if (!clickAudio) {
    clickAudio = new Audio(clickSound);
    clickAudio.volume = 0.25;
  }

  const playPromise = clickAudio.play();
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.error('Error playing click sound:', error);
    });
  }
};

export const playBackgroundMusic = (musicVolume: number, soundEnabled: boolean, track: 'menu' | 'cave' | 'forest' | 'town' = 'menu') => {
  const trackPath = {
    menu: menuMusic,
    cave: caveMusic,
    forest: caveMusic, // Using cave ambience for forest for now
    town: menuMusic // Using menu music for town for now
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