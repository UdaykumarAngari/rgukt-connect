package com.uday.rguktconnect.controller;


import com.uday.rguktconnect.dto.AuthResponseDTO;
import com.uday.rguktconnect.dto.UserRequestDTO;
import com.uday.rguktconnect.dto.UserResponseDTO;
import com.uday.rguktconnect.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.text.html.parser.Entity;
import java.nio.file.attribute.PosixFileAttributes;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody UserRequestDTO requestDTO){
        try{
            UserResponseDTO registeredUser = userService.registerUser(requestDTO);
            return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
        }catch (RuntimeException e){
            e.printStackTrace();
            return new ResponseEntity<>((HttpHeaders) null, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody UserRequestDTO userRequestDTO){
        try{
            AuthResponseDTO authResponse = userService.loginUser(userRequestDTO);
            return ResponseEntity.ok(authResponse);
        } catch (RuntimeException e){
             e.printStackTrace();
            return new ResponseEntity<>((HttpHeaders) null, HttpStatus.UNAUTHORIZED);
        }
    }


}