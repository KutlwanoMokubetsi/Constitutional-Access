// components/admin/__tests__/FileTable.test.js
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import FileTable from '../admin/FileTable';
import { Edit, Trash2, FolderTree } from 'lucide-react';

describe('FileTable Component', () => {
  const mockFiles = [
    {
      id: '1',
      name: 'constitution.pdf',
      type: 'PDF',
      category: 'Legal',
      path: '/documents',
      size: '2.4 MB',
      date: '2023-05-15',
      tags: ['constitution', 'legal']
    },
    {
      id: '2',
      name: 'amendment.docx',
      type: 'Word',
      size: '1.2 MB',
      date: '2023-06-20',
      tags: []
    }
  ];

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders table with correct headers', () => {
    render(<FileTable files={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    expect(screen.getByText(/type/i)).toBeInTheDocument();
    expect(screen.getByText(/category/i)).toBeInTheDocument();
    expect(screen.getByText(/path/i)).toBeInTheDocument();
    expect(screen.getByText(/size/i)).toBeInTheDocument();
    expect(screen.getByText(/upload date/i)).toBeInTheDocument();
    expect(screen.getByText(/actions/i)).toBeInTheDocument();
  });

  test('displays all files with correct data', () => {
    render(<FileTable files={mockFiles} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    // Check first file
    expect(screen.getByText(/constitution.pdf/i)).toBeInTheDocument();
    expect(screen.getByTestId('file-type-1')).toHaveTextContent('PDF');
    expect(screen.getByTestId('file-category-1')).toHaveTextContent('Legal');
    expect(screen.getByTestId('file-path-1')).toHaveTextContent('documents');
    expect(screen.getByTestId('file-size-1')).toHaveTextContent('2.4 MB');
    expect(screen.getByTestId('file-date-1')).toHaveTextContent('2023-05-15');
  
    
    // Check second file
    expect(screen.getByText(/amendment.docx/i)).toBeInTheDocument();
    expect(screen.getByTestId('file-type-2')).toHaveTextContent('Word');
    expect(screen.getByTestId('file-category-2')).toHaveTextContent('-'); // Default category
    expect(screen.getByTestId('file-path-2')).toHaveTextContent('/'); // Default path
    expect(screen.getByTestId('file-size-2')).toHaveTextContent('1.2 MB');
    expect(screen.getByTestId('file-date-2')).toHaveTextContent('2023-06-20');
  });

  test('displays tags when present', () => {
    render(<FileTable files={mockFiles} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    // Get the first file's row
    const rows = screen.getAllByRole('row').slice(1); // Skip header row
    const firstRow = rows[0];
    
    // Check tags within the first file's row
    const constitutionTag = within(firstRow).getByText(/constitution/i, { 
      selector: 'mark' // Only look for text within <mark> elements (tags)
    });
    const legalTag = within(firstRow).getByText(/legal/i, { 
      selector: 'mark' 
    });
    
    expect(constitutionTag).toBeInTheDocument();
    expect(legalTag).toBeInTheDocument();
    
    // Verify second file has no tags
    const secondRow = rows[1];
    expect(within(secondRow).queryByText(/amendment/i, { 
      selector: 'mark' 
    })).not.toBeInTheDocument();
  });

  test('calls onDelete with correct file id when delete button is clicked', () => {
    render(<FileTable files={mockFiles} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const deleteButtons = screen.getAllByLabelText(/delete/i);
    fireEvent.click(deleteButtons[1]); // Click second file's delete button
    
    expect(mockOnDelete).toHaveBeenCalledWith('2');
    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  test('shows folder icon for each file', () => {
    render(<FileTable files={mockFiles} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    const folderIcons = screen.getAllByLabelText(/folder/i); // Lucide icons are SVGs
    expect(folderIcons.length).toBe(mockFiles.length); // Folder icon + action icons per row
  });

  test('handles empty files array', () => {
    render(<FileTable files={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);
    
    // Table headers should still render
    expect(screen.getByText(/name/i)).toBeInTheDocument();
    // No data rows should be present
    expect(screen.queryByRole('row', { name: /constitution/i })).not.toBeInTheDocument();
  });
});