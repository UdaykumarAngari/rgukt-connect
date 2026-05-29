package com.uday.rguktconnect.controller;


import com.uday.rguktconnect.dto.AuthRequestDTO;
import com.uday.rguktconnect.dto.AuthResponseDTO;
import com.uday.rguktconnect.dto.UserRegisterRequestDTO;
import com.uday.rguktconnect.dto.UserResponseDTO;
import com.uday.rguktconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.parser.Entity;
import java.nio.file.attribute.PosixFileAttributes;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequestDTO requestDTO){
        try{
            UserResponseDTO registeredUser = userService.registerUser(requestDTO);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        }catch (RuntimeException e){
//            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO authRequestDTO){
        try{
            AuthResponseDTO authResponse = userService.loginUser(authRequestDTO);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e){
             //e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }


}