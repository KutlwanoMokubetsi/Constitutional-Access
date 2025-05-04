// components/admin/__tests__/AdminHeader.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const mockNavigate = jest.fn();

// ✅ Correct place to mock useNavigate — must be before AdminHeader import!
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: jest.fn(),
}));

jest.mock('@auth0/auth0-react');

import AdminHeader from '../admin/AdminHeader'; // Import AFTER mocks

describe('AdminHeader Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useAuth0.mockReturnValue({
      logout: mockLogout,
    });

    useLocation.mockReturnValue({
      pathname: '/admin',
    });

    mockNavigate.mockClear();
    mockLogout.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders desktop header with navigation items', () => {
    render(
      <MemoryRouter>
        <AdminHeader />
      </MemoryRouter>
    );

    const adminElements = screen.getAllByText(/admin/i);
    expect(adminElements.length).toBeGreaterThan(0);
    expect(adminElements[0]).toBeInTheDocument();
  });

  test('highlights current active navigation item', () => {
    render(
      <MemoryRouter>
        <AdminHeader />
      </MemoryRouter>
    );

    const activeItem = screen.getByText(/documents/i).closest('button');
    expect(activeItem).toHaveClass('bg-white/10');
  });

  test('toggles mobile menu when button is clicked', () => {
    render(
      <MemoryRouter>
        <AdminHeader />
      </MemoryRouter>
    );

    const menuButton = screen.getByRole('button', { name: /toggle menu/i });
    fireEvent.click(menuButton);
    expect(screen.getAllByText(/documents/i).length).toBe(2); // Menu open

    fireEvent.click(menuButton);
    expect(screen.getAllByText(/documents/i).length).toBe(1); // Menu closed
  });

  test('calls logout when sign out is clicked', () => {
    render(
      <MemoryRouter>
        <AdminHeader />
      </MemoryRouter>
    );

    const signOutButton = screen.getByText(/sign out/i);
    fireEvent.click(signOutButton);
    expect(mockLogout).toHaveBeenCalledWith({ returnTo: window.location.origin });
  });

  test('navigates to correct path when menu item is clicked', () => {
    render(
      <MemoryRouter>
        <AdminHeader />
      </MemoryRouter>
    );

    const adminButtons = screen.getAllByRole('button', { name: /admin/i });
    fireEvent.click(adminButtons[0]); // click one of them
    expect(mockNavigate).toHaveBeenCalledWith('/super-admin');
  });
});
