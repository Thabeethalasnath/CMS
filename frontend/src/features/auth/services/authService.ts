import { apiClient } from '../../../services/api/apiClient';
import { API_ENDPOINTS } from '../../../services/api/apiEndpoints';

export interface ForgotPasswordResponse {
  message: string;
  cooldownSeconds?: number;
}

export interface VerifyOtpResponse {
  resetToken: string;
  expiresInSeconds: number;
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const authService = {
  async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const res = await apiClient.post<ForgotPasswordResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email: email.trim(),
    });
    return res.data;
  },

  async verifyOtp(email: string, otp: string): Promise<VerifyOtpResponse> {
    const res = await apiClient.post<VerifyOtpResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, {
      email: email.trim(),
      otp: otp.trim(),
    });
    return res.data;
  },

  async resetPassword(
    resetToken: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<ResetPasswordResponse> {
    const res = await apiClient.post<ResetPasswordResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      resetToken,
      newPassword,
      confirmPassword,
    });
    return res.data;
  },
};

