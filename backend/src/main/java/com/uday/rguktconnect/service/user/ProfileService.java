package com.uday.rguktconnect.service.user;

import com.uday.rguktconnect.dto.ProfileResponseDTO;
import com.uday.rguktconnect.dto.ProfileUpdateRequestDTO;
import com.uday.rguktconnect.entity.UserExperiences;
import com.uday.rguktconnect.entity.EducationDetail;
import com.uday.rguktconnect.entity.Project;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface ProfileService {

    List<ProfileResponseDTO> getAlumniDirectory(String currentEmail);
    ProfileResponseDTO getFullProfile(String email);
    ProfileResponseDTO getFullProfileById(Long userId);
    void updateProfileDetails(String email, ProfileUpdateRequestDTO updateDTO);
 
    ResponseEntity<?> uploadProfilePhoto(MultipartFile file, String email);

    Project addProject(Project project, String email);
    UserExperiences addExperience(String email, UserExperiences experience);
    EducationDetail addEducation(String email, EducationDetail education);

    Project updateProject(Long projectId, String email, Project projectDetails);
    void deleteProject(Long projectId, String email);

    UserExperiences updateExperience(Long expId, String email, UserExperiences expDetails);
    void deleteExperience(Long expId, String email);

    EducationDetail updateEducation(Long eduId, String email, EducationDetail eduDetails);
    void deleteEducation(Long eduId, String email);
}