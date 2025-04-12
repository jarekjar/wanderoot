export interface GameTime {
  hour: number;   // 0-23
  minute: number; // 0-59
}

export interface GameDate {
  year: number;
  month: number;  // 1-12
  day: number;    // 1-28/29/30/31
}

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const getDaysInMonth = (year: number, month: number): number => {
  const daysInMonth = [
    31, // January
    28, // February
    31, // March
    30, // April
    31, // May
    30, // June
    31, // July
    31, // August
    30, // September
    31, // October
    30, // November
    31  // December
  ];

  if (month === 2 && isLeapYear(year)) {
    return 29;
  }

  return daysInMonth[month - 1];
};

export const incrementTime = (time: GameTime): { time: GameTime; dayIncremented: boolean } => {
  let newTime = { ...time };
  let dayIncremented = false;

  newTime.minute += 10;
  
  if (newTime.minute >= 60) {
    newTime.minute = 0;
    newTime.hour += 1;
    
    if (newTime.hour >= 24) {
      newTime.hour = 0;
      dayIncremented = true;
    }
  }

  return { time: newTime, dayIncremented };
};

export const incrementDate = (date: GameDate): GameDate => {
  let newDate = { ...date };
  
  newDate.day += 1;
  const daysInMonth = getDaysInMonth(newDate.year, newDate.month);
  
  if (newDate.day > daysInMonth) {
    newDate.day = 1;
    newDate.month += 1;
    
    if (newDate.month > 12) {
      newDate.month = 1;
      newDate.year += 1;
    }
  }

  return newDate;
}; 