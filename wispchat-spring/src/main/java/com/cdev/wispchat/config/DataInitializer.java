package com.cdev.wispchat.config;

import com.cdev.wispchat.model.entity.User;
import com.cdev.wispchat.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        if (!repo.existsById("wispchat_ai")) {
            User user = new User();
            user.setUserId("wispchat_ai");
            user.setPassword(passwordEncoder.encode("secret"));
            user.setName("WispChat AI");
            user.setProvider("LOCAL");
            repo.save(user);
        }
    }
}
