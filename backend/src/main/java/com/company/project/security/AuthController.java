package com.company.project.security;

import com.company.project.common.exception.BusinessValidationException;
import com.company.project.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication API", description = "Endpoints for user authentication and session verification")
public class AuthController {

    private final JwtTokenProvider tokenProvider;

    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @Value("${app.auth.admin.username:admin}")
    private String configuredAdminUsername;

    @Value("${app.auth.admin.password:admin123}")
    private String configuredAdminPassword;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LoginResponse {
        private String token;
        private String username;
        private String role;
        private String name;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and return JWT token")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@RequestBody(required = false) LoginRequest request) {
        boolean isDev = "dev".equalsIgnoreCase(activeProfile);

        String username = request != null ? request.getUsername() : null;
        String password = request != null ? request.getPassword() : null;

        if (isDev) {
            // Dev profile: allow demo login if username is omitted or blank
            if (username == null || username.isBlank()) {
                username = "akshit.ujjain";
            }
        } else {
            // Production profile: strictly require valid credentials
            if (username == null || username.isBlank() || password == null || password.isBlank()) {
                throw new BusinessValidationException("Username and password are required.");
            }
            if (!configuredAdminUsername.equals(username) || !configuredAdminPassword.equals(password)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error(401, "UNAUTHORIZED", "Invalid credentials"));
            }
        }

        String role = ("admin".equalsIgnoreCase(username)) ? "ADMIN" : "CEO";
        String displayName = ("akshit.ujjain".equalsIgnoreCase(username)) ? "Akshit Ujjain" : "Administrator";
        String token = tokenProvider.generateToken(username, role);

        LoginResponse response = LoginResponse.builder()
                .token(token)
                .username(username)
                .name(displayName)
                .role(role)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user info from token")
    public ResponseEntity<ApiResponse<Map<String, String>>> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "UNAUTHORIZED", "Unauthenticated"));
        }

        String username = auth.getName();
        String role = auth.getAuthorities().stream()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .findFirst()
                .orElse("CEO");

        String displayName = "akshit.ujjain".equalsIgnoreCase(username) ? "Akshit Ujjain" : username;

        return ResponseEntity.ok(ApiResponse.success("Current user profile", Map.of(
                "username", username,
                "name", displayName,
                "role", role
        )));
    }
}
