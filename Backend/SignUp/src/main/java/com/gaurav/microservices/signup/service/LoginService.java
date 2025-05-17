package com.gaurav.microservices.signup.service;

import com.gaurav.microservices.signup.entity.UserEntity;
import com.gaurav.microservices.signup.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    public boolean authenticate(String username, String password) {
        // Sanitize input to prevent SQL injection
        String sanitizedUsername = sanitize(username);

        // Find user by username and check password
        UserEntity user = userRepository.findByUsername(sanitizedUsername);

        return user != null && user.getPassword().equals(password);
    }

    // Basic sanitization to prevent SQL injection
    private String sanitize(String input) {
        if (input == null) return null;
        return input.replaceAll("[;'\"]", "");
    }
}