import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ForgotPasswordModal } from '@/features/auth/components/ForgotPasswordModal';
import { authService } from '@/features/auth/services/authService';

describe('ForgotPasswordModal Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Step 1 (email input modal) when open', () => {
    render(
      <ForgotPasswordModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        initialEmail="user@example.com"
      />
    );

    expect(screen.getByRole('heading', { name: /forgot password\?/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your email')).toHaveValue('user@example.com');
    expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ForgotPasswordModal
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('validates email format before sending OTP', async () => {
    render(
      <ForgotPasswordModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        initialEmail=""
      />
    );

    const emailInput = screen.getByPlaceholderText('Enter your email');
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });

    const sendOtpBtn = screen.getByRole('button', { name: /send otp/i });
    fireEvent.submit(sendOtpBtn.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('completes the full flow: Send OTP -> Verify OTP -> Reset Password -> Success', async () => {
    vi.spyOn(authService, 'forgotPassword').mockResolvedValueOnce({
      message: 'If an account with that email exists, an OTP has been sent.',
      cooldownSeconds: 60,
    });
    vi.spyOn(authService, 'verifyOtp').mockResolvedValueOnce({
      resetToken: 'mock-reset-token-xyz',
      expiresInSeconds: 900,
      message: 'OTP verified successfully.',
    });
    vi.spyOn(authService, 'resetPassword').mockResolvedValueOnce({
      message: 'Your password has been successfully reset. Please log in with your new password.',
    });

    render(
      <ForgotPasswordModal
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
        initialEmail="user@example.com"
      />
    );

    // 1. Send OTP
    const sendOtpBtn = screen.getByRole('button', { name: /send otp/i });
    fireEvent.click(sendOtpBtn);

    // 2. Wait for Step 2 (Verify OTP)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /verify otp/i })).toBeInTheDocument();
    });

    // Fill 6 digits of OTP
    const otpBoxes = screen.getAllByRole('textbox');
    expect(otpBoxes.length).toBe(6);
    fireEvent.change(otpBoxes[0], { target: { value: '1' } });
    fireEvent.change(otpBoxes[1], { target: { value: '2' } });
    fireEvent.change(otpBoxes[2], { target: { value: '3' } });
    fireEvent.change(otpBoxes[3], { target: { value: '4' } });
    fireEvent.change(otpBoxes[4], { target: { value: '5' } });
    fireEvent.change(otpBoxes[5], { target: { value: '6' } });

    const verifyBtn = screen.getByRole('button', { name: /verify otp/i });
    fireEvent.click(verifyBtn);

    // 3. Wait for Step 3 (Create New Password)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /create new password/i })).toBeInTheDocument();
    });

    const newPwdInput = screen.getByPlaceholderText(/new password \(min 12 characters\)/i);
    const confirmPwdInput = screen.getByPlaceholderText(/confirm new password/i);

    fireEvent.change(newPwdInput, { target: { value: 'SuperSecret@2026' } });
    fireEvent.change(confirmPwdInput, { target: { value: 'SuperSecret@2026' } });

    // Strength checklist should be satisfied
    expect(screen.getByText('Strong')).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /reset password/i });
    fireEvent.click(resetBtn);

    // 4. Wait for Step 4 (Success)
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /password reset!/i })).toBeInTheDocument();
    });

    const backToLoginBtn = screen.getByRole('button', { name: /back to login/i });
    fireEvent.click(backToLoginBtn);

    expect(mockOnSuccess).toHaveBeenCalledWith('user@example.com');
    expect(mockOnClose).toHaveBeenCalled();
  });
});
