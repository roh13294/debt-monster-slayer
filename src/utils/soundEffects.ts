
// Sound effects utility for the game
// This handles playing various game sounds with appropriate settings

export type SoundType = 
  | 'attack' 
  | 'critical' 
  | 'combo' 
  | 'special' 
  | 'heal' 
  | 'unlock' 
  | 'levelUp' 
  | 'corruption' 
  | 'purchase'
  | 'upgrade'
  | 'menu'
  | 'quest';

export interface SoundOptions {
  volume?: number;
  pitch?: number; // 0.8-1.2 range
  delay?: number;
}

const soundPaths: Record<SoundType, string> = {
  attack: '/sounds/sword-slash.mp3',
  critical: '/sounds/critical-hit.mp3',
  combo: '/sounds/combo-hit.mp3',
  special: '/sounds/special-move.mp3',
  heal: '/sounds/heal.mp3',
  unlock: '/sounds/skill-unlock.mp3',
  levelUp: '/sounds/level-up.mp3',
  corruption: '/sounds/corruption-rise.mp3',
  purchase: '/sounds/purchase.mp3',
  upgrade: '/sounds/temple-upgrade.mp3',
  menu: '/sounds/menu-select.mp3',
  quest: '/sounds/quest-complete.mp3',
};

const defaultOptions: SoundOptions = {
  volume: 0.5,
  pitch: 1.0,
  delay: 0,
};

// PlayBack control - the game will use these flags
let isSoundEnabled = true;
let masterVolume = 1.0;

// Play a sound with options
export const playSound = (type: SoundType, options: SoundOptions = {}): void => {
  if (!isSoundEnabled) return;
  
  const soundPath = soundPaths[type];
  if (!soundPath) {
    console.warn(`Sound '${type}' not found`);
    return;
  }
  
  // Merge with default options
  const soundOptions: SoundOptions = {
    ...defaultOptions,
    ...options,
  };
  
  // Apply delay if specified
  if (soundOptions.delay && soundOptions.delay > 0) {
    setTimeout(() => {
      playAudio(soundPath, soundOptions);
    }, soundOptions.delay);
  } else {
    playAudio(soundPath, soundOptions);
  }
};

// Internal audio player function
const playAudio = (path: string, options: SoundOptions): void => {
  // Create the audio element
  const audio = new Audio(path);
  
  // Apply settings
  audio.volume = (options.volume || defaultOptions.volume!) * masterVolume;
  
  // Apply pitch if supported (not widely supported in browsers)
  if (options.pitch !== 1.0 && 'playbackRate' in audio) {
    audio.playbackRate = options.pitch || defaultOptions.pitch!;
  }
  
  // Play the sound
  audio.play().catch(error => {
    console.error('Error playing audio:', error);
  });
};

// Sound system control functions
export const enableSound = (enable: boolean = true): void => {
  isSoundEnabled = enable;
};

export const setMasterVolume = (volume: number): void => {
  masterVolume = Math.max(0, Math.min(1, volume));
};

// Play sounds in a sequence
export const playSoundSequence = (
  sounds: Array<{type: SoundType, options?: SoundOptions, delay: number}>,
): void => {
  sounds.forEach(({ type, options = {}, delay }) => {
    playSound(type, { ...options, delay });
  });
};

// Play a random sound from options
export const playRandomSound = (
  types: SoundType[],
  options: SoundOptions = {}
): void => {
  if (!types.length) return;
  
  const randomIndex = Math.floor(Math.random() * types.length);
  playSound(types[randomIndex], options);
};
