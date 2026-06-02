package com.uday.rguktconnect.controller;

import com.uday.rguktconnect.dto.ProfileResponseDTO;
import com.uday.rguktconnect.entity.*;
import com.uday.rguktconnect.repository.user.*;
import com.uday.rguktconnect.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
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

    @Autowired
    private EducationDetailRepository educationDetailRepository;

    @Autowired
    private ProjectDetailRepository projectDetailRepository;

    @Autowired
    private CompanyDetailRepository companyDetailRepository;

    //updating profile photo
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
                    "message", "Profile picture uploaded Successfully", "photoUrl", s3PublicUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/profile/projects")
    public ResponseEntity<?> updateProjects(@RequestBody Project project){
        try{
            String authenticatedEmail = (String) SecurityContextHolder.getContext()
                    .getAuthentication()
                    .getPrincipal();
            User user = userRepository.findByUniversityEmail(authenticatedEmail)
                    .orElseThrow(() -> new RuntimeException("User Not found"));

            project.setUser(user);
            projectDetailRepository.save(project);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Project added successfully" ));
        }catch (Exception e){
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    //this is for getting all profile details
    @GetMapping("/profile")
    public ResponseEntity<?> getFullUserProfile(){
        try{
            String authenticatedEmail = (String) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

            User user = userRepository.findByUniversityEmail(authenticatedEmail)
                    .orElseThrow(() -> new RuntimeException("User account not found"));

            UserDetails userDetails = userDetailsRepository.findByUser(user)
                    .orElseGet(() -> {
                        UserDetails blank = new UserDetails();
                        blank.setUser(user);
                        return userDetailsRepository.save(blank);
                    });
            List<Project> userProjects = projectDetailRepository.findByUser(user);
            List<EducationDetail> usereducationDetails = educationDetailRepository.findByUser(user);
            List<CompanyDetail> usercompanyDetails = companyDetailRepository.findByUser(user);

            ProfileResponseDTO fullProfile = ProfileResponseDTO.builder()
                    .idNumber(user.getIdNumber())
                    .name(user.getName())
                    .universityEmail(user.getUniversityEmail())
                    .mobileNumber(userDetails.getMobileNumber())
                    .personalEmail(userDetails.getPersonalEmail())
                    .branch(userDetails.getBranch())
                    .batch(userDetails.getBatch())
                    .profilePhoto(userDetails.getProfilePhoto())
                    .description(userDetails.getDescription())
                    .githubUrl(userDetails.getGithubUrl())
                    .linkedinUrl(userDetails.getLinkedinUrl())
                    .mentoredStudentsCount(userDetails.getMentoredStudentsCount())
                    .projects(userProjects)
                    .experiences(usercompanyDetails)
                    .education(usereducationDetails)
                    .build();
            return ResponseEntity.ok(fullProfile);

        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

}
