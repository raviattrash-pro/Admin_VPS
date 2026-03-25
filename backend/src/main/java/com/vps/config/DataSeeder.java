package com.vps.config;

import com.vps.entity.User;
import com.vps.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("🚀 DATA SEEDER IS RUNNING...");

        // Ensure Admin exists and has correct password
        Optional<User> adminOpt = userRepository.findByUsername("admin");
        if (adminOpt.isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrator");
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            log.info("✅ Default admin account created: username=admin, password=admin123");
        } else {
            User admin = adminOpt.get();
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(User.Role.ADMIN); // Ensure role is correct too
            userRepository.save(admin);
            log.info("🔄 Admin password force-reset to: admin123");
        }

        // Ensure System Admin exists and has correct password
        Optional<User> sysAdminOpt = userRepository.findByUsername("SYS_Account_ravi_Pd");
        if (sysAdminOpt.isEmpty()) {
            User sysAdmin = new User();
            sysAdmin.setUsername("SYS_Account_ravi_Pd");
            sysAdmin.setPassword(passwordEncoder.encode("_RavPd_620032##@@$$"));
            sysAdmin.setFullName("System Administrator");
            sysAdmin.setRole(User.Role.SYSTEM_ADMIN);
            userRepository.save(sysAdmin);
            log.info("✅ System administrator account created successfully.");
        } else {
            User sysAdmin = sysAdminOpt.get();
            sysAdmin.setPassword(passwordEncoder.encode("_RavPd_620032##@@$$"));
            userRepository.save(sysAdmin);
            log.info("🔄 System admin password verified/reset.");
        }

        log.info("🏁 DATA SEEDING COMPLETED.");
    }
}
