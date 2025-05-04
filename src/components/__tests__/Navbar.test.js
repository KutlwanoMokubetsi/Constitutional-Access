// components/__tests__/Navbar.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';
import { useAuth0 } from '@auth0/auth0-react';

// Mock Auth0 hook
jest.mock('@auth0/auth0-react');

describe('Navbar Component', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    useAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: mockLogin,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders main navigation links', () => {
    render(
      <MemoryRouter >
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /api docs/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows admin link when authenticated', () => {
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: mockLogin,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
  });

  test('toggles mobile menu', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: /toggle navigation/i });
    fireEvent.click(menuButton);
    
    // Now we should have both desktop and mobile Home links
    const allHomeLinks = screen.getAllByRole('link', { name: /home/i });
    expect(allHomeLinks).toHaveLength(2);
    
    // The mobile link should have mobile-specific classes
    const mobileLink = allHomeLinks.find(link => 
      link.className.includes('block') && 
      link.className.includes('px-3')
    );
    expect(mobileLink).toBeInTheDocument();
    
    // Close mobile menu
    fireEvent.click(menuButton);
    // Verify mobile link is no longer in DOM
    const linksAfterClose = screen.getAllByRole('link', { name: /home/i });
    expect(linksAfterClose).toHaveLength(1);
  });

  test('triggers auth0 login', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);
    expect(mockLogin).toHaveBeenCalled();
  });

  test('highlights active route', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <Navbar />
      </MemoryRouter>
    );

    const searchLink = screen.getByRole('link', { name: /search/i });
    expect(searchLink).toHaveClass('bg-blue-600');
  });
});