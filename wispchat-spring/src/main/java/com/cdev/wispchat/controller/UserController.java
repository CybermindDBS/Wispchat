package com.cdev.wispchat.controller;

import com.cdev.wispchat.model.dto.UserDTO;
import com.cdev.wispchat.model.entity.User;
import com.cdev.wispchat.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/user")
public class UserController {
    UserService userService;

    UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        boolean result = userService.registerUser(user);
        return (result ? ResponseEntity.status(HttpStatus.CREATED).build() : ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(userService.getUser());
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        userService.updateUser(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("{userId}/get")
    public ResponseEntity<UserDTO> getUser(@PathVariable String userId) {
        return ResponseEntity.ok().body(userService.getUserDetails(userId));
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> userExists(@RequestParam String userId) {
        return ResponseEntity.ok().body(userService.userExists(userId));
    }
}
