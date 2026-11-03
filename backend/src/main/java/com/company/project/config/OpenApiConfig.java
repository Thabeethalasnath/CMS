package com.company.project.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("KALPANAAA CMS REST API")
                        .version("1.0.0")
                        .description("Backend REST API for KALPANAAA CMS with Collections & Finance Management")
                        .contact(new Contact().name("CMS Engineering").email("dev@kalpanaaa.com"))
                        .license(new License().name("Proprietary")));
    }
}
