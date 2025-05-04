// src/App.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock components for simplicity
jest.mock('../pages/HomePage', () => () => <div>HomePage</div>);
jest.mock('../pages/AdminPage', () => () => <div>AdminPage</div>);
jest.mock('../pages/SuperAdminPage', () => () => <div>SuperAdminPage</div>);
jest.mock('../pages/SearchPage', () => () => <div>SearchPage</div>);
jest.mock('../pages/APIDocumentation', () => () => <div>APIDocumentation</div>);
jest.mock('../components/Navbar', () => () => <nav>Navbar</nav>);

// Mock PrivateRoute to just render children
jest.mock('../PrivateRoute', () => ({ children }) => <>{children}</>);

describe('App Routing', () => {
  test('renders HomePage on / route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('HomePage')).toBeInTheDocument();
  });

  test('renders AdminPage on /admin route', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('AdminPage')).toBeInTheDocument();
  });

  test('renders SuperAdminPage on /super-admin route', () => {
    render(
      <MemoryRouter initialEntries={['/super-admin']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('SuperAdminPage')).toBeInTheDocument();
  });

  test('renders SearchPage on /search route', () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('SearchPage')).toBeInTheDocument();
  });

  test('renders APIDocumentation on /api-docs route', () => {
    render(
      <MemoryRouter initialEntries={['/api-docs']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('APIDocumentation')).toBeInTheDocument();
  });

  test('renders Navbar always', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Navbar')).toBeInTheDocument();
  });
});
