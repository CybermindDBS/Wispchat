package com.cdev.wispchat.security;


import com.cdev.wispchat.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {

    UserRepository userRepository;

    UserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        com.cdev.wispchat.model.entity.User user = userRepository.findById(username)
                .orElseThrow(() -> new UsernameNotFoundException("username/password is incorrect."));
        return User.builder()
                .username(user.getUserId())
                .password(user.getPassword())
                .authorities(Collections.emptyList())
                .build();
    }
}
