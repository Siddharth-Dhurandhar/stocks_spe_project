package com.gaurav.microservices.signup.service;

import com.gaurav.microservices.signup.dto.SignUpRequestDTO;
import com.gaurav.microservices.signup.entity.UserEntity;
import com.gaurav.microservices.signup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SignUpService {

    @Autowired
    private UserRepository userRepository;

    public void registerUser(SignUpRequestDTO signUpRequest) {
        // Validate passwords match
        if (!signUpRequest.getPassword().equals(signUpRequest.getConfirm_password())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        // Check if username already exists
        if (userRepository.existsByUsername(sanitize(signUpRequest.getUsername()))) {
            throw new IllegalArgumentException("Username already exists");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(sanitize(signUpRequest.getEmail()))) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Create user entity
        UserEntity user = new UserEntity();
        user.setUsername(sanitize(signUpRequest.getUsername()));
        user.setFirst_name(sanitize(signUpRequest.getFirst_name()));
        user.setLast_name(sanitize(signUpRequest.getLast_name()));
        user.setEmail(sanitize(signUpRequest.getEmail()));
        user.setPassword(signUpRequest.getPassword()); // Should be encoded in production
        user.setPayment_mode(sanitize(signUpRequest.getPayment_mode()));

        // Save user
        userRepository.save(user);
    }

    // Basic sanitization to prevent SQL injection
    private String sanitize(String input) {
        if (input == null) return null;
        return input.replaceAll("[;'\"]", "");
    }
}