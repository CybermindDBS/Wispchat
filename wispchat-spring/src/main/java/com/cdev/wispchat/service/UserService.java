package com.cdev.wispchat.service;

import com.cdev.wispchat.model.dto.UserDTO;
import com.cdev.wispchat.model.entity.User;
import com.cdev.wispchat.model.mapper.UserMapper;
import com.cdev.wispchat.repository.UserRepository;
import com.cdev.wispchat.security.CurrentUserProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    UserRepository userRepository;
    PasswordEncoder bCryptPasswordEncoder;
    CurrentUserProvider currentUserProvider;
    UserMapper userMapper;

    UserService(UserRepository userRepository, PasswordEncoder bCryptPasswordEncoder, CurrentUserProvider currentUserProvider, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.currentUserProvider = currentUserProvider;
        this.userMapper = userMapper;
    }

    public boolean registerUser(User user) {
        if (userRepository.findById(user.getUserId()).isEmpty()) {
            user.setProvider("LOCAL");
            user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
            userRepository.save(user);
            return true;
        } else return false;
    }

    public UserDTO getUser() {
        User authenticatedUser = currentUserProvider.getAuthenticatedUser();
        return userMapper.toDto(authenticatedUser);
    }

    public List<User> getUsersByIds(Set<String> userIds) {
        return userRepository.findAllById(userIds);
    }

    public Map<String, User> getUserDetails(Set<String> userIds) {
        List<User> memberUserDetails = getUsersByIds(userIds);
        return memberUserDetails.stream().collect(Collectors.toMap(User::getUserId, (user) -> user));
    }

    public UserDTO getUserDetails(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "The given user ID does not exists"));
        return userMapper.toDto(user);
    }

    public void updateUser(User user) {
        User authenticatedUser = currentUserProvider.getAuthenticatedUser();
        if (user.getName() != null && !user.getName().equals(authenticatedUser.getName()))
            authenticatedUser.setName(user.getName());
        if (user.getPassword() != null && !user.getPassword().isBlank())
            authenticatedUser.setPassword(
                    bCryptPasswordEncoder.encode(user.getPassword())
            );
        System.out.println(authenticatedUser.getName());
        userRepository.save(authenticatedUser);
    }

    public boolean userExists(String userId) {
        return userRepository.existsById(userId);
    }
}
