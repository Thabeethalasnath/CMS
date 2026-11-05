package com.company.project.security.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {

    @NotBlank(message = "Reset token is required")
    private String resetToken;

    @NotBlank(message = "New password is required")
    @Size(min = 12, max = 72, message = "Password must be between 12 and 72 characters")
    private String newPassword;

    @NotBlank(message = "Confirm password is required")
    @Size(min = 12, max = 72, message = "Confirm password must be between 12 and 72 characters")
    private String confirmPassword;
}

