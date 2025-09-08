package com.springboot.pizzaHouse.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Bean;

@Configuration
@PropertySource("file:.env")
public class EnvConfig {
    
    @Bean
    public Dotenv dotenv() {
        return Dotenv.configure()
                .directory(".")  // Look for .env in the root directory
                .ignoreIfMissing()  // Don't throw an error if .env is missing
                .load();
    }
}

