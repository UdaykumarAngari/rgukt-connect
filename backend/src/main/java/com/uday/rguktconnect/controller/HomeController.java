package com.uday.rguktconnect.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HomeController {

    /**
     * 🔒 PROTECTED TESTING ENDPOINT
     * URL: GET http://localhost:4000/api/home
     */
    @GetMapping("/home")
    public ResponseEntity<String> getWelcomeMessage() {
        // 🔑 Retrieve the identity that our JwtFilter verified and stored in context memory
        String currentAuthenticatedEmail = (String) SecurityContextHolder.getContext()
                .getAuthentication()
                .getPrincipal();

        String successMessage = "Welcome to the secure homepage of RGUKT Connect! " +
                "Your JWT Token is working flawlessly. Authenticated User: " + currentAuthenticatedEmail;

        return ResponseEntity.ok(successMessage);
    }
}