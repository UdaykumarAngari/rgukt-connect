package com.uday.rguktconnect.controller;

import com.uday.rguktconnect.repository.UserRepository;
import com.uday.rguktconnect.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private FileStorageService fileStorageService;

    private UserRepository


}
