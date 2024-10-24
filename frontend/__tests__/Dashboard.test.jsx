// File: frontend/__tests__/Dashboard.test.jsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { act } from 'react-dom/test-utils';
import Dashboard from '../src/pages/Dashboard';
import * as PlotlyModule from 'plotly.js-dist-min';

// Mock the react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

// Mock the Plotly library
jest.mock('plotly.js-dist-min', () => ({
  newPlot: jest.fn(),
}));

// Mock all the Ant Design components
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    Layout: ({ children }) => <div data-testid="layout">{children}</div>,
    Menu: ({ children }) => <div data-testid="menu">{children}</div>,
    Card: ({ children, title }) => <div data-testid="card" title={title}>{children}</div>,
    Table: () => <div data-testid="table" />,
    DatePicker: { RangePicker: () => <div data-testid="range-picker" /> },
    Row: ({ children }) => <div data-testid="row">{children}</div>,
    Col: ({ children }) => <div data-testid="col">{children}</div>,
    ConfigProvider: ({ children }) => <div data-testid="config-provider">{children}</div>,
  };
});

// Mock the fetch function
global.fetch = jest.fn();

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(<Dashboard />);
    });
    expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('fetches data on mount', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: 'mocked data' }),
    });

    await act(async () => {
      render(<Dashboard />);
    });

    expect(global.fetch).toHaveBeenCalledTimes(8); // 8 fetch functions
  });

  it('handles fetch error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(<Dashboard />);
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching KPIs:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });

  it('creates charts after data is loaded', async () => {
    const mockData = {
      customerSegments: [{ values: [1, 2, 3], labels: ['A', 'B', 'C'] }],
      monthlyRevenue: [{ x: [1, 2, 3], y: [100, 200, 300] }],
      productPerformance: { x: ['A', 'B', 'C'], y: [1, 2, 3] },
      satisfactionScore: [{ value: 8.5, gauge: {}, domain: {}, hovertemplate: '', alignmentgroup: '' }],
      churnRisk: [{ values: [10, 20, 70], labels: ['High', 'Medium', 'Low'] }],
      rfmSegmentation: [{ x: [1], y: [2], z: [3] }],
    };

    global.fetch.mockImplementation((url) => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockData[url.split('/').pop()] }),
      });
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(PlotlyModule.newPlot).toHaveBeenCalledTimes(6); // 6 chart creation functions
    });
  });

  it('renders KPI cards', async () => {
    const mockKPIData = {
      total_revenue: '$1,000,000',
      average_order_value: '$100',
      customer_lifetime_value: '$500',
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockKPIData),
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByText('TOTAL REVENUE')).toBeInTheDocument();
      expect(screen.getByText('$1,000,000')).toBeInTheDocument();
    });
  });

  it('renders top customers table', async () => {
    const mockTopCustomers = [
      { customer_id: '1', first_name: 'John', last_name: 'Doe', total_lifetime_value: '$1000' },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTopCustomers),
    });

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('table')).toBeInTheDocument();
    });
  });
});