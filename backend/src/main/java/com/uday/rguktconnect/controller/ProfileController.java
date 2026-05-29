package com.uday.rguktconnect.controller;

import com.uday.rguktconnect.entity.User;
import com.uday.rguktconnect.entity.UserDetails;
import com.uday.rguktconnect.repository.UserDetailsRepository;
import com.uday.rguktconnect.repository.UserRepository;
import com.uday.rguktconnect.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @PutMapping("/profile/photo")
    public ResponseEntity<?> uploadProfilePhoto(@RequestParam("file")MultipartFile file){
        try{
            String authenticatdEmail = (String) SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getPrincipal();
            User user = userRepository.findByUniversityEmail(authenticatdEmail)
                    .orElseThrow(() -> new RuntimeException("User not Found"));

            UserDetails details = userDetailsRepository.findByUser(user)
                    .orElseThrow(() -> new RuntimeException("Profile folder not initialised"));

            String s3PublicUrl = fileStorageService.uploadProfilePhoto(file, user.getIdNumber());

            details.setProfilePhoto(s3PublicUrl);
            userDetailsRepository.save(details);

            return ResponseEntity.ok(Map.of(
                    "message", "Profile picture uploaded Sucessfully", "photoUrl", s3PublicUrl
            ));


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

}
