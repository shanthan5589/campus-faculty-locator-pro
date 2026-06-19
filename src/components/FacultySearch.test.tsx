import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FacultySearch from './FacultySearch';

vi.mock('@/utils/facultyData', () => ({
  getAllFacultyNames: () => ['Revathi', 'Shamila', 'Rajini'],
}));

describe('FacultySearch', () => {
  let onSearch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSearch = vi.fn();
  });

  it('renders the search input with correct placeholder', () => {
    render(<FacultySearch onSearch={onSearch} />);
    expect(screen.getByPlaceholderText('Search by faculty name or ID...')).toBeInTheDocument();
  });

  it('renders the Search button', () => {
    render(<FacultySearch onSearch={onSearch} />);
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('does not show predictions for fewer than 2 characters', async () => {
    render(<FacultySearch onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox'), 'R');
    expect(screen.queryByText('Revathi')).not.toBeInTheDocument();
  });

  it('shows matching predictions for 2+ characters', async () => {
    render(<FacultySearch onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox'), 'Re');
    expect(screen.getByText('Revathi')).toBeInTheDocument();
  });

  it('is case-insensitive when filtering predictions', async () => {
    render(<FacultySearch onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox'), 'ra');
    expect(screen.getByText('Rajini')).toBeInTheDocument();
  });

  it('hides predictions when 2+ chars match nothing', async () => {
    render(<FacultySearch onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox'), 'XZ');
    expect(screen.queryByText('Revathi')).not.toBeInTheDocument();
    expect(screen.queryByText('Shamila')).not.toBeInTheDocument();
    expect(screen.queryByText('Rajini')).not.toBeInTheDocument();
  });

  it('calls onSearch with the selected name when a prediction is clicked', async () => {
    render(<FacultySearch onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox'), 'Ra');
    await userEvent.click(screen.getByText('Rajini'));
    expect(onSearch).toHaveBeenCalledWith('Rajini');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch when form is submitted with a valid value', async () => {
    render(<FacultySearch onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox'), 'Revathi');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).toHaveBeenCalledWith('Revathi');
  });

  it('does NOT call onSearch when form is submitted with empty value', async () => {
    render(<FacultySearch onSearch={onSearch} />);
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('does NOT call onSearch when form is submitted with whitespace only', async () => {
    render(<FacultySearch onSearch={onSearch} />);
    await userEvent.type(screen.getByRole('textbox'), '   ');
    await userEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(onSearch).not.toHaveBeenCalled();
  });
});
