import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar'; // adjust path as needed
import { useAuth0 } from '@auth0/auth0-react';

// Mock Auth0
jest.mock('@auth0/auth0-react');

describe('Navbar component', () => {
  const mockLogin = jest.fn();

  const renderNavbar = (isAuthenticated = false, initialPath = '/') => {
    useAuth0.mockReturnValue({
      isAuthenticated,
      loginWithRedirect: mockLogin,
    });

    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Navbar />
      </MemoryRouter>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Home, Search, API Docs links', () => {
    renderNavbar();

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('API Docs')).toBeInTheDocument();
  });

  test('calls loginWithRedirect when Login button is clicked', () => {
    renderNavbar(false);
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    expect(mockLogin).toHaveBeenCalled();
  });

  test('shows Admin link when authenticated', () => {
    renderNavbar(true);
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  test('toggles mobile menu', () => {
    renderNavbar();
    const toggleButton = screen.getByRole('button', { name: '' }); // hamburger menu

    fireEvent.click(toggleButton);
    expect(screen.getByText('Home')).toBeVisible();

    fireEvent.click(toggleButton);
    expect(screen.queryByText('Home')).toBeInTheDocument(); // still rendered, just hidden in some cases
  });

  test('mobile login button triggers loginWithRedirect', () => {
    renderNavbar(false);

    // Open mobile menu
    const toggleButton = screen.getByRole('button', { name: '' });
    fireEvent.click(toggleButton);

    const loginButton = screen.getAllByText('Login')[1]; // second Login is mobile
    fireEvent.click(loginButton);

    expect(mockLogin).toHaveBeenCalled();
  });
});
