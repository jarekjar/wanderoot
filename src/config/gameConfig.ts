export const gameConfig = {
  time: {
    // 10000ms (10 seconds) real time = 1 game minute
    // This means:
    // - 1 game hour = 10 minutes real time
    // - 1 game day = 240 minutes real time
    realMillisecondsPerGameMinute: 10000,
    
    // Game time starts at 10:30 AM
    initialTime: {
      hour: 10,
      minute: 30
    },
    
    // Game date starts at July 4, 1995
    initialDate: {
      year: 1995,
      month: 7,
      day: 4
    }
  }
}; 