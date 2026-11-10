import { MuxProvider } from '@manulife/mux';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { POST } from 'src/app/api/auth/login/route';
import LoginPage from 'src/components/login/LoginPage';
import { LoginProvider, loginReducer } from 'src/state/login/LoginContext';

function renderLogin() {
  return render(<MuxProvider><LoginProvider><LoginPage /></LoginProvider></MuxProvider>);
}

async function fillForm(user) {
  await user.type(screen.getByRole('textbox', { name: 'User ID' }), 'employee');
  await user.type(screen.getByLabelText('Password', { exact: true }), 'test-password');
  await user.click(screen.getByRole('button', { name: /User role/ }));
  await user.click(await screen.findByRole('option', { name: 'Analyst' }));
}

describe('LARS sign in', () => {
  it('should validate all required fields before making a request', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    renderLogin();
    await userEvent.click(screen.getByRole('button', { name: 'Sign in', exact: true }));
    expect(await screen.findByText('Enter your user ID.')).toBeVisible();
    expect(screen.getByText('Enter your password.')).toBeVisible();
    expect(screen.getByText('Select your user role.')).toBeVisible();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should submit credentials, remember only the user ID, and report unavailable authentication', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ status: 503 });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderLogin();
    await fillForm(user);
    await user.click(screen.getByLabelText('Remember user ID'));
    await user.click(screen.getByRole('button', { name: 'Sign in', exact: true }));
    expect(await screen.findByRole('alert')).toHaveTextContent('not configured yet');
    expect(fetchMock).toHaveBeenCalledWith('/api/auth/login', expect.objectContaining({
      body: JSON.stringify({ userId: 'employee', password: 'test-password', role: 'analyst' }),
    }));
    expect(localStorage.getItem('lars.userId')).toBe('employee');
    expect(localStorage.length).toBe(1);
    expect(screen.getByLabelText('Password', { exact: true })).toHaveValue('');
  });

  it('should restore a remembered user ID and clear it on cancel', async () => {
    localStorage.setItem('lars.userId', 'remembered');
    renderLogin();
    expect(screen.getByRole('textbox', { name: 'User ID' })).toHaveValue('remembered');
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('textbox', { name: 'User ID' })).toHaveValue('');
    expect(localStorage.getItem('lars.userId')).toBeNull();
    expect(screen.getByRole('textbox', { name: 'User ID' })).toHaveFocus();
  });

  it('should reveal support information on request', async () => {
    renderLogin();
    const help = screen.getByRole('button', { name: 'Need help signing in?' });
    fireEvent.click(help);
    expect(help).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Never share your password with support.')).toBeVisible();
  });

  it('should fail closed when no authentication service is configured', async () => {
    const response = await POST();
    expect(response.status).toBe(503);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });

  it('should reset request state without retaining credentials', () => {
    const submitting = loginReducer({}, { type: 'submit' });
    expect(submitting).toEqual({ status: 'submitting', message: '' });
    expect(loginReducer(submitting, { type: 'reset' })).toEqual({ status: 'idle', message: '' });
  });
});