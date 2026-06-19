import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Index from './Index';
import { DayOfWeek, Faculty } from '@/utils/types';

const mockToast = vi.fn();

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

const mockRevathi: Faculty = {
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

vi.mock('@/utils/facultyData', () => ({
  getAllFacultyNames: () => ['Revathi'],
  findFacultyByName: (name: string) =>
    name.toLowerCase() === 'revathi' ? mockRevathi : undefined,
  getFacultyLocationMessage: () => ({
    message: 'Outside of college hours. Faculty is likely not on campus.',
    isHoliday: false,
  }),
  findCurrentFacultyLocation: () => null,
  getCurrentDayName: () => DayOfWeek.MONDAY,
  getCurrentTimeSlot: () => null,
  isHoliday: () => ({ isHoliday: false, reason: '' }),
}));

describe('Index page', () => {
  beforeEach(() => {
    mockToast.mockClear();
  });

  it('renders the main heading', () => {
    render(<Index />);
    expect(screen.getByText('Campus Faculty Locator Pro')).toBeInTheDocument();
  });

  it('shows the welcome card when no faculty is selected', () => {
    render(<Index />);
    expect(screen.getByText(/Welcome to Faculty Locator/i)).toBeInTheDocument();
  });

  it('renders the quick-search buttons for all faculty', () => {
    render(<Index />);
    expect(screen.getByRole('button', { name: /Revathi/i })).toBeInTheDocument();
  });

  it('shows the schedule section after searching for an existing faculty', async () => {
    render(<Index />);
    await userEvent.type(
      screen.getByPlaceholderText('Search by faculty name or ID...'),
      'Revathi'
    );
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
    expect(screen.getByText("Revathi's Schedule")).toBeInTheDocument();
  });

  it('hides the welcome card after a successful faculty search', async () => {
    render(<Index />);
    await userEvent.type(
      screen.getByPlaceholderText('Search by faculty name or ID...'),
      'Revathi'
    );
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
    expect(screen.queryByText(/Welcome to Faculty Locator/i)).not.toBeInTheDocument();
  });

  it('shows an error toast and no schedule section for an unknown faculty name', async () => {
    render(<Index />);
    await userEvent.type(
      screen.getByPlaceholderText('Search by faculty name or ID...'),
      'GhostPerson'
    );
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    );
    // Welcome card should still be visible (no faculty selected)
    expect(screen.getByText(/Welcome to Faculty Locator/i)).toBeInTheDocument();
    expect(screen.queryByText("GhostPerson's Schedule")).not.toBeInTheDocument();
  });

  it('loads faculty when a quick-search button is clicked', async () => {
    render(<Index />);
    await userEvent.click(screen.getByRole('button', { name: /Revathi/i }));
    expect(screen.getByText("Revathi's Schedule")).toBeInTheDocument();
  });

  it('shows a success toast after a successful faculty search', async () => {
    render(<Index />);
    await userEvent.type(
      screen.getByPlaceholderText('Search by faculty name or ID...'),
      'Revathi'
    );
    await userEvent.click(screen.getByRole('button', { name: /^search$/i }));
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Faculty found' })
    );
  });

  it('renders the Add New Faculty Member section', () => {
    render(<Index />);
    expect(screen.getByText('Add New Faculty Member')).toBeInTheDocument();
  });
});
