package com.company.project.security.service;

import com.company.project.security.dto.*;

public interface PasswordResetService {

    ForgotPasswordResponse requestPasswordReset(ForgotPasswordRequest request, String clientIp);

    VerifyOtpResponse verifyOtp(VerifyOtpRequest request, String clientIp);

    ResetPasswordResponse resetPassword(ResetPasswordRequest request, String clientIp);
}

