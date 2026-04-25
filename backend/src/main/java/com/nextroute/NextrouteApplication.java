package com.nextroute;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the NextRoute backend.
 * Runs standalone with embedded Tomcat.
 */
@SpringBootApplication
public class NextrouteApplication {

    public static void main(String[] args) {
        SpringApplication.run(NextrouteApplication.class, args);
    }
}
