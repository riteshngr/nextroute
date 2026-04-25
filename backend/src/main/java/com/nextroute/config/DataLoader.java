package com.nextroute.config;

import com.nextroute.model.User;
import com.nextroute.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;


@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.name}")
    private String adminName;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public DataLoader(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User(
                adminName,
                adminEmail,
                encoder.encode(adminPassword),
                User.Role.ADMIN
            );
            userRepository.save(admin);
            System.out.println("✅ Admin account created: " + adminEmail);
        } else {
            System.out.println("ℹ️ Admin account already exists: " + adminEmail);
        }
    }
}
