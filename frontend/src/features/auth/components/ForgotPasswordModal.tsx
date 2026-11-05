import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  RotateCw,
  X,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { authService } from '../services/authService';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
  initialEmail?: string;
}

type Step = 'EMAIL' | 'OTP' | 'PASSWORD' | 'SUCCESS';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialEmail = '',
}) => {
  const [step, setStep] = useState<Step>('EMAIL');
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState('');

  // Password fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & Timing
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Timers
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(300); // 5 mins
  const [resendCooldown, setResendCooldown] = useState(60); // 60s cooldown

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset modal state when opened or closed
  useEffect(() => {
    if (isOpen) {
      setStep('EMAIL');
      setEmail(initialEmail);
      setOtp(['', '', '', '', '', '']);
      setResetToken('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMessage(null);
      setOtpExpirySeconds(300);
      setResendCooldown(60);
    }
  }, [isOpen, initialEmail]);

  // OTP Expiry countdown
  useEffect(() => {
    if (!isOpen || step !== 'OTP') return;
    if (otpExpirySeconds <= 0) return;

    const timer = setInterval(() => {
      setOtpExpirySeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, step, otpExpirySeconds]);

  // Resend cooldown countdown
  useEffect(() => {
    if (!isOpen || step !== 'OTP') return;
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, step, resendCooldown]);

  if (!isOpen) return null;

  // Format MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authService.forgotPassword(email.trim());
      setOtpExpirySeconds(300);
      setResendCooldown(response.cooldownSeconds || 60);
      setStep('OTP');
      // Focus first OTP input on next tick
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to send OTP. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Handle OTP input typing & auto-advance
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      // Pasted content handling
      const digits = val.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextFocus = Math.min(digits.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const digit = val.replace(/\D/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }
    if (otpExpirySeconds <= 0) {
      setErrorMessage('The OTP has expired. Please request a new one.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await authService.verifyOtp(email.trim(), otpCode);
      if (res.resetToken) {
        setResetToken(res.resetToken);
        setStep('PASSWORD');
      } else {
        setErrorMessage('Verification succeeded but no reset token was received.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid OTP. Please check the code and try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Password strength calculation
  const hasMinLength = newPassword.length >= 12;
  const hasLetter = /[a-zA-Z]/.test(newPassword);
  const hasDigitOrSymbol = /[\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  let strengthScore = 0;
  if (hasMinLength) strengthScore++;
  if (hasLetter) strengthScore++;
  if (hasDigitOrSymbol) strengthScore++;
  if (newPassword.length >= 16) strengthScore++;

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { label: 'None', color: 'bg-slate-200', text: 'text-slate-400' };
    if (strengthScore <= 1) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' };
    if (strengthScore === 2) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' };
    if (strengthScore === 3) return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-500' };
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const strength = getStrengthLabel();

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasMinLength) {
      setErrorMessage('Password must be at least 12 characters.');
      return;
    }
    if (!hasLetter || !hasDigitOrSymbol) {
      setErrorMessage('Password must contain letters and numbers or symbols.');
      return;
    }
    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      await authService.resetPassword(resetToken, newPassword, confirmPassword);
      setStep('SUCCESS');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to reset password. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-[440px] rounded-[28px] box-border flex flex-col items-start bg-white/95 backdrop-blur-md border border-white/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] p-7 sm:p-8 transition-all"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Close Button */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-full hover:bg-slate-100/80 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ==================== STEP 1: EMAIL INPUT ==================== */}
        {step === 'EMAIL' && (
          <div className="w-full flex flex-col items-center">
            {/* Emblem / Badge */}
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600 shadow-sm">
              <Mail className="w-6 h-6 stroke-indigo-600" />
            </div>

            <h2 className="text-[22px] font-bold text-slate-900 text-center tracking-tight mb-1.5">
              Forgot Password?
            </h2>
            <p className="text-[13px] text-slate-500 text-center mb-6 max-w-[290px] leading-relaxed">
              Enter your registered email address to reset your password.
            </p>

            <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
              <div className="w-full relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoFocus
                  disabled={isLoading}
                  className="w-full h-12 bg-slate-50 rounded-xl pl-11 pr-4 text-[14px] text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              {errorMessage && (
                <div className="w-full text-center text-[12px] font-medium text-rose-600 bg-rose-50 border border-rose-200/60 rounded-lg py-2 px-3 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-[14px] rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(79,70,229,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </div>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-[13px] text-slate-500 hover:text-slate-800 font-medium py-1 transition-colors cursor-pointer"
              >
                Back to Login
              </button>
            </form>
          </div>
        )}

        {/* ==================== STEP 2: OTP VERIFICATION ==================== */}
        {step === 'OTP' && (
          <div className="w-full flex flex-col items-center">
            {/* Header with back arrow */}
            <div className="w-full flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => {
                  setStep('EMAIL');
                  setErrorMessage(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 -ml-1 transition-colors flex items-center gap-1 text-[13px] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Change Email</span>
              </button>

              {/* Countdown badge */}
              <div
                className={`flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full ${
                  otpExpirySeconds > 60
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-rose-50 text-rose-600 animate-pulse'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTimer(otpExpirySeconds)}</span>
              </div>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3 text-indigo-600 shadow-sm">
              <ShieldCheck className="w-6 h-6 stroke-indigo-600" />
            </div>

            <h2 className="text-[22px] font-bold text-slate-900 text-center tracking-tight mb-1.5">
              Verify OTP
            </h2>
            <p className="text-[13px] text-slate-500 text-center mb-6 max-w-[310px] leading-relaxed">
              We've sent a 6-digit verification code to{' '}
              <span className="font-semibold text-slate-700">{email}</span>.
            </p>

            <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4">
              {/* 6-box OTP Input */}
              <div className="flex justify-between gap-2 my-1">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    disabled={isLoading}
                    className="w-12 h-12 text-center text-xl font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:bg-white focus:outline-none transition-all shadow-sm"
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="w-full text-center text-[12px] font-medium text-rose-600 bg-rose-50 border border-rose-200/60 rounded-lg py-2 px-3 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6 || otpExpirySeconds <= 0}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-[14px] rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(79,70,229,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <span>Verify OTP</span>
                )}
              </button>

              {/* Resend OTP */}
              <div className="flex items-center justify-center gap-1 text-[13px] text-slate-500 pt-1">
                <span>Didn't receive the code?</span>
                {resendCooldown > 0 ? (
                  <span className="text-slate-400 font-medium">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={isLoading}
                    className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Resend OTP</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* ==================== STEP 3: CREATE NEW PASSWORD ==================== */}
        {step === 'PASSWORD' && (
          <div className="w-full flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-3 text-indigo-600 shadow-sm">
              <Lock className="w-6 h-6 stroke-indigo-600" />
            </div>

            <h2 className="text-[22px] font-bold text-slate-900 text-center tracking-tight mb-1.5">
              Create New Password
            </h2>
            <p className="text-[13px] text-slate-500 text-center mb-5 max-w-[290px] leading-relaxed">
              Your OTP was verified. Please set a secure new password for your account.
            </p>

            <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-3.5">
              {/* New Password */}
              <div className="w-full relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password (min 12 characters)"
                  disabled={isLoading}
                  autoFocus
                  className="w-full h-11 bg-slate-50 rounded-xl pl-11 pr-11 text-[14px] text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  aria-label="Toggle new password visibility"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0 border-0 bg-transparent cursor-pointer"
                >
                  {showNewPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="w-full relative flex items-center">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  disabled={isLoading}
                  className="w-full h-11 bg-slate-50 rounded-xl pl-11 pr-11 text-[14px] text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  aria-label="Toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-0 border-0 bg-transparent cursor-pointer"
                >
                  {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>

              {/* Strength Meter & Checklist */}
              {newPassword.length > 0 && (
                <div className="w-full flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-slate-500">Password Strength</span>
                    <span className={strength.text}>{strength.label}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${Math.min(100, strengthScore * 25)}%` }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] pt-1 text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className={hasMinLength ? 'text-emerald-600' : 'text-slate-400'}>
                        {hasMinLength ? '✓' : '•'}
                      </span>
                      <span>12+ characters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasLetter ? 'text-emerald-600' : 'text-slate-400'}>
                        {hasLetter ? '✓' : '•'}
                      </span>
                      <span>Contains letters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={hasDigitOrSymbol ? 'text-emerald-600' : 'text-slate-400'}>
                        {hasDigitOrSymbol ? '✓' : '•'}
                      </span>
                      <span>Numbers / symbols</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={passwordsMatch ? 'text-emerald-600' : 'text-slate-400'}>
                        {passwordsMatch ? '✓' : '•'}
                      </span>
                      <span>Passwords match</span>
                    </div>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="w-full text-center text-[12px] font-medium text-rose-600 bg-rose-50 border border-rose-200/60 rounded-lg py-2 px-3 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !hasMinLength || !hasLetter || !hasDigitOrSymbol || !passwordsMatch}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-[14px] rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(79,70,229,0.25)] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating password...</span>
                  </div>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          </div>
        )}

        {/* ==================== STEP 4: SUCCESS ==================== */}
        {step === 'SUCCESS' && (
          <div className="w-full flex flex-col items-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4 text-emerald-600 shadow-sm animate-scaleIn">
              <CheckCircle2 className="w-9 h-9 stroke-emerald-600" />
            </div>

            <h2 className="text-[22px] font-bold text-slate-900 text-center tracking-tight mb-2">
              Password Reset!
            </h2>
            <p className="text-[13.5px] text-slate-500 text-center mb-6 max-w-[310px] leading-relaxed">
              Your password has been successfully reset. Please log in with your new password.
            </p>

            <button
              type="button"
              onClick={() => {
                onSuccess(email);
                onClose();
              }}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-[14px] rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(79,70,229,0.25)]"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

