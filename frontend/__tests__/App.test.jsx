// File: frontend/__tests__/App.test.jsx

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import App from '../src/App';
import Auth from '../src/pages/Auth';
import Dashboard from '../src/pages/Dashboard';
import CDPTransformations from '../src/pages/CDPTransformations';
import UserFlow from '../src/pages/UserFlow';

// Mock the router components
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  createBrowserRouter: jest.fn(),
  RouterProvider: jest.fn(() => null),
  Navigate: jest.fn(() => null),
}));

// Mock the page components
jest.mock('../src/pages/Auth', () => jest.fn(() => null));
jest.mock('../src/pages/Dashboard', () => jest.fn(() => null));
jest.mock('../src/pages/CDPTransformations', () => jest.fn(() => null));
jest.mock('../src/pages/UserFlow', () => jest.fn(() => null));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<App />);
    expect(RouterProvider).toHaveBeenCalled();
  });

  it('creates correct route configuration', () => {
    render(<App />);
    const routesConfig = createBrowserRouter.mock.calls[0][0];
    
    expect(routesConfig).toHaveLength(5);
    expect(routesConfig[0].path).toBe('/');
    expect(routesConfig[1].path).toBe('/login');
    expect(routesConfig[2].path).toBe('/dashboard');
    expect(routesConfig[3].path).toBe('/cdp-transformation');
    expect(routesConfig[4].path).toBe('/userflow');
  });

  it('root path redirects to login', () => {
    render(<App />);
    const routesConfig = createBrowserRouter.mock.calls[0][0];
    
    expect(routesConfig[0].element.type).toBe(Navigate);
    expect(routesConfig[0].element.props.to).toBe('/login');
  });

  it('correct components are used for each route', () => {
    render(<App />);
    const routesConfig = createBrowserRouter.mock.calls[0][0];
    
    expect(routesConfig[1].element.type).toBe(Auth);
    expect(routesConfig[2].element.type).toBe(Dashboard);
    expect(routesConfig[3].element.type).toBe(CDPTransformations);
    expect(routesConfig[4].element.type).toBe(UserFlow);
  });

  it('RouterProvider is called with correct router', () => {
    const mockRouter = {};
    createBrowserRouter.mockReturnValue(mockRouter);

    render(<App />);

    expect(RouterProvider).toHaveBeenCalledWith(
      expect.objectContaining({ router: mockRouter }),
      expect.anything()
    );
  });

  it('createBrowserRouter is called with correct routes', () => {
    render(<App />);
    
    expect(createBrowserRouter).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ path: '/' }),
        expect.objectContaining({ path: '/login' }),
        expect.objectContaining({ path: '/dashboard' }),
        expect.objectContaining({ path: '/cdp-transformation' }),
        expect.objectContaining({ path: '/userflow' })
      ])
    );
  });
});