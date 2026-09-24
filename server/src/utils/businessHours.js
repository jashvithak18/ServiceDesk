import { addDays, isWeekend, setHours, setMinutes, setSeconds, setMilliseconds } from 'date-fns';

/**
 * Calculates target Date by adding operating minutes strictly within configured business hours.
 * Default business hours: Mon-Fri 09:00 to 18:00 (9 hours / day).
 */
export const addBusinessMinutes = (startDate, minutesToAdd, config = {}) => {
  const startHour = config.startHour ?? 9;   // 09:00 AM
  const startMinute = config.startMin ?? 0;
  const endHour = config.endHour ?? 18;      // 06:00 PM
  const endMinute = config.endMin ?? 0;
  const workDays = config.workDays || [1, 2, 3, 4, 5]; // Mon=1 to Fri=5

  let currDate = new Date(startDate);
  let remainingMins = minutesToAdd;

  // Maximum safety iterations to prevent infinite loop (30 days max)
  let maxLoop = 1000;

  while (remainingMins > 0 && maxLoop > 0) {
    maxLoop--;

    const dayOfWeek = currDate.getDay(); // 0 = Sun, 1 = Mon ... 6 = Sat

    // If non-working day, advance to 09:00 AM next day
    if (!workDays.includes(dayOfWeek)) {
      currDate = addDays(currDate, 1);
      currDate = setHours(setMinutes(setSeconds(setMilliseconds(currDate, 0), 0), startMinute), startHour);
      continue;
    }

    const workStart = setHours(setMinutes(setSeconds(setMilliseconds(new Date(currDate), 0), 0), startMinute), startHour);
    const workEnd = setHours(setMinutes(setSeconds(setMilliseconds(new Date(currDate), 0), 0), endMinute), endHour);

    // If current time is before work hours start, move to work start
    if (currDate < workStart) {
      currDate = new Date(workStart);
    }

    // If current time is past work hours end, advance to 09:00 AM next day
    if (currDate >= workEnd) {
      currDate = addDays(currDate, 1);
      currDate = setHours(setMinutes(setSeconds(setMilliseconds(currDate, 0), 0), startMinute), startHour);
      continue;
    }

    // Calculate remaining operating minutes for current day
    const availableMins = (workEnd.getTime() - currDate.getTime()) / 60000;

    if (remainingMins <= availableMins) {
      currDate = new Date(currDate.getTime() + remainingMins * 60000);
      remainingMins = 0;
    } else {
      remainingMins -= availableMins;
      currDate = addDays(currDate, 1);
      currDate = setHours(setMinutes(setSeconds(setMilliseconds(currDate, 0), 0), startMinute), startHour);
    }
  }

  return currDate;
};
