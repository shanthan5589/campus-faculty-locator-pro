import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddFacultyForm from './AddFacultyForm';

const mockToast = vi.fn();
const mockAddFacultyMember = vi.fn(() => ({
  id: 'F008',
  name: 'New Faculty',
  schedule: {},
}));

vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

vi.mock('@/utils/facultyData', () => ({
  addFacultyMember: (...args: unknown[]) => mockAddFacultyMember(...args),
  addFacultyWithCustomSchedule: vi.fn(),
  getAllFacultyNames: () => [],
}));

describe('AddFacultyForm', () => {
  beforeEach(() => {
    mockToast.mockClear();
    mockAddFacultyMember.mockClear();
  });

  it('renders the Auto-Generate tab by default', () => {
    render(<AddFacultyForm onFacultyAdded={vi.fn()} />);
    expect(screen.getByRole('tab', { name: /auto-generate schedule/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /create custom schedule/i })).toBeInTheDocument();
  });

  it('shows the auto-generate info panel by default', () => {
    render(<AddFacultyForm onFacultyAdded={vi.fn()} />);
    expect(screen.getByText('Auto-Generate Feature')).toBeInTheDocument();
  });

  it('shows the faculty name input field', () => {
    render(<AddFacultyForm onFacultyAdded={vi.fn()} />);
    expect(screen.getByPlaceholderText('Enter new faculty name')).toBeInTheDocument();
  });

  it('shows destructive toast and does NOT call onFacultyAdded when name is empty', async () => {
    const onFacultyAdded = vi.fn();
    render(<AddFacultyForm onFacultyAdded={onFacultyAdded} />);
    await userEvent.click(
      screen.getByRole('button', { name: /add faculty with generated schedule/i })
    );
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    );
    expect(onFacultyAdded).not.toHaveBeenCalled();
  });

  it('shows destructive toast when name is whitespace only', async () => {
    const onFacultyAdded = vi.fn();
    render(<AddFacultyForm onFacultyAdded={onFacultyAdded} />);
    await userEvent.type(screen.getByPlaceholderText('Enter new faculty name'), '   ');
    await userEvent.click(
      screen.getByRole('button', { name: /add faculty with generated schedule/i })
    );
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ variant: 'destructive' })
    );
    expect(onFacultyAdded).not.toHaveBeenCalled();
  });

  it('calls addFacultyMember and onFacultyAdded when a valid name is submitted', async () => {
    const onFacultyAdded = vi.fn();
    render(<AddFacultyForm onFacultyAdded={onFacultyAdded} />);
    await userEvent.type(
      screen.getByPlaceholderText('Enter new faculty name'),
      'Dr. Smith'
    );
    await userEvent.click(
      screen.getByRole('button', { name: /add faculty with generated schedule/i })
    );
    expect(mockAddFacultyMember).toHaveBeenCalledWith('Dr. Smith');
    expect(onFacultyAdded).toHaveBeenCalledWith('New Faculty');
  });

  it('shows success toast after valid submission', async () => {
    render(<AddFacultyForm onFacultyAdded={vi.fn()} />);
    await userEvent.type(
      screen.getByPlaceholderText('Enter new faculty name'),
      'Dr. Jones'
    );
    await userEvent.click(
      screen.getByRole('button', { name: /add faculty with generated schedule/i })
    );
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Faculty added successfully' })
    );
  });

  it('switches to manual tab and shows ScheduleBuilder heading', async () => {
    render(<AddFacultyForm onFacultyAdded={vi.fn()} />);
    await userEvent.click(screen.getByRole('tab', { name: /create custom schedule/i }));
    expect(screen.getByText('Create Custom Faculty Schedule')).toBeInTheDocument();
  });
});
