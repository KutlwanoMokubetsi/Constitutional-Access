// components/admin/__tests__/EditMetadataModal.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditMetadataModal from '../admin/EditMetadataModal';

describe('EditMetadataModal Component', () => {
  const mockFile = {
    name: 'test.pdf',
    category: 'constitution',
    description: 'Test document',
    tags: ['constitution', 'test'],
    path: '/documents'
  };

  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders nothing when no file is provided', () => {
    const { container } = render(
      <EditMetadataModal file={null} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders modal with correct initial values when file is provided', () => {
    render(
      <EditMetadataModal file={mockFile} onClose={mockOnClose} onSave={mockOnSave} />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/edit file metadata/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockFile.name)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockFile.description)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockFile.tags.join(', '))).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockFile.path)).toBeInTheDocument();

    const categorySelect = screen.getByLabelText(/category/i);
    expect(categorySelect).toHaveValue(mockFile.category);
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <EditMetadataModal file={mockFile} onClose={mockOnClose} onSave={mockOnSave} />
    );

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('calls onClose when cancel button is clicked', () => {
    render(
      <EditMetadataModal file={mockFile} onClose={mockOnClose} onSave={mockOnSave} />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('updates form fields when user types', () => {
    render(
      <EditMetadataModal file={mockFile} onClose={mockOnClose} onSave={mockOnSave} />
    );

    const nameInput = screen.getByLabelText(/file name/i);
    fireEvent.change(nameInput, { target: { value: 'new-name.pdf' } });
    expect(nameInput.value).toBe('new-name.pdf');

    const descriptionInput = screen.getByLabelText(/description/i);
    fireEvent.change(descriptionInput, { target: { value: 'New description' } });
    expect(descriptionInput.value).toBe('New description');
  });

  test('calls onSave with correct data when form is submitted', () => {
    render(
      <EditMetadataModal file={mockFile} onClose={mockOnClose} onSave={mockOnSave} />
    );

    // Change some values
    fireEvent.change(screen.getByLabelText(/file name/i), { 
      target: { value: 'updated.pdf' } 
    });
    fireEvent.change(screen.getByLabelText(/tags/i), { 
      target: { value: 'new, tags' } 
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    expect(mockOnSave).toHaveBeenCalledWith({
      ...mockFile,
      name: 'updated.pdf',
      tags: ['new', 'tags']
    });
  });

  test('validates required fields before submission', () => {
    render(
      <EditMetadataModal file={mockFile} onClose={mockOnClose} onSave={mockOnSave} />
    );

    // Clear required fields
    fireEvent.change(screen.getByLabelText(/file name/i), { 
      target: { value: '' } 
    });
    fireEvent.change(screen.getByLabelText(/category/i), { 
      target: { value: '' } 
    });

    // Try to submit
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

    // Should show validation errors and not call onSave
    expect(screen.getByLabelText(/file name/i)).toBeInvalid();
    expect(screen.getByLabelText(/category/i)).toBeInvalid();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test('handles category selection correctly', () => {
    render(
      <EditMetadataModal file={mockFile} onClose={mockOnClose} onSave={mockOnSave} />
    );

    const categorySelect = screen.getByLabelText(/category/i);
    fireEvent.change(categorySelect, { target: { value: 'amendment' } });
    expect(categorySelect.value).toBe('amendment');
  });
});