import { GameState } from '../state/gameSlice';

export interface SaveData {
  name: string;
  date: string;
  gameState: GameState;
}

export function formatSaveDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function getSaveSlotKey(slot: number): string {
  return `save_slot_${slot}`;
}

export function saveGame(slot: number, gameState: GameState): void {
  const saveData: SaveData = {
    name: `Save ${slot}`,
    date: formatSaveDate(new Date()),
    gameState
  };
  localStorage.setItem(getSaveSlotKey(slot), JSON.stringify(saveData));
}

export function loadGame(slot: number): GameState | null {
  const saveData = localStorage.getItem(getSaveSlotKey(slot));
  if (!saveData) return null;
  
  try {
    const parsed = JSON.parse(saveData) as SaveData;
    return parsed.gameState;
  } catch (error) {
    console.error('Failed to load save:', error);
    return null;
  }
}

export function getSaveInfo(slot: number): { name: string; date: string; gameState: GameState } | null {
  const saveData = localStorage.getItem(getSaveSlotKey(slot));
  if (!saveData) return null;
  
  try {
    return JSON.parse(saveData) as SaveData;
  } catch (error) {
    console.error('Failed to get save info:', error);
    return null;
  }
}

export function formatGameTime(time: { hour: number; minute: number }): string {
  const period = time.hour >= 12 ? 'PM' : 'AM';
  const displayHour = time.hour % 12 || 12;
  const displayMinute = time.minute.toString().padStart(2, '0');
  return `${displayHour}:${displayMinute} ${period}`;
}

export function formatGameDate(date: { year: number; month: number; day: number }): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return `${months[date.month - 1]} ${date.day}, ${date.year}`;
} 