import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DailySchedule from './DailySchedule';
import { DayOfWeek, Faculty, ClassSession } from '@/utils/types';

vi.mock('@/utils/facultyData', () => ({
  findCurrentFacultyLocation: () => null,
}));

const makeSession = (
  start: string,
  end: string,
  isLunch = false,
  department = 'CSE'
): ClassSession => ({
  room: {
    building: isLunch ? 'CAFETERIA' : 'BLOCK 1',
    department: isLunch ? 'LUNCH AREA' : department,
    section: isLunch ? '-' : 'A',
  },
  timeSlot: { startTime: start, endTime: end },
  isLunch,
});

const makeFaculty = (sessions: ClassSession[]): Faculty => ({
  id: 'T001',
  name: 'Test',
  schedule: {
    [DayOfWeek.MONDAY]: { sessions },
    [DayOfWeek.TUESDAY]: { sessions: [] },
    [DayOfWeek.WEDNESDAY]: { sessions: [] },
    [DayOfWeek.THURSDAY]: { sessions: [] },
    [DayOfWeek.FRIDAY]: { sessions: [] },
    [DayOfWeek.SATURDAY]: { sessions: [] },
  },
});

describe('DailySchedule', () => {
  it('shows the "no sessions" message when sessions list is empty', () => {
    render(<DailySchedule faculty={makeFaculty([])} day={DayOfWeek.MONDAY} />);
    expect(
      screen.getByText('No scheduled sessions for this day.')
    ).toBeInTheDocument();
  });

  it('renders a session when one is present', () => {
    render(
      <DailySchedule
        faculty={makeFaculty([makeSession('09:00', '09:55')])}
        day={DayOfWeek.MONDAY}
      />
    );
    expect(screen.queryByText('No scheduled sessions for this day.')).not.toBeInTheDocument();
  });

  it('sorts sessions by start time (earliest first)', () => {
    const sessions = [
      makeSession('13:05', '14:00'),
      makeSession('09:00', '09:55'),
    ];
    render(<DailySchedule faculty={makeFaculty(sessions)} day={DayOfWeek.MONDAY} />);
    const timeElements = screen.getAllByText(/AM|PM/);
    // First visible time should be 9:00 AM
    expect(timeElements[0].textContent).toContain('9:00 AM');
  });

  it('formats 09:00 as "9:00 AM"', () => {
    render(
      <DailySchedule
        faculty={makeFaculty([makeSession('09:00', '09:55')])}
        day={DayOfWeek.MONDAY}
      />
    );
    expect(screen.getByText(/9:00 AM/)).toBeInTheDocument();
  });

  it('formats 13:05 as "1:05 PM"', () => {
    render(
      <DailySchedule
        faculty={makeFaculty([makeSession('13:05', '14:00')])}
        day={DayOfWeek.MONDAY}
      />
    );
    expect(screen.getByText(/1:05 PM/)).toBeInTheDocument();
  });

  it('formats 12:00 as "12:00 PM" (noon stays 12, not 0)', () => {
    render(
      <DailySchedule
        faculty={makeFaculty([makeSession('12:00', '12:55')])}
        day={DayOfWeek.MONDAY}
      />
    );
    expect(screen.getByText(/12:00 PM/)).toBeInTheDocument();
  });

  it('formats 12:10 as "12:10 PM"', () => {
    render(
      <DailySchedule
        faculty={makeFaculty([makeSession('12:10', '13:05')])}
        day={DayOfWeek.MONDAY}
      />
    );
    expect(screen.getByText(/12:10 PM/)).toBeInTheDocument();
  });

  it('shows "Lunch" badge for a lunch session', () => {
    render(
      <DailySchedule
        faculty={makeFaculty([makeSession('11:30', '12:10', true)])}
        day={DayOfWeek.MONDAY}
      />
    );
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });

  it('shows "LAB" badge for a LAB department session', () => {
    render(
      <DailySchedule
        faculty={makeFaculty([makeSession('09:00', '09:55', false, 'LAB')])}
        day={DayOfWeek.MONDAY}
      />
    );
    expect(screen.getByText('LAB')).toBeInTheDocument();
  });

  it('shows "SRP" badge for an SRP department session', () => {
    render(
      <DailySchedule
        faculty={makeFaculty([makeSession('09:00', '09:55', false, 'SRP')])}
        day={DayOfWeek.MONDAY}
      />
    );
    expect(screen.getByText('SRP')).toBeInTheDocument();
  });

  it('shows "Class" badge for a regular session', () => {
    render(
      <DailySchedule
        faculty={makeFaculty([makeSession('09:00', '09:55', false, 'CSE')])}
        day={DayOfWeek.MONDAY}
      />
    );
    expect(screen.getByText('Class')).toBeInTheDocument();
  });

  it('shows "Cafeteria - Lunch Break" for lunch location', () => {
    render(
      <DailySchedule
        faculty={makeFaculty([makeSession('11:30', '12:10', true)])}
        day={DayOfWeek.MONDAY}
      />
    );
    expect(screen.getByText('Cafeteria - Lunch Break')).toBeInTheDocument();
  });

  it('renders sessions for the correct day', () => {
    const faculty: Faculty = {
      id: 'T001',
      name: 'Test',
      schedule: {
        [DayOfWeek.MONDAY]: { sessions: [makeSession('09:00', '09:55')] },
        [DayOfWeek.TUESDAY]: { sessions: [] },
        [DayOfWeek.WEDNESDAY]: { sessions: [] },
        [DayOfWeek.THURSDAY]: { sessions: [] },
        [DayOfWeek.FRIDAY]: { sessions: [] },
        [DayOfWeek.SATURDAY]: { sessions: [] },
      },
    };
    // Tuesday has no sessions
    render(<DailySchedule faculty={faculty} day={DayOfWeek.TUESDAY} />);
    expect(screen.getByText('No scheduled sessions for this day.')).toBeInTheDocument();
  });
});
