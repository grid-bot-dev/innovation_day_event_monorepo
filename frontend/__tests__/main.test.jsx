import React from 'react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from '../src/App.jsx';
import '../src/index.css'; // Direct import to ensure it's loaded

// Mock react-dom/client
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(),
}));

// Mock App component
jest.mock('../src/App.jsx', () => () => 'App Component');

// Mock CSS import
jest.mock('../src/index.css', () => ({}));

describe('main.jsx', () => {
  let originalConsoleError;
  let mockRoot;

  beforeAll(() => {
    // Save original console.error
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Mock createRoot implementation
    mockRoot = { render: jest.fn() };
    createRoot.mockReturnValue(mockRoot);

    // Mock document.getElementById
    document.getElementById = jest.fn().mockReturnValue(document.createElement('div'));
  });

  it('should render App component wrapped in StrictMode', () => {
    // Act: Require the main.jsx module to execute its code
    require('../src/main.jsx');

    // Assert
    expect(document.getElementById).toHaveBeenCalledWith('root');
    expect(createRoot).toHaveBeenCalled();
    expect(mockRoot.render).toHaveBeenCalledTimes(1);

    // Check if StrictMode wraps App component
    const renderCall = mockRoot.render.mock.calls[0][0];
    expect(renderCall.type).toBe(StrictMode);
    expect(renderCall.props.children.type).toBe(App);
  });
});
