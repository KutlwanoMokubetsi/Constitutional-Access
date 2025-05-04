// AdminPage.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import AdminPage from '../pages/AdminPage';

// Mock child components
jest.mock('../components/admin/AdminHeader', () => () => (
  <div data-testid="admin-header">AdminHeader</div>
));

jest.mock('../components/admin/FileUpload', () => ({ onFileSelect }) => (
  <div data-testid="file-upload">
    <button onClick={() => onFileSelect({ name: 'test.pdf' })}>Upload</button>
  </div>
));

jest.mock('../components/admin/FileTable', () => ({ files, onEdit, onDelete }) => (
  <div data-testid="file-table">
    {files.map(file => (
      <div key={file.id}>
        {file.name}
        <button onClick={() => onEdit(file.id)}>Edit</button>
        <button onClick={() => onDelete(file.id)}>Delete</button>
      </div>
    ))}
  </div>
));

jest.mock('../components/admin/EditMetadataModal', () => ({ file, onClose, onSave }) => (
  <div data-testid="edit-modal">
    {file && <div>Editing {file.name}</div>}
    <button onClick={onClose}>Close</button>
    <button onClick={() => onSave({})}>Save</button>
  </div>
));

// Mock hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Proper mock for useFileManagement
jest.mock('../hooks/useFileManagement', () => ({
  useFileManagement: jest.fn()
}));

describe('AdminPage Component', () => {
  const mockNavigate = jest.fn();
  const mockHandleFileUpload = jest.fn();
  const mockHandleFileEdit = jest.fn();
  const mockHandleFileDelete = jest.fn();
  const mockHandleMetadataUpdate = jest.fn();
  const mockSetSelectedFile = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    require('../hooks/useFileManagement').useFileManagement.mockReturnValue({
      files: [
        { id: '1', name: 'document.pdf', size: '1MB', type: 'PDF' }
      ],
      selectedFile: null,
      handleFileUpload: mockHandleFileUpload,
      handleFileEdit: mockHandleFileEdit,
      handleFileDelete: mockHandleFileDelete,
      handleMetadataUpdate: mockHandleMetadataUpdate,
      setSelectedFile: mockSetSelectedFile,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('handles file upload', () => {
    render(<AdminPage />);
    
    // Simulate file upload
    fireEvent.click(screen.getByText('Upload'));
    
    // Verify the upload handler was called with the expected file object
    expect(mockHandleFileUpload).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'test.pdf' })
    );
  });

  // Other tests remain the same...
  test('renders admin page structure', () => {
    render(<AdminPage />);
    expect(screen.getByTestId('admin-header')).toBeInTheDocument();
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
    expect(screen.getByTestId('file-table')).toBeInTheDocument();
  });

  test('handles file edit', () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByText('Edit'));
    expect(mockHandleFileEdit).toHaveBeenCalledWith('1');
  });

  test('shows edit modal when file is selected', () => {
    require('../hooks/useFileManagement').useFileManagement.mockReturnValueOnce({
      files: [{ id: '1', name: 'document.pdf' }],
      selectedFile: { id: '1', name: 'document.pdf' },
      handleFileUpload: mockHandleFileUpload,
      handleFileEdit: mockHandleFileEdit,
      handleFileDelete: mockHandleFileDelete,
      handleMetadataUpdate: mockHandleMetadataUpdate,
      setSelectedFile: mockSetSelectedFile,
    });
    
    render(<AdminPage />);
    expect(screen.getByText('Editing document.pdf')).toBeInTheDocument();
  });
});