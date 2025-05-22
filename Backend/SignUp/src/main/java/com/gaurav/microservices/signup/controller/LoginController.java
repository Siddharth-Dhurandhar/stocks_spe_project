package com.gaurav.microservices.signup.controller;

import com.gaurav.microservices.signup.dto.LoginRequestDTO;
import com.gaurav.microservices.signup.service.LoginService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequest) {
        try {
            Long userId = loginService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

            if (userId != null) {
                return new ResponseEntity<>(userId, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error during login: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}