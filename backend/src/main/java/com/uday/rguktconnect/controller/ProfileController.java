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

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class ProfileController {

    @Autowired
    private ProfileServiceImpl profileService;

    private String getAuthenticatedEmail() {
        return (String) Objects.requireNonNull(
                SecurityContextHolder.getContext().getAuthentication()
        ).getPrincipal();
    }

    @GetMapping("/directory")
    public ResponseEntity<List<ProfileResponseDTO>> getAlumniDirectory() {
        List<ProfileResponseDTO> directory = profileService.getAlumniDirectory(getAuthenticatedEmail());
        return ResponseEntity.ok(directory);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getFullUserProfile() {
        ProfileResponseDTO profile = profileService.getFullProfile(getAuthenticatedEmail());
        return ResponseEntity.ok(profile);
    }

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getOtherUserProfile(@PathVariable Long userId) {
        ProfileResponseDTO profile = profileService.getFullProfileById(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequestDTO profileUpdateRequestDTO) {
        profileService.updateProfileDetails(getAuthenticatedEmail(), profileUpdateRequestDTO);
        return ResponseEntity.ok(Map.of("message", "Profile details updated successfully!"));
    }

    @PutMapping("/profile/photo")
    public ResponseEntity<?> uploadProfilePhoto(@RequestParam("file") MultipartFile file) {
        return profileService.uploadProfilePhoto(file, getAuthenticatedEmail());
    }

    @PostMapping("/profile/projects")
    public ResponseEntity<?> addProject(@RequestBody Project project) {
        Project savedProject = profileService.addProject(project, getAuthenticatedEmail());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "message", "Project added successfully!",
                        "project", savedProject
                ));
    }

    @PutMapping("/profile/projects/{id}")
    public ResponseEntity<?> updateProject(@PathVariable Long id, @RequestBody Project projectDetails) {
        Project updatedProject = profileService.updateProject(id, getAuthenticatedEmail(), projectDetails);
        return ResponseEntity.ok(Map.of("message", "Project updated successfully!", "project", updatedProject));
    }

    @DeleteMapping("/profile/projects/{id}")
    public ResponseEntity<?> deleteProject(@PathVariable String id) {
        profileService.deleteProject(Long.valueOf(id), getAuthenticatedEmail());
        return ResponseEntity.ok(Map.of("message", "Project deleted successfully!"));
    }

    @PostMapping("/profile/experiences")
    public ResponseEntity<?> addExperience(@RequestBody UserExperiences experience) {
        UserExperiences savedExp = profileService.addExperience(getAuthenticatedEmail(), experience);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Experience record added successfully!", "experience", savedExp));
    }

    @PutMapping("/profile/experiences/{id}")
    public ResponseEntity<?> updateExperience(@PathVariable Long id, @RequestBody UserExperiences expDetails) {
        UserExperiences updatedExp = profileService.updateExperience(id, getAuthenticatedEmail(), expDetails);
        return ResponseEntity.ok(Map.of("message", "Experience record updated successfully!", "experience", updatedExp));
    }

    @DeleteMapping("/profile/experiences/{id}")
    public ResponseEntity<?> deleteExperience(@PathVariable Long id) {
        profileService.deleteExperience(id, getAuthenticatedEmail());
        return ResponseEntity.ok(Map.of("message", "Experience record deleted successfully!"));
    }
 
    @PostMapping("/profile/education")
    public ResponseEntity<?> addEducation(@RequestBody EducationDetail education) {
        EducationDetail savedEdu = profileService.addEducation(getAuthenticatedEmail(), education);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("message", "Education record added successfully!", "education", savedEdu));
    }

    @PutMapping("/profile/education/{id}")
    public ResponseEntity<?> updateEducation(@PathVariable Long id, @RequestBody EducationDetail eduDetails) {
        EducationDetail updatedEdu = profileService.updateEducation(id, getAuthenticatedEmail(), eduDetails);
        return ResponseEntity.ok(Map.of("message", "Education record updated successfully!", "education", updatedEdu));
    }

    @DeleteMapping("/profile/education/{id}")
    public ResponseEntity<?> deleteEducation(@PathVariable Long id) {
        profileService.deleteEducation(id, getAuthenticatedEmail());
        return ResponseEntity.ok(Map.of("message", "Education record deleted successfully!"));
    }
}