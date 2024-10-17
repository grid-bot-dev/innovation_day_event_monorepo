// File: frontend/__tests__/CDPTransformations.test.jsx

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CDPTransformations from '../src/pages/CDPTransformations';

// Mock external dependencies
jest.mock('plotly.js-dist-min', () => ({
  newPlot: jest.fn(),
  Fx: { hover: jest.fn() },
}));

jest.mock('mermaid', () => ({
  initialize: jest.fn(),
  contentLoaded: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock Ant Design components
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    Layout: ({ children }) => <div data-testid="layout">{children}</div>,
    Menu: ({ children }) => <div data-testid="menu">{children}</div>,
    Card: ({ children, title }) => (
      <div data-testid="card" title={title}>
        {children}
      </div>
    ),
  };
});

describe('CDPTransformations Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main layout components', () => {
    render(
      <BrowserRouter>
        <CDPTransformations />
      </BrowserRouter>
    );

    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByText('Transformation Tables')).toBeInTheDocument();
    expect(screen.getByTestId('menu')).toBeInTheDocument();
    expect(screen.getAllByTestId('card')).toHaveLength(2);
  });

  it('initializes Plotly diagram', () => {
    render(
      <BrowserRouter>
        <CDPTransformations />
      </BrowserRouter>
    );

    expect(screen.getByTestId('card')).toHaveAttribute('title', 'Database Schema');
    expect(require('plotly.js-dist-min').newPlot).toHaveBeenCalledTimes(1);
  });

  it('initializes Mermaid diagram', () => {
    render(
      <BrowserRouter>
        <CDPTransformations />
      </BrowserRouter>
    );

    expect(require('mermaid').initialize).toHaveBeenCalledTimes(1);
    expect(require('mermaid').contentLoaded).toHaveBeenCalledTimes(1);
  });

  it('toggles sidebar collapse state', () => {
    render(
      <BrowserRouter>
        <CDPTransformations />
      </BrowserRouter>
    );

    const sider = screen.getByTestId('layout').firstChild;
    const collapseButton = sider.querySelector('.ant-layout-sider-trigger');

    act(() => {
      fireEvent.click(collapseButton);
    });

    // Check if the collapsed class is added to the sider
    expect(sider).toHaveClass('ant-layout-sider-collapsed');

    act(() => {
      fireEvent.click(collapseButton);
    });

    // Check if the collapsed class is removed from the sider
    expect(sider).not.toHaveClass('ant-layout-sider-collapsed');
  });

  it('navigates to dashboard when clicking on Dashboard menu item', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);

    render(
      <BrowserRouter>
        <CDPTransformations />
      </BrowserRouter>
    );

    const dashboardMenuItem = screen.getByText('Dashboard');
    fireEvent.click(dashboardMenuItem);

    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to user flow when clicking on User Flow menu item', () => {
    const navigateMock = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigateMock);

    render(
      <BrowserRouter>
        <CDPTransformations />
      </BrowserRouter>
    );

    const userFlowMenuItem = screen.getByText('User Flow');
    fireEvent.click(userFlowMenuItem);

    expect(navigateMock).toHaveBeenCalledWith('/userflow');
  });
});