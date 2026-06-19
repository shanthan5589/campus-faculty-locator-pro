import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  isHoliday,
  getCurrentDayName,
  getCurrentTimeSlot,
  findFacultyByName,
  addFacultyMember,
  getAllFacultyNames,
  getFacultyLocationMessage,
} from './facultyData';
import { DayOfWeek, Faculty } from './types';

// ---------------------------------------------------------------------------
// Helper: build a deterministic Faculty for time-based tests
// ---------------------------------------------------------------------------
const makeTestFaculty = (): Faculty => ({
  id: 'T001',
  name: 'TestFaculty',
  schedule: {
    [DayOfWeek.MONDAY]: {
      sessions: [
        {
          room: { building: 'BLOCK 1', department: 'CSE', section: 'A' },
          timeSlot: { startTime: '09:00', endTime: '09:55' },
          isLunch: false,
        },
        {
          room: { building: 'CAFETERIA', department: 'LUNCH AREA', section: '-' },
          timeSlot: { startTime: '11:30', endTime: '12:10' },
          isLunch: true,
        },
        {
          room: { building: 'BLOCK 2', department: 'AIML', section: 'B' },
          timeSlot: { startTime: '12:10', endTime: '13:05' },
          isLunch: false,
        },
      ],
    },
    [DayOfWeek.TUESDAY]: { sessions: [] },
    [DayOfWeek.WEDNESDAY]: { sessions: [] },
    [DayOfWeek.THURSDAY]: { sessions: [] },
    [DayOfWeek.FRIDAY]: { sessions: [] },
    [DayOfWeek.SATURDAY]: { sessions: [] },
  },
});

// ---------------------------------------------------------------------------
// isHoliday
// ---------------------------------------------------------------------------
describe('isHoliday', () => {
  it('returns holiday=true for Sunday', () => {
    const sun = new Date(2025, 5, 22); // June 22 2025 is a Sunday
    expect(isHoliday(sun)).toEqual({ isHoliday: true, reason: 'Sunday' });
  });

  it.each([
    [1, 1, "New Year's Day"],
    [26, 1, 'Republic Day'],
    [15, 8, 'Independence Day'],
    [2, 10, 'Gandhi Jayanti'],
    [25, 12, 'Christmas'],
  ])('day %i month %i is %s', (day, month, desc) => {
    // Use 2025; verify these dates are not Sundays by checking individually
    const date = new Date(2025, month - 1, day);
    // If the date happens to be a Sunday, it would return 'Sunday' reason — that's fine, still a holiday
    const result = isHoliday(date);
    expect(result.isHoliday).toBe(true);
    // reason is either the holiday name or 'Sunday' if it falls on one
    expect([desc, 'Sunday']).toContain(result.reason);
  });

  it('returns false for a regular Monday', () => {
    const mon = new Date(2025, 5, 23); // June 23 2025 is a Monday
    expect(isHoliday(mon)).toEqual({ isHoliday: false, reason: '' });
  });

  it('returns false for Dec 31', () => {
    const dec31 = new Date(2025, 11, 31);
    expect(isHoliday(dec31).isHoliday).toBe(false);
  });

  it('returns false for Feb 29 on a leap year', () => {
    const feb29 = new Date(2024, 1, 29); // 2024 is a leap year; Feb 29 2024 is a Thursday
    expect(isHoliday(feb29)).toEqual({ isHoliday: false, reason: '' });
  });

  it('returns an object with isHoliday property when called with no argument', () => {
    const result = isHoliday();
    expect(result).toHaveProperty('isHoliday');
    expect(result).toHaveProperty('reason');
  });
});

// ---------------------------------------------------------------------------
// getCurrentDayName
// ---------------------------------------------------------------------------
describe('getCurrentDayName', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it.each([
    [new Date(2025, 5, 23), DayOfWeek.MONDAY],   // Mon
    [new Date(2025, 5, 24), DayOfWeek.TUESDAY],   // Tue
    [new Date(2025, 5, 25), DayOfWeek.WEDNESDAY], // Wed
    [new Date(2025, 5, 26), DayOfWeek.THURSDAY],  // Thu
    [new Date(2025, 5, 27), DayOfWeek.FRIDAY],    // Fri
    [new Date(2025, 5, 28), DayOfWeek.SATURDAY],  // Sat
  ])('%s → %s', (date, expected) => {
    vi.setSystemTime(date);
    expect(getCurrentDayName()).toBe(expected);
  });

  it('maps Sunday to SATURDAY (the documented edge case)', () => {
    vi.setSystemTime(new Date(2025, 5, 29)); // Sunday
    expect(getCurrentDayName()).toBe(DayOfWeek.SATURDAY);
  });
});

// ---------------------------------------------------------------------------
// getCurrentTimeSlot
// ---------------------------------------------------------------------------
describe('getCurrentTimeSlot', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns null before 09:00', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 8, 59));
    expect(getCurrentTimeSlot()).toBeNull();
  });

  it('returns the first slot at exactly 09:00', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 9, 0));
    const slot = getCurrentTimeSlot();
    expect(slot?.startTime).toBe('09:00');
    expect(slot?.endTime).toBe('09:55');
  });

  it('returns the second slot at exactly 09:55', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 9, 55));
    const slot = getCurrentTimeSlot();
    expect(slot?.startTime).toBe('09:55');
    expect(slot?.endTime).toBe('10:50');
  });

  it('returns the third morning slot at 10:50', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 10, 50));
    const slot = getCurrentTimeSlot();
    expect(slot?.startTime).toBe('10:50');
    expect(slot?.endTime).toBe('11:45');
  });

  it('returns the lunch slot during 11:45', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 11, 45));
    const slot = getCurrentTimeSlot();
    expect(slot?.startTime).toBe('11:30');
    expect(slot?.endTime).toBe('12:10');
  });

  it('returns the last slot at 15:00', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 15, 0));
    const slot = getCurrentTimeSlot();
    expect(slot?.startTime).toBe('14:55');
    expect(slot?.endTime).toBe('15:30');
  });

  it('returns null after 15:30', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 15, 31));
    expect(getCurrentTimeSlot()).toBeNull();
  });

  it('returns null at exactly 15:30 (end of last slot is exclusive)', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 15, 30));
    expect(getCurrentTimeSlot()).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// findFacultyByName
// ---------------------------------------------------------------------------
describe('findFacultyByName', () => {
  it('finds a faculty by exact name', () => {
    expect(findFacultyByName('Revathi')?.name).toBe('Revathi');
  });

  it('is case-insensitive on name (lowercase)', () => {
    expect(findFacultyByName('revathi')?.name).toBe('Revathi');
  });

  it('is case-insensitive on name (uppercase)', () => {
    expect(findFacultyByName('REVATHI')?.name).toBe('Revathi');
  });

  it('finds a faculty by exact ID', () => {
    expect(findFacultyByName('F001')?.id).toBe('F001');
  });

  it('is case-insensitive on ID', () => {
    expect(findFacultyByName('f001')?.id).toBe('F001');
  });

  it('returns undefined for a non-existent name', () => {
    expect(findFacultyByName('NoSuchPerson')).toBeUndefined();
  });

  it('returns undefined for an empty string', () => {
    expect(findFacultyByName('')).toBeUndefined();
  });

  it('returns undefined for a whitespace-only string', () => {
    expect(findFacultyByName('   ')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// addFacultyMember
// ---------------------------------------------------------------------------
describe('addFacultyMember', () => {
  it('returns a Faculty object with the given name', () => {
    const faculty = addFacultyMember('UniqueTestName_ABC');
    expect(faculty.name).toBe('UniqueTestName_ABC');
  });

  it('assigns an ID in F### format', () => {
    const faculty = addFacultyMember('UniqueTestName_DEF');
    expect(faculty.id).toMatch(/^F\d{3}$/);
  });

  it('schedule contains all six days of the week', () => {
    const faculty = addFacultyMember('UniqueTestName_GHI');
    const days = Object.values(DayOfWeek);
    days.forEach(day => {
      expect(faculty.schedule[day]).toBeDefined();
      expect(Array.isArray(faculty.schedule[day].sessions)).toBe(true);
    });
  });

  it('appears in getAllFacultyNames() after being added', () => {
    addFacultyMember('UniqueTestName_JKL');
    expect(getAllFacultyNames()).toContain('UniqueTestName_JKL');
  });
});

// ---------------------------------------------------------------------------
// getAllFacultyNames
// ---------------------------------------------------------------------------
describe('getAllFacultyNames', () => {
  it('returns an array of strings', () => {
    const names = getAllFacultyNames();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(0);
    names.forEach(n => expect(typeof n).toBe('string'));
  });

  it('includes the pre-seeded faculty members', () => {
    const names = getAllFacultyNames();
    expect(names).toContain('Revathi');
    expect(names).toContain('Rajini');
  });
});

// ---------------------------------------------------------------------------
// getFacultyLocationMessage
// ---------------------------------------------------------------------------
describe('getFacultyLocationMessage', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns holiday message on Sunday', () => {
    vi.setSystemTime(new Date(2025, 5, 29)); // Sunday June 29 2025
    const result = getFacultyLocationMessage(makeTestFaculty());
    expect(result.isHoliday).toBe(true);
    expect(result.message).toMatch(/holiday/i);
  });

  it('returns holiday message on New Year\'s Day (Jan 1 2025 is a Wednesday)', () => {
    vi.setSystemTime(new Date(2025, 0, 1));
    const result = getFacultyLocationMessage(makeTestFaculty());
    expect(result.isHoliday).toBe(true);
    expect(result.holidayReason).toBe("New Year's Day");
  });

  it('returns outside-hours message before school starts', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 8, 0)); // Monday 8:00 AM
    const result = getFacultyLocationMessage(makeTestFaculty());
    expect(result.message).toContain('Outside of college hours');
    expect(result.isHoliday).toBeUndefined();
  });

  it('returns outside-hours message after school ends', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 16, 0)); // Monday 4:00 PM
    const result = getFacultyLocationMessage(makeTestFaculty());
    expect(result.message).toContain('Outside of college hours');
  });

  it('returns in-class message when faculty is teaching', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 9, 30)); // Monday 9:30 AM — in 09:00-09:55 slot
    const result = getFacultyLocationMessage(makeTestFaculty());
    expect(result.message).toContain('Currently teaching');
    expect(result.message).toContain('BLOCK 1');
    expect(result.location?.room.building).toBe('BLOCK 1');
  });

  it('returns lunch message during lunch slot', () => {
    vi.setSystemTime(new Date(2025, 5, 23, 11, 45)); // Monday 11:45 AM
    const result = getFacultyLocationMessage(makeTestFaculty());
    expect(result.message).toContain('lunch');
    expect(result.location?.isLunch).toBe(true);
  });

  it('returns free-period message with next class info during a gap', () => {
    // Monday 10:00 is in slot 09:55–10:50, which has no session in our test faculty
    vi.setSystemTime(new Date(2025, 5, 23, 10, 0));
    const result = getFacultyLocationMessage(makeTestFaculty());
    expect(result.message).toContain('Free period');
    expect(result.message).toContain('11:30'); // next session is lunch
  });

  it('returns no-more-classes message after last session', () => {
    // Monday 14:00 is in slot 14:00–14:55; our test faculty's last session ends at 13:05
    vi.setSystemTime(new Date(2025, 5, 23, 14, 0));
    const result = getFacultyLocationMessage(makeTestFaculty());
    expect(result.message).toContain('No more classes');
  });

  it('returns no-more-classes on a day with no sessions at all', () => {
    vi.setSystemTime(new Date(2025, 5, 24, 10, 0)); // Tuesday — empty schedule
    const result = getFacultyLocationMessage(makeTestFaculty());
    expect(result.message).toContain('No more classes');
  });
});
