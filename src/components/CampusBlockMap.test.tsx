import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CampusBlockMap from './CampusBlockMap';
import { DayOfWeek, Faculty } from '@/utils/types';

const mockFaculty: Faculty = {
  id: 'F001',
  name: 'Revathi',
  schedule: {
    [DayOfWeek.MONDAY]: { sessions: [] },
    [DayOfWeek.TUESDAY]: { sessions: [] },
    [DayOfWeek.WEDNESDAY]: { sessions: [] },
    [DayOfWeek.THURSDAY]: { sessions: [] },
    [DayOfWeek.FRIDAY]: { sessions: [] },
    [DayOfWeek.SATURDAY]: { sessions: [] },
  },
};

describe('CampusBlockMap', () => {
  it('renders nothing when faculty is null and it is not a holiday', () => {
    const { container } = render(
      <CampusBlockMap faculty={null} currentLocation={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows the Holiday Notice card when isHoliday is true', () => {
    render(
      <CampusBlockMap
        faculty={mockFaculty}
        isHoliday={true}
        holidayReason="Sunday"
      />
    );
    expect(screen.getByText('Holiday Notice')).toBeInTheDocument();
  });

  it('hides the campus map blocks when it is a holiday', () => {
    render(
      <CampusBlockMap
        faculty={mockFaculty}
        isHoliday={true}
        holidayReason="Sunday"
      />
    );
    expect(screen.queryByText('BLOCK 1')).not.toBeInTheDocument();
    expect(screen.queryByText('BLOCK 4')).not.toBeInTheDocument();
  });

  it('displays the holiday reason in the notice', () => {
    render(
      <CampusBlockMap
        faculty={mockFaculty}
        isHoliday={true}
        holidayReason="Independence Day"
      />
    );
    expect(screen.getByText(/Independence Day/i)).toBeInTheDocument();
  });

  it('renders all campus blocks when a faculty is provided and no holiday', () => {
    render(<CampusBlockMap faculty={mockFaculty} currentLocation={null} />);
    expect(screen.getByText('BLOCK 1')).toBeInTheDocument();
    expect(screen.getByText('BLOCK 2')).toBeInTheDocument();
    expect(screen.getByText('BLOCK 3')).toBeInTheDocument();
    expect(screen.getByText('BLOCK 4')).toBeInTheDocument();
    expect(screen.getByText('CAFETERIA')).toBeInTheDocument();
  });

  it('shows "is here" badge when currentLocation is BLOCK 1', () => {
    render(
      <CampusBlockMap
        faculty={mockFaculty}
        currentLocation={{ building: 'BLOCK 1', department: 'CSE', section: 'A' }}
      />
    );
    expect(screen.getByText('Revathi is here')).toBeInTheDocument();
  });

  it('shows "is here" badge when currentLocation is BLOCK 3', () => {
    render(
      <CampusBlockMap
        faculty={mockFaculty}
        currentLocation={{ building: 'BLOCK 3', department: 'ECE', section: 'B' }}
      />
    );
    expect(screen.getByText('Revathi is here')).toBeInTheDocument();
  });

  it('shows "at lunch" badge when currentLocation is CAFETERIA', () => {
    render(
      <CampusBlockMap
        faculty={mockFaculty}
        currentLocation={{ building: 'CAFETERIA', department: 'LUNCH AREA', section: '-' }}
      />
    );
    expect(screen.getByText('Revathi at lunch')).toBeInTheDocument();
  });

  it('shows no location badges when currentLocation is null', () => {
    render(<CampusBlockMap faculty={mockFaculty} currentLocation={null} />);
    expect(screen.queryByText(/is here/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/at lunch/i)).not.toBeInTheDocument();
  });

  it('shows no location badges when currentLocation is undefined', () => {
    render(<CampusBlockMap faculty={mockFaculty} />);
    expect(screen.queryByText(/is here/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/at lunch/i)).not.toBeInTheDocument();
  });

  it('shows holiday notice even when faculty is null if isHoliday is true', () => {
    render(<CampusBlockMap faculty={null} isHoliday={true} holidayReason="Sunday" />);
    expect(screen.getByText('Holiday Notice')).toBeInTheDocument();
  });
});
