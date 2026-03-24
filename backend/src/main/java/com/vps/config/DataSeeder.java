package com.vps.config;

import com.vps.entity.User;
import com.vps.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("Administrator")
                    .role(User.Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("✅ Default admin account created: username=admin, password=admin123");
        }

        // Create System Admin
        if (!userRepository.existsByUsername("SYS_Account_ravi_Pd")) {
            User sysAdmin = User.builder()
                    .username("SYS_Account_ravi_Pd")
                    .password(passwordEncoder.encode("_RavPd_620032##@@$$"))
                    .fullName("System Administrator")
                    .role(User.Role.SYSTEM_ADMIN)
                    .build();
            userRepository.save(sysAdmin);
            log.info("✅ System administrator account created successfully.");
        }
    }
}
