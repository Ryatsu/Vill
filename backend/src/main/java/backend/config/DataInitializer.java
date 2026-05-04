package backend.config;

import backend.Entity.User;
import backend.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if test user already exists
            if (userRepository.findByUsername("fatima").isEmpty()) {
                // Create test user
                User testUser = new User();
                testUser.setName("Fatima's shop");
                testUser.setUsername("fatima");
                testUser.setPassword(passwordEncoder.encode("01234"));
                
                userRepository.save(testUser);
                System.out.println("✓ Test user 'fatima' created successfully");
            } else {
                System.out.println("✓ Test user 'fatima' already exists");
            }
        };
    }
}
