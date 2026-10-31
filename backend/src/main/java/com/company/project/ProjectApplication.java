package com.company.project;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

@SpringBootApplication
public class ProjectApplication {

    public static void main(String[] args) {
        loadDotEnv();
        validateRequiredEnv();
        SpringApplication.run(ProjectApplication.class, args);
    }

    private static final String[] REQUIRED_VARS = {
        "DB_HOST", "DB_PORT", "DB_NAME", "DB_USERNAME", "DB_PASSWORD", "DB_SSL_MODE", "JWT_SECRET", "CORS_ALLOWED_ORIGINS"
    };

    private static void validateRequiredEnv() {
        String activeProfile = System.getProperty("SPRING_PROFILES_ACTIVE", System.getenv("SPRING_PROFILES_ACTIVE"));
        if ("test".equalsIgnoreCase(activeProfile)) {
            return;
        }
        for (String varName : REQUIRED_VARS) {
            String val = System.getProperty(varName);
            if (val == null || val.isBlank()) {
                val = System.getenv(varName);
            }
            if (val == null || val.isBlank()) {
                throw new IllegalStateException("Missing required environment variable: '" 
                    + varName + "'. Please provide it via environment variable or backend/.env.");
            }
        }
    }

    private static void loadDotEnv() {
        File[] candidates = new File[] {
            new File(".env"),
            new File("backend/.env"),
            new File("../backend/.env"),
            new File("../.env")
        };

        for (File file : candidates) {
            if (file.exists() && file.isFile()) {
                try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        line = line.trim();
                        if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
                            continue;
                        }
                        int eqIdx = line.indexOf('=');
                        String key = line.substring(0, eqIdx).trim();
                        String val = line.substring(eqIdx + 1).trim();
                        if ((val.startsWith("\"") && val.endsWith("\"")) ||
                            (val.startsWith("'") && val.endsWith("'"))) {
                            val = val.substring(1, val.length() - 1);
                        }
                        if (System.getProperty(key) == null && System.getenv(key) == null) {
                            System.setProperty(key, val);
                        }
                    }
                } catch (IOException ignored) {
                }
                break;
            }
        }
    }
}
