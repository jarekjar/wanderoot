import { GameTime, GameDate } from '../state/gameSlice';

export function advanceTime(currentTime: GameTime, currentDate: GameDate, minutesToAdd: number): { time: GameTime; date: GameDate } {
  let totalMinutes = currentTime.minute + minutesToAdd;
  let hours = currentTime.hour + Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;
  
  let year = currentDate.year;
  let month = currentDate.month;
  let day = currentDate.day;

  // Handle hour overflow
  if (hours >= 24) {
    day += Math.floor(hours / 24);
    hours = hours % 24;
  }

  // Handle month transitions
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day > daysInMonth) {
    month += 1;
    day = 1;
  }

  // Handle year transitions
  if (month > 12) {
    year += 1;
    month = 1;
  }

  return {
    time: { hour: hours, minute: minutes },
    date: { year, month, day }
  };
} 