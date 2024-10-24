import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../src/pages/Auth';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

// Mock dependencies
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');
  return {
    ...antd,
    message: {
      error: jest.fn(),
      success: jest.fn(),
    },
    Form: {
      useForm: () => [{ validateFields: jest.fn() }],
    },
  };
});

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: ({ onSuccess, onError }) => (
    <button onClick={() => onSuccess({ tokenId: 'mock-token' })}>
      Google Sign-In
    </button>
  ),
  GoogleOAuthProvider: ({ children }) => <div>{children}</div>,
}));

describe('LoginPage Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders login form correctly', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Log in' })).toBeInTheDocument();
    expect(screen.getByText('Customer 360')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Google Sign-In' })).toBeInTheDocument();
  });

  it('handles form submission with valid inputs', async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    
    expect(screen.getByRole('button', { name: 'Log in' })).toBeDisabled();
    
    jest.advanceTimersByTime(2000);
    
    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith('Successfully logged in!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles form submission with missing inputs', () => {
    render(<LoginPage />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Log in' }));
    
    expect(message.error).toHaveBeenCalledWith('Please fill in all fields');
  });

  it('handles Google Sign-In success', () => {
    render(<LoginPage />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Google Sign-In' }));
    
    expect(message.success).toHaveBeenCalledWith('Successfully logged in with Google!');
  });

  it('handles Google Sign-In error', () => {
    render(<LoginPage />);
    
    const GoogleLogin = require('@react-oauth/google').GoogleLogin;
    GoogleLogin.mockImplementationOnce(({ onError }) => (
      <button onClick={() => onError()}>Google Sign-In Error</button>
    ));
    
    fireEvent.click(screen.getByRole('button', { name: 'Google Sign-In Error' }));
    
    expect(message.error).toHaveBeenCalledWith('Google Sign-In failed. Please try again.');
  });
});