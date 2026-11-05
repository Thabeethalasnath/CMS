package com.company.project.config;

import org.springframework.boot.autoconfigure.flyway.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Configuration
public class FlywayConfig {

    @Bean
    public FlywayMigrationStrategy flywayMigrationStrategy(DataSource dataSource) {
        return flyway -> {
            try (Connection conn = dataSource.getConnection();
                 Statement stmt = conn.createStatement()) {
                // If V17 was recorded in schema history before the tables were physically created,
                // remove the row so Flyway executes V17 DDL to create expenses and finance_targets
                stmt.executeUpdate(
                        "DELETE FROM public.flyway_schema_history " +
                        "WHERE version = '17' AND NOT EXISTS (" +
                        "    SELECT 1 FROM information_schema.tables WHERE table_name = 'finance_targets'" +
                        ")"
                );
            } catch (Exception e) {
                // Log and continue
            }
            flyway.repair();
            flyway.migrate();
        };
    }
}
