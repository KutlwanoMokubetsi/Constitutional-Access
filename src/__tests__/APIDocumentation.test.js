import React from 'react';
import { render, screen } from '@testing-library/react';
import APIDocumentation from '../pages/APIDocumentation';
import { ChevronRight } from 'lucide-react';

// Mock the ChevronRight icon component
jest.mock('lucide-react', () => ({
    ChevronRight: ({ className }) => (
      <span className={className}>ChevronRightIcon</span>
    )
  }));

describe('APIDocumentation Component', () => {
  test('renders the main heading and description', () => {
    render(<APIDocumentation />);
    
    expect(screen.getByText('Constitutional Archive API Documentation')).toBeInTheDocument();
    expect(screen.getByText('Build applications using our comprehensive REST API')).toBeInTheDocument();
  });

  test('displays the getting started section', () => {
    render(<APIDocumentation />);
    
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText(/programmatic access to constitutional documents/)).toBeInTheDocument();
  });

  test('shows the base URL', () => {
    render(<APIDocumentation />);
    
    expect(screen.getByText('Base URL')).toBeInTheDocument();
    expect(screen.getByText('https://api.constitutionalarchive.com/v1')).toBeInTheDocument();
  });

  test('displays authentication information', () => {
    render(<APIDocumentation />);
    
    expect(screen.getByText('Authentication')).toBeInTheDocument();
    expect(screen.getByText(/API key sent in the Authorization header/)).toBeInTheDocument();
    expect(screen.getByText('Authorization: Bearer YOUR_API_KEY')).toBeInTheDocument();
  });

  test('lists all API endpoints', () => {
    render(<APIDocumentation />);
    
    expect(screen.getByText('Endpoints')).toBeInTheDocument();
    expect(screen.getByText('Search Documents')).toBeInTheDocument();
    expect(screen.getByText('Get Document by ID')).toBeInTheDocument();
    expect(screen.getByText('List Documents')).toBeInTheDocument();
    
    // Verify endpoint methods and paths
    expect(screen.getAllByText('GET')).toHaveLength(3); // Three GET endpoints
    expect(screen.getByText('/documents/search?q={query}')).toBeInTheDocument();
    expect(screen.getByText('/documents/{id}')).toBeInTheDocument();
    expect(screen.getByText('/documents')).toBeInTheDocument();
  });

  test('shows example request for search endpoint', () => {
    render(<APIDocumentation />);
    
    expect(screen.getByText('Example Request')).toBeInTheDocument();
    expect(screen.getByText(/fetch\('https:\/\/api.constitutionalarchive.com\/v1\/documents\/search\?q=freedom'/)).toBeInTheDocument();
  });

  test('displays response format information', () => {
    render(<APIDocumentation />);

    expect(screen.getByText('Response Format')).toBeInTheDocument();
    expect(screen.getByText(/All responses are in JSON format/)).toBeInTheDocument();
    
    // Fix for the "success" text - use a more specific query
    const responseExample = screen.getByLabelText('Response Example');
    expect(responseExample).toHaveTextContent('"success": true');
    expect(responseExample).toHaveTextContent('"data": {');
  });

  test('renders chevron icons for each endpoint', () => {
    render(<APIDocumentation />);
    
    // Verify the mock icon was called and rendered for each endpoint
    const chevrons = screen.getAllByText('ChevronRightIcon');
    expect(chevrons).toHaveLength(3); // Should be one for each endpoint
  });
});