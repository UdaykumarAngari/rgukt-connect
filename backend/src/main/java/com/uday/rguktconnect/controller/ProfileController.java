package com.uday.rguktconnect.controller;

import com.uday.rguktconnect.dto.ProfileResponseDTO;
import com.uday.rguktconnect.dto.ProfileUpdateRequestDTO;
import com.uday.rguktconnect.entity.EducationDetail;
import com.uday.rguktconnect.entity.Project;
import com.uday.rguktconnect.entity.UserExperiences;
import com.uday.rguktconnect.service.user.impl.ProfileServiceImpl; // Consider changing to the interface ProfileService if applicable
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileServiceImpl profileService;

    // Helper method to keep authentication code clean and readable
    private String getAuthenticatedEmail() {
        return (String) Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication()
        ).getPrincipal();
    }


    // Get all profile details
    @GetMapping("/profile")
    public ResponseEntity<?> getFullUserProfile() {
        ProfileResponseDTO profile = profileService.getFullProfile(getAuthenticatedEmail());
        return ResponseEntity.ok(profile);
    }

    // Update basic user metadata details
    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequestDTO profileUpdateRequestDTO) {
        profileService.updateProfileDetails(getAuthenticatedEmail(), profileUpdateRequestDTO);
        return ResponseEntity.ok(Map.of("message", "Profile details updated successfully!"));
    }

    // Updating profile photo avatar asset
    @PutMapping("/profile/photo")
    public ResponseEntity<?> uploadProfilePhoto(@RequestParam("file") MultipartFile file) {
        return profileService.uploadProfilePhoto(file, getAuthenticatedEmail());
    }

    // Add a new project
    @PostMapping("/profile/projects")
    public ResponseEntity<?> addProject(@RequestBody Project project) {
        Project savedProject = profileService.addProject(project, getAuthenticatedEmail());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Project added successfully!",
                        "project", savedProject
                ));
    }
    // Update an existing project
    @PutMapping("/profile/projects/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        Project updatedProject = profileService.updateProject(id, getAuthenticatedEmail(), projectDetails);
        return ResponseEntity.ok(Map.of("message", "Project updated successfully!", "project", updatedProject));
    }

    // Delete a project
    @DeleteMapping("/profile/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable String id) {
        profileService.deleteProject(Long.valueOf(id), getAuthenticatedEmail());
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully!"));
    }

    // Add a new experience record
    @PostMapping("/profile/experiences")
    public ResponseEntity<?> addExperience(@RequestBody UserExperiences experience) {
        UserExperiences savedExp = profileService.addExperience(getAuthenticatedEmail(), experience);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Experience record added successfully!", "experience", savedExp));
    }

    // Update an existing experience record
    @PutMapping("/profile/experiences/{id}")
    public ResponseEntity<?> updateExperience(@PathVariable Long id, @RequestBody UserExperiences expDetails) {
        UserExperiences updatedExp = profileService.updateExperience(id, getAuthenticatedEmail(), expDetails);
        return ResponseEntity.ok(Map.of("message", "Experience record updated successfully!", "experience", updatedExp));
    }

    // Delete an experience record
    @DeleteMapping("/profile/experiences/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable Long id) {
        profileService.deleteExperience(id, getAuthenticatedEmail());
        return ResponseEntity.ok(Map.of("message", "Experience record deleted successfully!"));
    }


    // Add a new education entry
    @PostMapping("/profile/education")
    public ResponseEntity<?> addEducation(@RequestBody EducationDetail education) {
        EducationDetail savedEdu = profileService.addEducation(getAuthenticatedEmail(), education);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Education record added successfully!", "education", savedEdu));
    }

    // Update an existing education entry
    @PutMapping("/profile/education/{id}")
    public ResponseEntity<?> updateEducation(@PathVariable Long id, @RequestBody EducationDetail eduDetails) {
        EducationDetail updatedEdu = profileService.updateEducation(id, getAuthenticatedEmail(), eduDetails);
        return ResponseEntity.ok(Map.of("message", "Education record updated successfully!", "education", updatedEdu));
    }

    // Delete an education entry
    @DeleteMapping("/profile/education/{id}")
    public ResponseEntity<?> deleteEducation(@PathVariable Long id) {
        profileService.deleteEducation(id, getAuthenticatedEmail());
        return ResponseEntity.ok(Map.of("message", "Education record deleted successfully!"));
    }
}