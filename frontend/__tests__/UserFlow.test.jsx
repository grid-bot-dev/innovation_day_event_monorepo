import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserFlow from '../src/pages/UserFlow';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter

jest.mock('antd', () => ({
  Layout: ({ children }) => <div data-testid="layout">{children}</div>,
  Menu: ({ children }) => <div data-testid="menu">{children}</div>,
  Typography: {
    Title: ({ children }) => <h1 data-testid="title">{children}</h1>,
  },
  ConfigProvider: ({ children }) => <div data-testid="config-provider">{children}</div>,
  Card: ({ children }) => <div data-testid="card">{children}</div>,
}));

jest.mock('antd/es/layout/layout', () => ({
  Header: ({ children }) => <div data-testid="header">{children}</div>,
  Content: ({ children }) => <div data-testid="content">{children}</div>,
}));

jest.mock('antd/es/layout/Sider', () => ({
  Sider: ({ children }) => <div data-testid="sider">{children}</div>,
}))

jest.mock('antd/es/menu/menu', () => ({
  Item: ({ children }) => <div data-testid="menu-item">{children}</div>,
}));

// Mock the antd icons
jest.mock('@ant-design/icons', () => ({
  HomeOutlined: () => <span data-testid="home-icon" />,
  BarChartOutlined: () => <span data-testid="bar-chart-icon" />,
  UserOutlined: () => <span data-testid="user-icon" />,
  AppstoreOutlined: () => <span data-testid="appstore-icon" />,
  MenuUnfoldOutlined: () => <span data-testid="menu-unfold-icon" />,
  MenuFoldOutlined: () => <span data-testid="menu-fold-icon" />,
}));

// Mock mermaid
jest.mock('mermaid', () => ({
  initialize: jest.fn(),
  contentLoaded: jest.fn(),
}));

describe('WebsiteFlow Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter> {/* Wrap in MemoryRouter */}
        <UserFlow />
      </MemoryRouter>
    );
    expect(screen.getByTestId('sider')).toBeInTheDocument();
  });

  it('renders the correct title', () => {
    render(
      <MemoryRouter>
        <UserFlow />
      </MemoryRouter>
    );
  
    // Get all elements with the test ID 'title'
    const titleElements = screen.getAllByTestId('title');
  
    // Check if at least one of them contains the correct text
    const correctTitle = titleElements.find(title => title.textContent === 'CDP - Website Flow');
    expect(correctTitle).toBeInTheDocument();
  });
  

  it('renders the menu items', () => {
    render(
      <MemoryRouter> {/* Wrap in MemoryRouter */}
        <UserFlow />
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('User Flow')).toBeInTheDocument();
  });

  it('renders the MermaidDiagram component', () => {
    render(
      <MemoryRouter> {/* Wrap in MemoryRouter */}
        <UserFlow />
      </MemoryRouter>
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });
});